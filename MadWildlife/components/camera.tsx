import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [observations, setObservations] = useState("");
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Request location permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);

          if (locationPermission) {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
          } else {
            Alert.alert("Location", "Location permission not granted");
          }
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);

        if (locationPermission) {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const handleNext = async () => {
  if (!capturedImage) {
    Alert.alert("Missing Information", "Please capture an image");
    return;
  }

  if (!location) {
    Alert.alert("Missing Location", "Location data is required");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "You must be logged in");
    return;
  }

  try {
    // Use the username (displayName) as the document ID
    const username = user.displayName || user.email?.split("@")[0] || user.uid;
    
    // Store as an object instead of array - serverTimestamp() doesn't work in arrays
    await setDoc(
      doc(db, "userLogs", username),
      {
        tempUserLog: {
          image: capturedImage,
          observations: observations,
          timestamp: new Date(),
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        },
      },
      { merge: true }
    );

    navigation.navigate("fieldGuide" as never);
  } catch (error) {
    console.error("Error saving log:", error);
    Alert.alert("Error", "Failed to save your sighting");
  }
};
/*
  const handleNext = async () => {
    if (!capturedImage) {
      Alert.alert("Missing Information", "Please capture an image");
      return;
    }

    if (!location) {
      Alert.alert("Missing Location", "Location data is required");
      return;
    }

    const user = auth.currentUser; // Use auth from import instead of getAuth()
    if (!user) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    try {
      const username = user.displayName || user.email?.split("@")[0] || user.uid;
      await setDoc(
        doc(db, "userLogs", username),
        {
          tempUserLog: [
            capturedImage,
            observations,
            serverTimestamp(),
            {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          ],
        },
        { merge: true }
      );

      navigation.navigate("fieldGuide" as never);
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert("Error", "Failed to save your sighting");
    }
  };
*/
  const retakePhoto = () => {
    setCapturedImage(null);
    setObservations("");
    setLocation(null);
  };

// If image is captured, show the form
  if (capturedImage) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Wildlife Sighting</Text>
          </View>

          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          <View style={styles.form}>

            <Text style={styles.label}>Observations</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you saw..."
              value={observations}
              onChangeText={setObservations}
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.retakeButton]}
                onPress={retakePhoto}
              >
                <MaterialIcons name="refresh" size={20} color="#666" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleNext}
              >
                <MaterialIcons name="arrow-forward" size={20} color="white" />
                <Text style={styles.submitButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show camera view
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}
          >
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  previewImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#E5E5EA",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 30,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  retakeButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

