import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: "Create Account",
            headerStyle: { backgroundColor: "#00bfa5" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            title: "Forgot Password",
            headerStyle: { backgroundColor: "#00bfa5" },
            headerTintColor: "#fff",
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
            headerStyle: { backgroundColor: "#00bfa5" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
