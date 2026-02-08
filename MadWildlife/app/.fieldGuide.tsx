import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";

export default function FieldGuide() {
  const [category, setCategory] = useState<"Flora" | "Fauna" | null>(null);
  const [selected, setSelected] = useState<any>(null);

  const confirmSelection = async () => {
    await fetch("http://localhost:8080/api/logs/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "USER_ID",
        category,
        speciesId: selected.id,
      }),
    });
  };

  if (!category) {
    return (
      <View>
        <TouchableOpacity onPress={() => setCategory("Flora")}>
          <Text>Flora</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCategory("Fauna")}>
          <Text>Fauna</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={[]} // fetched superLogs
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelected(item)}>
          <Image source={{ uri: item.image }} />
          <Text>{item.commonName}</Text>
          <Text>{item.sciName}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

