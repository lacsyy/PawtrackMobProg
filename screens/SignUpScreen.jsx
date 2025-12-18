import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { supabase } from "../supabase";

export default function SignUpScreen({ navigation }) {
  /* ================= THEME ================= */
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === "dark");
  const theme = isDark ? darkTheme : lightTheme;

  /* ================= FORM STATE ================= */
  const [selectedRole, setSelectedRole] = useState("Community");
  const [organization, setOrganization] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SIGN UP ================= */
  const handleSignUp = async () => {
    if (!email || !password || !fullName || !phone || !location) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Sign up error", error.message);
        return;
      }

      const userId = data?.user?.id ?? null;

      if (!userId) {
        Alert.alert(
          "Account created",
          "Please check your email to confirm your account."
        );
        navigation.navigate("Login");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: fullName,
          email,
          phone,
          location,
          role: selectedRole,
          organization: selectedRole === "Rescuer" ? organization : null,
        },
      ]);

      if (profileError) {
        Alert.alert("Profile error", profileError.message);
      } else {
        Alert.alert("Success", "Account created successfully.");
        navigation.navigate("Login");
      }
    } catch (e) {
      Alert.alert("Unexpected error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 🌗 THEME TOGGLE */}
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.logo, { color: theme.primary }]}>
          🐾 Stray Animal Rescue
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Join our community to help animals in need
        </Text>

        <Text style={[styles.label, { color: theme.text }]}>I am a...</Text>

        {/* ================= ROLE ================= */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedRole === "Community" && {
                backgroundColor: theme.selected,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setSelectedRole("Community")}
          >
            <Ionicons name="person-outline" size={22} color={theme.primary} />
            <Text style={[styles.roleTitle, { color: theme.text }]}>
              Community
            </Text>
            <Text style={[styles.roleDesc, { color: theme.textMuted }]}>
              Report animals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedRole === "Rescuer" && {
                backgroundColor: theme.selected,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setSelectedRole("Rescuer")}
          >
            <Feather name="shield" size={22} color={theme.primary} />
            <Text style={[styles.roleTitle, { color: theme.text }]}>
              Rescuer
            </Text>
            <Text style={[styles.roleDesc, { color: theme.textMuted }]}>
              Save animals
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= INPUTS ================= */}
        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
          <Ionicons name="person" size={18} color={theme.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Full Name"
            placeholderTextColor={theme.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
          <MaterialIcons name="email" size={18} color={theme.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
          <Feather name="lock" size={18} color={theme.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
          <Feather name="phone" size={18} color={theme.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Phone Number"
            placeholderTextColor={theme.placeholder}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
          <Ionicons name="location-outline" size={18} color={theme.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Location"
            placeholderTextColor={theme.placeholder}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {selectedRole === "Rescuer" && (
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="business-outline" size={18} color={theme.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Organization / NGO"
              placeholderTextColor={theme.placeholder}
              value={organization}
              onChangeText={setOrganization}
            />
          </View>
        )}

        {/* ================= BUTTON ================= */}
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.primary },
            loading && { opacity: 0.6 },
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Creating Account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: theme.textMuted }]}>
          Already have an account?{" "}
          <Text
            style={[styles.link, { color: theme.primary }]}
            onPress={() => navigation.navigate("Login")}
          >
            Sign in here
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, alignItems: "center", justifyContent: "center" },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  subtitle: { marginBottom: 20, textAlign: "center" },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  roleContainer: { flexDirection: "row", width: "100%", marginBottom: 20 },
  roleButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  roleTitle: { fontWeight: "bold", marginTop: 5 },
  roleDesc: { fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
  },
  input: { flex: 1, paddingVertical: 10 },
  createButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: { marginTop: 15 },
  link: { fontWeight: "bold" },
});

/* ================= THEMES ================= */

const lightTheme = {
  background: "#e6f9f5",
  card: "#ffffff",
  text: "#222",
  textMuted: "#666",
  border: "#ccc",
  inputBg: "#f7f7f7",
  placeholder: "#999",
  icon: "#888",
  primary: "#009688",
  selected: "#e0f7f4",
};

const darkTheme = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  textMuted: "#aaaaaa",
  border: "#333",
  inputBg: "#2a2a2a",
  placeholder: "#888",
  icon: "#bbb",
  primary: "#00bfa5",
  selected: "#1f3d39",
};
