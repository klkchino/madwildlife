import { MapMarkerProps } from "react-native-maps";

export type MarkerWithMetadata = {
  coordinate: MapMarkerProps["coordinate"];
  title?: MapMarkerProps["title"];
  description?: MapMarkerProps["description"];
  imageUrl?: string;
};

export const markers: MarkerWithMetadata[] = [
  {
    coordinate: { latitude: 43.0766, longitude: -89.4000 },
    title: "Bascom Hall",
    description: "The historic centerpiece of North Hill, housing the iconic 272 Bascom lecture hall.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=400",
  },
  {
    coordinate: { latitude: 43.0751, longitude: -89.4048 },
    title: "Van Vleck Hall",
    description: "The primary hub for mathematics, featuring several large tiered lecture halls.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400",
  },
  {
    coordinate: { latitude: 43.0725, longitude: -89.4005 },
    title: "Grainger Hall",
    description: "The modern home of the School of Business, featuring high-tech, amphitheater-style halls.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=400",
  },
  {
    coordinate: { latitude: 43.0734, longitude: -89.4015 },
    title: "Humanities Building",
    description: "A brutalist landmark housing massive lecture halls for history and the arts.",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
  },
  {
    coordinate: { latitude: 43.0749, longitude: -89.4085 },
    title: "Chamberlin Hall",
    description: "The headquarters for Physics, containing large halls used for science demonstrations.",
    imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400",
  },
  {
    coordinate: { latitude: 43.0775, longitude: -89.3986 },
    title: "Science Hall",
    description: "A historic red-brick building used primarily for geography and environmental studies.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
  }
];