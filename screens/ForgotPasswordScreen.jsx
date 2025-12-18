// screens/ForgotPasswordScreen.jsx
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
} from "react-native";
import { supabase } from "../supabase";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Missing Information", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://your-redirect-url.com/reset", // optional for web; for mobile you can put your app link scheme
      });

      console.log("RESET PASSWORD:", { data, error });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Reset Link Sent",
          "If this email is registered, a password reset link has been sent."
        );
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert("Unexpected error", e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to reset your password.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={[styles.resetButton, loading && { opacity: 0.6 }]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backToLogin}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#B3C6AD",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#F4EDE4",
    width: 320,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  resetButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  backToLogin: {
    color: "#0099ff",
    fontSize: 13,
  },
});
