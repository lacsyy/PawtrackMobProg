import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState("Community");
  const [organization, setOrganization] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>🐾 Stray Animal Rescue</Text>
        <Text style={styles.subtitle}>
          Join our community to help animals in need
        </Text>

        {/* Role Selection */}
        <Text style={styles.label}>I am a...</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "Community" && styles.selectedRole,
            ]}
            onPress={() => setSelectedRole("Community")}
          >
            <Ionicons name="person-outline" size={22} color="#007bff" />
            <Text style={styles.roleTitle}>Community</Text>
            <Text style={styles.roleDesc}>Report animals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "Rescuer" && styles.selectedRole,
            ]}
            onPress={() => setSelectedRole("Rescuer")}
          >
            <Feather name="shield" size={22} color="#007bff" />
            <Text style={styles.roleTitle}>Rescuer</Text>
            <Text style={styles.roleDesc}>Save animals</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="phone" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* NGO Field only if Rescuer */}
        {selectedRole === "Rescuer" && (
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={18} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Organization / NGO"
              value={organization}
              onChangeText={setOrganization}
            />
          </View>
        )}

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Sign in here
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e6f9f5" },
  scroll: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#009688",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedRole: {
    borderColor: "#009688",
    backgroundColor: "#e0f7f4",
  },
  roleTitle: { fontWeight: "bold", color: "#333", marginTop: 5 },
  roleDesc: { fontSize: 12, color: "#777" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 10 },
  createButton: {
    backgroundColor: "#00bfa5",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: { marginTop: 15, color: "#666" },
  link: { color: "#007bff", fontWeight: "bold" },
});
