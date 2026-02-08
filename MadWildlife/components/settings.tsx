import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Main Settings Screen
function SettingsHome({ navigation }: any) {
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Add your delete account logic here
            console.log("Account deleted");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsSection}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <MaterialIcons name="person" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Delete Account Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <MaterialIcons name="delete" size={24} color="#FF3B30" />
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

// Edit Profile Screen
function EditProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Edit Profile</Text>
      <Text style={styles.placeholder}>Edit profile options will go here</Text>
    </View>
  );
}

// Notifications Screen
function NotificationsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Notifications</Text>
      <Text style={styles.placeholder}>Notification settings will go here</Text>
    </View>
  );
}

// Main Settings Component with Navigation
export function Settings() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F2F2F7",
        },
        headerTintColor: "#007AFF",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerBackTitle: "", // Use this instead
        contentStyle: {
          backgroundColor: "#F2F2F7",
        },
        animation: "none",
      }}
    >
      <Stack.Screen 
        name="SettingsHome" 
        component={SettingsHome}
        options={{ 
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 20,
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E5EA",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#8E8E93",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  settingText: {
    flex: 1,
    fontSize: 17,
    color: "#000000",
    marginLeft: 15,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  placeholder: {
    fontSize: 16,
    color: "#8E8E93",
  },
});