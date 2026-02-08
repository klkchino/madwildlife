import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {defaultDexImage} from "../assets/defaultDexImage"

const Tab = createMaterialTopTabNavigator();

// Default fallback image
const DEFAULT_IMAGE = defaultDexImage;

// Sample data - replace with your actual data
const faunaData = [
  {
    id: "1",
    name: "Red Fox",
    scientificName: "Vulpes vulpes",
    imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400",
  },
  {
    id: "2",
    name: "White-tailed Deer",
    scientificName: "Odocoileus virginianus",
    imageUrl: "https://images.unsplash.com/photo-1551797538-a19f89817e0b?w=400",
  },
  {
    id: "3",
    name: "American Robin",
    scientificName: "Turdus migratorius",
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400",
  },
  {
    id: "4",
    name: "Eastern Gray Squirrel",
    scientificName: "Sciurus carolinensis",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400",
  },
];

const floraData = [
  {
    id: "1",
    name: "Sugar Maple",
    scientificName: "Acer saccharum",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
  },
  {
    id: "2",
    name: "White Oak",
    scientificName: "Quercus alba",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
  },
  {
    id: "3",
    name: "Wild Bergamot",
    scientificName: "Monarda fistulosa",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
  },
  {
    id: "4",
    name: "Prairie Coneflower",
    scientificName: "Ratibida pinnata",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400",
  },
];

type SpeciesItem = {
  id: string;
  name: string;
  scientificName: string;
  imageUrl?: string;
};

const SpeciesCard = ({ item }: { item: SpeciesItem }) => {
  const [imageUri, setImageUri] = useState(item.imageUrl || DEFAULT_IMAGE);

  return (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={{ uri: imageUri }} 
        style={styles.cardImage}
        onError={() => setImageUri(DEFAULT_IMAGE)}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardScientificName}>{item.scientificName}</Text>
      </View>
    </TouchableOpacity>
  );
};

function FaunaScreen() {
  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={faunaData}
        renderItem={({ item }) => <SpeciesCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function FloraScreen() {
  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={floraData}
        renderItem={({ item }) => <SpeciesCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

export function Dex() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wildlife Dex</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarIndicatorStyle: {
            backgroundColor: "#007AFF",
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E5EA",
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
            textTransform: "none",
          },
        }}
      >
        <Tab.Screen name="Fauna" component={FaunaScreen} />
        <Tab.Screen name="Flora" component={FloraScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000000",
  },
  tabContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: "#E5E5EA",
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  cardScientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#8E8E93",
  },
});