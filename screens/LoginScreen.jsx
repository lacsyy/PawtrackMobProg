import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      navigation.navigate("Home");
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Image source={require("../assets/dog.png")} style={styles.logo} />
            <Text style={styles.title}>PawTrack</Text>

            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="password"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 4 }}
              >
                <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.links}>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
                 <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#009688",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  card: {
    backgroundColor: "#ffffff",
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    height: 45,
  },
  eye: {
    fontSize: 20,
  },
  signInButton: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  signInText: {
    color: "#000",
    fontWeight: "500",
  },
  links: {
    flexDirection: "row",
    marginTop: 10,
    gap: 20,
  },
  link: {
    color: "#0099ff",
    fontSize: 13,
  },
});
