import React, { useState, useRef } from "react";
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
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "@/assets/Theme";
import { useMarkers } from "@/contexts/MarkersContext";

export function Camera() {
  const { addMarker, addWildlifeItem } = useMarkers();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"fauna" | "flora">("fauna");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

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
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setCapturedImage(photo.uri);
        let loc = await Location.getCurrentPositionAsync({});
        const userLoc = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              };
        setLocation(userLoc);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      let loc = await Location.getCurrentPositionAsync({});
      const userLoc = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            };
      setLocation(userLoc);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleSubmit = async () => {
    if (!capturedImage || !title || !description) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    // TODO: Replace with database logic when backend is ready
    /*const formData = new FormData();
    formData.append("image", {
      uri: capturedImage,
      name: `sighting_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);
    
    formData.append("title", title);
    formData.append("scientificName", scientificName);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("latitude", location?.latitude.toString() || "0");
    formData.append("longitude", location?.longitude.toString() || "0");

    try {
      const response = await fetch(
        'http://YOUR_BACKEND_URL:8080/api/animals/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        // Clear form
        setCapturedImage(null);
        setTitle('');
        setScientificName('');
        setDescription('');
        setType('fauna');
        setLocation(null);

        // Navigate back to Map
        navigation.navigate("Map" as never);

        // Show success message after navigation
        setTimeout(() => {
          Alert.alert("Success", "Your wildlife sighting has been submitted!");
        }, 500);
      } else {
        Alert.alert('Error', data.message || 'Failed to upload data');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload data');
    }*/

    if (location?.latitude !== undefined && location?.longitude !== undefined) {
      // Add to wildlife data (for Dex)
      addWildlifeItem({
        id: `${type}-${Date.now()}`,
        name: title,
        scientificName: scientificName || "Unknown",
        imageUrl: capturedImage,
        type: type,
        coordinate: { latitude: location.latitude, longitude: location.longitude },
        description: description,
      });

      // Clear form
      setCapturedImage(null);
      setTitle('');
      setScientificName('');
      setDescription('');
      setType('fauna');
      setLocation(null);

      // Navigate back to Map
      navigation.navigate("Map" as never);

      // Show success message after navigation
      setTimeout(() => {
        Alert.alert("Success", "Your wildlife sighting has been submitted!");
      }, 500);
    } else {
      Alert.alert("Error", "Location data is missing.");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setTitle("");
    setScientificName("");
    setDescription("");
    setType("fauna");
    setLocation(null)
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
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "fauna" && styles.typeButtonActive,
                ]}
                onPress={() => setType("fauna")}
              >
                <MaterialIcons 
                  name="pets" 
                  size={24} 
                  color={type === "fauna" ? "white" : COLORS.textSecondary} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "fauna" && styles.typeButtonTextActive,
                  ]}
                >
                  Fauna
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "flora" && styles.typeButtonActive,
                ]}
                onPress={() => setType("flora")}
              >
                <MaterialIcons 
                  name="local-florist" 
                  size={24} 
                  color={type === "flora" ? "white" : COLORS.textSecondary} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "flora" && styles.typeButtonTextActive,
                  ]}
                >
                  Flora
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Common Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Red Fox"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Scientific Name (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Vulpes vulpes"
              value={scientificName}
              onChangeText={setScientificName}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you saw..."
              value={description}
              onChangeText={setDescription}
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
                onPress={handleSubmit}
              >
                <MaterialIcons name="check" size={20} color="white" />
                <Text style={styles.submitButtonText}>Submit</Text>
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
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  permissionText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.body,
    textAlign: "center",
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  permissionButton: {
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  permissionButtonText: {
    color: "white",
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bodyBold,
    fontWeight: FONTS.weights.semibold,
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
    paddingHorizontal: SPACING.lg,
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
    backgroundColor: "rgba(200, 213, 185, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 1)",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryDark,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xlarge,
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.headingBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  previewImage: {
    width: "100%",
    height: 300,
    backgroundColor: COLORS.primaryLight,
  },
  form: {
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.semibold,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.body,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeSelector: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  typeButtonActive: {
    backgroundColor: COLORS.accentDark,
    borderColor: COLORS.accentDark,
  },
  typeButtonText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bodyBold,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  typeButtonTextActive: {
    color: "white",
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  retakeButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  retakeButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bodyBold,
    fontWeight: FONTS.weights.semibold,
  },
  submitButton: {
    backgroundColor: COLORS.accentDark,
  },
  submitButtonText: {
    color: "white",
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bodyBold,
    fontWeight: FONTS.weights.semibold,
  },
});