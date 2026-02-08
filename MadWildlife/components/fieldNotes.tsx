import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function FieldGuide() {
  const [category, setCategory] = useState<"Flora" | "Fauna" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempLog, setTempLog] = useState<any>(null);
  const navigation = useNavigation();

  // Fetch tempUserLog when component mounts
  useEffect(() => {
    fetchTempLog();
  }, []);

  // Fetch species data when category is selected
  useEffect(() => {
    if (category) {
      fetchSpecies(category);
    }
  }, [category]);

  const fetchTempLog = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const username = user.displayName || user.email?.split("@")[0] || user.uid;
      const docRef = doc(db, "userLogs", username);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().tempUserLog) {
        setTempLog(docSnap.data().tempUserLog);
      }
    } catch (error) {
      console.error("Error fetching temp log:", error);
    }
  };

  const fetchSpecies = async (cat: "Flora" | "Fauna") => {
    setLoading(true);
    try {
      const docRef = doc(db, "superLogs", cat);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSpecies(data.species || []);
      }
    } catch (error) {
      console.error("Error fetching species:", error);
    }
    setLoading(false);
  };

  const confirmSelection = async () => {
    if (!selected || !tempLog) {
      Alert.alert("Error", "Missing required data");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in");
        return;
      }

      const username = user.displayName || user.email?.split("@")[0] || user.uid;

      // Create new log entry combining tempUserLog + selected species
      const newLog = {
        category: category,
        commonName: selected.commonName,
        sciName: selected.scientificName,
        fieldNotes: tempLog.observations || "",
        photoAuthor: tempLog.image || "",
        timestamp: tempLog.timestamp || new Date(),
        location: tempLog.location || null,
        status: "map", // or whatever status you need
      };

      // Save to userLogs/{username}/{category}/{auto-generated-id}
      const logRef = doc(collection(db, "userLogs", username, category!));
      await setDoc(logRef, newLog);

      // Clear tempUserLog
      const userLogRef = doc(db, "userLogs", username);
      await setDoc(
        userLogRef,
        {
          tempUserLog: null,
        },
        { merge: true }
      );

      Alert.alert("Success", "Field note saved!", [
        {
          text: "OK",
          onPress: () => {
            setSelected(null);
            setCategory(null);
            navigation.navigate("Map" as never); // or wherever you want to go
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert("Error", "Failed to save field note");
    }
  };

  // Category selection screen
  if (!category) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Field Guide</Text>
          <Text style={styles.headerSubtitle}>Choose a category</Text>
        </View>

        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setCategory("Flora")}
          >
            <Text style={styles.categoryIcon}>🌿</Text>
            <Text style={styles.categoryText}>Flora</Text>
            <Text style={styles.categorySubtext}>Plants & Trees</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setCategory("Fauna")}
          >
            <Text style={styles.categoryIcon}>🦅</Text>
            <Text style={styles.categoryText}>Fauna</Text>
            <Text style={styles.categorySubtext}>Birds & Animals</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Species list screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCategory(null)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={species}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.speciesCard}
              onPress={() => setSelected(item)}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.speciesImage}
                />
              ) : (
                <View style={[styles.speciesImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.speciesInfo}>
                <Text style={styles.commonName} numberOfLines={2}>
                  {item.commonName}
                </Text>
                <Text style={styles.scientificName} numberOfLines={1}>
                  {item.scientificName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.scientificName}-${index}`}
        />
      )}

      {/* Species Detail Modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Show user's captured photo if available */}
            {tempLog?.image ? (
              <Image source={{ uri: tempLog.image }} style={styles.modalImage} />
            ) : selected?.imageUrl ? (
              <Image
                source={{ uri: selected.imageUrl }}
                style={styles.modalImage}
              />
            ) : null}

            <Text style={styles.modalCommonName}>{selected?.commonName}</Text>
            <Text style={styles.modalScientificName}>
              {selected?.scientificName}
            </Text>

            {/* Show user's observations if available */}
            {tempLog?.observations && (
              <View style={styles.observationsBox}>
                <Text style={styles.observationsLabel}>Your Observations:</Text>
                <Text style={styles.observationsText}>
                  {tempLog.observations}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmSelection}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  categoryContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  categoryButton: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  categorySubtext: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
  },
  speciesCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  speciesImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#E5E5EA",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
  },
  speciesInfo: {
    padding: 10,
  },
  commonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  modalImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#E5E5EA",
  },
  modalCommonName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  modalScientificName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 15,
  },
  observationsBox: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  observationsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  observationsText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalConfirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
