import { MapMarkerProps } from "react-native-maps";

// Base interface for all wildlife items
export type WildlifeItem = {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  type: "fauna" | "flora";
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
};

// Type for map markers (legacy compatibility)
export type MarkerWithMetadata = {
  coordinate: MapMarkerProps["coordinate"];
  title?: MapMarkerProps["title"];
  description?: MapMarkerProps["description"];
  imageUrl?: string;
};

// Wildlife Data
export const wildlifeData: WildlifeItem[] = [
  // Fauna
  {
    id: "fauna-1",
    name: "Red Fox",
    scientificName: "Vulpes vulpes",
    imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400",
    type: "fauna",
    coordinate: { latitude: 43.0766, longitude: -89.4000 },
    description: "A clever red fox spotted near Bascom Hall",
  },
  {
    id: "fauna-2",
    name: "White-tailed Deer",
    scientificName: "Odocoileus virginianus",
    imageUrl: "https://images.unsplash.com/photo-1551797538-a19f89817e0b?w=400",
    type: "fauna",
    coordinate: { latitude: 43.0751, longitude: -89.4048 },
    description: "A graceful deer grazing near Van Vleck Hall",
  },
  {
    id: "fauna-3",
    name: "American Robin",
    scientificName: "Turdus migratorius",
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400",
    type: "fauna",
    coordinate: { latitude: 43.0725, longitude: -89.4005 },
    description: "A cheerful robin singing near Grainger Hall",
  },
  {
    id: "fauna-4",
    name: "Eastern Gray Squirrel",
    scientificName: "Sciurus carolinensis",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400",
    type: "fauna",
    coordinate: { latitude: 43.0734, longitude: -89.4015 },
    description: "A busy squirrel collecting acorns near Humanities Building",
  },
  
  // Flora
  {
    id: "flora-1",
    name: "Sugar Maple",
    scientificName: "Acer saccharum",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
    type: "flora",
    coordinate: { latitude: 43.0749, longitude: -89.4085 },
    description: "A majestic sugar maple near Chamberlin Hall",
  },
  {
    id: "flora-2",
    name: "White Oak",
    scientificName: "Quercus alba",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
    type: "flora",
    coordinate: { latitude: 43.0775, longitude: -89.3986 },
    description: "A towering white oak near Science Hall",
  },
  {
    id: "flora-3",
    name: "Wild Bergamot",
    scientificName: "Monarda fistulosa",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
    type: "flora",
    coordinate: { latitude: 43.0760, longitude: -89.4020 },
    description: "Beautiful wild bergamot flowers in bloom",
  },
  {
    id: "flora-4",
    name: "Prairie Coneflower",
    scientificName: "Ratibida pinnata",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400",
    type: "flora",
    coordinate: { latitude: 43.0740, longitude: -89.4030 },
    description: "Vibrant prairie coneflowers in the campus garden",
  },
];

// Helper functions to filter by type
export const getFauna = (): WildlifeItem[] => {
  return wildlifeData.filter(item => item.type === "fauna");
};

export const getFlora = (): WildlifeItem[] => {
  return wildlifeData.filter(item => item.type === "flora");
};

// Convert wildlife items to map markers
export const getMapMarkers = (): MarkerWithMetadata[] => {
  return wildlifeData
    .filter(item => item.coordinate) // Only items with coordinates
    .map(item => ({
      coordinate: item.coordinate!,
      title: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
    }));
};

// Legacy markers export (for backward compatibility)
export const markers: MarkerWithMetadata[] = getMapMarkers();