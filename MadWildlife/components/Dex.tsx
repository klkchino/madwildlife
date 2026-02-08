import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {defaultDexImage} from "../assets/defaultDexImage"
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "@/assets/Theme";

const Tab = createMaterialTopTabNavigator();

// Default fallback image
const DEFAULT_IMAGE = defaultDexImage;

// Sample data - replace with actual data
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
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={imageError || !item.imageUrl ? DEFAULT_IMAGE : { uri: item.imageUrl }} 
        style={styles.cardImage}
        onError={() => setImageError(true)}
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
          tabBarActiveTintColor: COLORS.accentDark,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.accentDark,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.primaryDark,
          },
          tabBarLabelStyle: {
            fontSize: FONTS.sizes.medium,
            fontWeight: FONTS.weights.semibold,
            fontFamily: FONTS.bodyBold,
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryDark,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxlarge,
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.headingBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primaryLight,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.headingBold,
    color: COLORS.text,
    marginBottom: 5,
  },
  cardScientificName: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bodyItalic,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
  },
});