import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "@/assets/Theme";

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
            // delete account logic here
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
          <MaterialIcons name="person" size={24} color="#000000" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#000000" />
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
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.accentDark,
        headerTitleStyle: {
          fontWeight: FONTS.weights.semibold,
          fontFamily: FONTS.bodyBold,
        },
        headerBackTitle: "",
        contentStyle: {
          backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
  },
  profileSection: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryDark,
  },
  profileImageContainer: {
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 3,
    borderColor: COLORS.primaryDark,
  },
  username: {
    fontSize: FONTS.sizes.xlarge,
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.headingBold,
    color: COLORS.text,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  settingsSection: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: SPACING.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingText: {
    flex: 1,
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.bodyBold,
    color: COLORS.error,
    fontWeight: FONTS.weights.semibold,
    marginLeft: SPACING.sm,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  screenTitle: {
    fontSize: FONTS.sizes.xlarge,
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.headingBold,
    marginBottom: SPACING.lg,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  placeholder: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
});