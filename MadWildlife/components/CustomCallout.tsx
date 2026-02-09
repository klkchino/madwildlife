import React from "react";
 import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
 import { Callout } from "react-native-maps";
 import { MarkerWithMetadata } from "@/contexts/MarkersContext"
 import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "@/assets/Theme";

 const screenWidth = Dimensions.get("window").width;

 const CustomCallout: React.FC<{
   marker: MarkerWithMetadata;
 }> = ({ marker }) => {
   return (
     <Callout tooltip>
       <View>
         <View style={styles.container}>
           <Image
             source={{
               uri: marker.imageUrl,
             }}
             resizeMode="cover"
             style={{ width: 100, height: "100%" }}
           ></Image>
           <View style={{ paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, flex: 1 }}>
             <Text
               style={{
                 fontWeight: FONTS.weights.bold,
                 fontFamily: FONTS.headingBold,
                 fontSize: FONTS.sizes.large,
                 color: COLORS.text,
                 letterSpacing: 0.3,
                 marginBottom: 4,
               }}
             >
               {marker.title}
             </Text>

             <Text style={{
               fontFamily: FONTS.body,
               fontSize: FONTS.sizes.small,
               color: COLORS.textSecondary,
             }}>{marker.description}</Text>
           </View>
         </View>
         <View style={styles.triangle}></View>
       </View>
     </Callout>
   );
 };

 const styles = StyleSheet.create({
   container: {
     backgroundColor: COLORS.cardBackground,
     width: screenWidth * 0.8,
     flexDirection: "row",
     borderWidth: 2,
     borderColor: COLORS.primaryDark,
     borderRadius: BORDER_RADIUS.md,
     overflow: "hidden",
   },
   triangle: {
     left: (screenWidth * 0.8) / 2 - 10,
     width: 0,
     height: 0,
     backgroundColor: "transparent",
     borderStyle: "solid",
     borderTopWidth: 20,
     borderRightWidth: 10,
     borderBottomWidth: 0,
     borderLeftWidth: 10,
     borderTopColor: COLORS.primaryDark,
     borderRightColor: "transparent",
     borderBottomColor: "transparent",
     borderLeftColor: "transparent",
   },
 });

 export default CustomCallout;