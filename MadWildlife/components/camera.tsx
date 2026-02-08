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
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "@/assets/Theme";

export function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

    // TODO: Add your database logic here
    console.log("Submitting:", {
      image: capturedImage,
      title,
      description,
    });

    // Reset form
    setCapturedImage(null);
    setTitle("");
    setDescription("");

    // Navigate back to Map
    navigation.navigate("Map" as never);

    // Show success message after navigation
    setTimeout(() => {
      Alert.alert("Success", "Your wildlife sighting has been submitted!");
    }, 500);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setTitle("");
    setDescription("");
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
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Red Fox"
              value={title}
              onChangeText={setTitle}
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