import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";
import { getApiErrorMessage } from "../../utils/apiError";
import { FieldErrors, isBlank, isValidEmail } from "../../utils/formValidation";

type RegisterField = "fullName" | "phone" | "email" | "password" | "flatNumber";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", flatNumber: "" });
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async () => {
    const nextErrors: FieldErrors<RegisterField> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (form.phone.trim().length < 8) nextErrors.phone = "Enter a valid phone number.";
    if (!isBlank(form.email) && !isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (isBlank(form.flatNumber)) nextErrors.flatNumber = "Enter your flat or house number.";
    if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        flatNumber: form.flatNumber.trim()
      });
    } catch (error: any) {
      Alert.alert("Registration failed", getApiErrorMessage(error, "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <ScrollView className="px-5" contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <Header title="Join Nivaas" subtitle="Create your profile, then join your community by invite code." />
        <Input label="Full name" value={form.fullName} onChangeText={(v) => set("fullName", v)} error={errors.fullName} />
        <Input label="Phone" value={form.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" error={errors.phone} />
        <Input label="Email optional" value={form.email} onChangeText={(v) => set("email", v)} autoCapitalize="none" error={errors.email} />
        <Input label="Flat or house number" value={form.flatNumber} onChangeText={(v) => set("flatNumber", v)} error={errors.flatNumber} />
        <Input label="Password" value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry showPasswordToggle error={errors.password} />
        <Button title="Register" loading={loading} onPress={submit} />
        <TouchableOpacity className="my-5 items-center" onPress={() => navigation.goBack()}>
          <Text className="font-semibold text-primary">Already have an account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
