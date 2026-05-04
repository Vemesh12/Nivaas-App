import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", flatNumber: "" });
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      await register(form);
    } catch (error: any) {
      Alert.alert("Registration failed", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <ScrollView className="px-5" contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <Header title="Join Mohalla" subtitle="Create your profile, then join your community by invite code." />
        <Input label="Full name" value={form.fullName} onChangeText={(v) => set("fullName", v)} />
        <Input label="Phone" value={form.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" />
        <Input label="Email optional" value={form.email} onChangeText={(v) => set("email", v)} autoCapitalize="none" />
        <Input label="Flat or house number" value={form.flatNumber} onChangeText={(v) => set("flatNumber", v)} />
        <Input label="Password" value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry />
        <Button title="Register" loading={loading} onPress={submit} />
        <TouchableOpacity className="my-5 items-center" onPress={() => navigation.goBack()}>
          <Text className="font-semibold text-primary">Already have an account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
