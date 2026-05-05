import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";
import { getApiErrorMessage, isInvalidCredentialsError } from "../../utils/apiError";
import { FieldErrors, isBlank } from "../../utils/formValidation";

type LoginField = "identifier" | "password";

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const submit = async () => {
    const nextErrors: FieldErrors<LoginField> = {};
    if (isBlank(identifier)) nextErrors.identifier = "Enter your phone number or email.";
    if (isBlank(password)) nextErrors.password = "Enter your password.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await login(identifier.trim(), password);
    } catch (error: any) {
      const message = isInvalidCredentialsError(error)
        ? "Phone/email or password is wrong. Please try again."
        : getApiErrorMessage(error, "Please check your credentials.");
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 px-5 py-6">
        <View className="flex-1">
          <View className="items-center pt-8">
            <Header title="Nivaas" subtitle="Structured updates for your verified neighbourhood." align="center" />
          </View>
          <View className="flex-1 justify-center pb-16">
            <View>
            <Input label="Phone or email" value={identifier} onChangeText={(value) => {
              setIdentifier(value);
              if (errors.identifier) setErrors((current) => ({ ...current, identifier: undefined }));
            }} autoCapitalize="none" error={errors.identifier} />
            <Input label="Password" value={password} onChangeText={(value) => {
              setPassword(value);
              if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
            }} secureTextEntry showPasswordToggle error={errors.password} />
            <Button title="Login" loading={loading} onPress={submit} />
            <TouchableOpacity className="mt-5 items-center" onPress={() => navigation.navigate("Register")}>
              <Text className="font-semibold text-primary">Create a resident account</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
