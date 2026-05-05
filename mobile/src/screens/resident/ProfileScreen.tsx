import { useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Save } from "lucide-react-native";
import { userApi } from "../../api/userApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { colors } from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";
import { getApiErrorMessage } from "../../utils/apiError";
import { FieldErrors, isBlank, isValidEmail, isValidUrl } from "../../utils/formValidation";

type ProfileField = "fullName" | "email" | "flatNumber" | "profileImage";

export default function ProfileScreen() {
  const { user, refreshMe, logout } = useAuthStore();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    flatNumber: user?.flatNumber || "",
    profileImage: user?.profileImage || ""
  });
  const [errors, setErrors] = useState<FieldErrors<ProfileField>>({});
  const [showPhoneNumber, setShowPhoneNumber] = useState(!!user?.showPhoneNumber);
  const insets = useSafeAreaInsets();
  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const save = async () => {
    const nextErrors: FieldErrors<ProfileField> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (!isBlank(form.email) && !isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (isBlank(form.flatNumber)) nextErrors.flatNumber = "Enter your flat or house number.";
    if (!isValidUrl(form.profileImage)) nextErrors.profileImage = "Enter a valid image URL, or leave it empty.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await userApi.updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        flatNumber: form.flatNumber.trim(),
        profileImage: form.profileImage.trim()
      });
      await userApi.updatePrivacy(showPhoneNumber);
      await refreshMe();
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (error: any) {
      Alert.alert("Could not save", getApiErrorMessage(error, "Please try again."));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <ScrollView className="px-5" contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 96 }}>
        <Header title="Profile" subtitle={`${user?.role || "RESIDENT"} - ${user?.status || ""}`} />
        <Card>
          <Input label="Full name" value={form.fullName} onChangeText={(v) => set("fullName", v)} error={errors.fullName} />
          <Input label="Email" value={form.email || ""} onChangeText={(v) => set("email", v)} autoCapitalize="none" error={errors.email} />
          <Input label="Flat or house number" value={form.flatNumber} onChangeText={(v) => set("flatNumber", v)} error={errors.flatNumber} />
          <Input label="Profile image URL" value={form.profileImage || ""} onChangeText={(v) => set("profileImage", v)} autoCapitalize="none" error={errors.profileImage} />
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-semibold text-ink">Show phone in directory</Text>
            <Switch value={showPhoneNumber} onValueChange={setShowPhoneNumber} trackColor={{ true: colors.primary }} />
          </View>
          <Button title="Save changes" icon={<Save color="#FFFFFF" size={18} />} onPress={save} />
        </Card>
        <View className="my-5">
          <Button title="Logout" icon={<LogOut color="#17231D" size={18} />} variant="secondary" onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
