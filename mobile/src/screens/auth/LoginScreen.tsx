import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const submit = async () => {
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 px-5 py-6">
        <View className="flex-1 justify-center">
          <Header title="Mohalla" subtitle="Structured updates for your verified neighbourhood." />
          <View className="mt-6">
            <Input label="Phone or email" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" />
            <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" loading={loading} onPress={submit} />
            <TouchableOpacity className="mt-5 items-center" onPress={() => navigation.navigate("Register")}>
              <Text className="font-semibold text-primary">Create a resident account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
