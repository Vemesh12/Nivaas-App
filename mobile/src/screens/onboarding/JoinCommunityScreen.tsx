import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut, Send } from "lucide-react-native";
import { communityApi } from "../../api/communityApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";
import { getApiErrorMessage } from "../../utils/apiError";
import { isBlank } from "../../utils/formValidation";

export default function JoinCommunityScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const refreshMe = useAuthStore((state) => state.refreshMe);
  const logout = useAuthStore((state) => state.logout);

  const join = async () => {
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (isBlank(normalizedCode)) {
      setInviteCodeError("Enter your community invite code.");
      return;
    }
    if (normalizedCode.length < 4) {
      setInviteCodeError("Invite code looks too short.");
      return;
    }

    setLoading(true);
    try {
      await communityApi.join(normalizedCode);
      await refreshMe();
      Alert.alert("Request sent", "Wait for your community admin approval.");
    } catch (error: any) {
      const message = error.status === 404 || error.message?.toLowerCase().includes("invalid invite")
        ? "Invite code is invalid. Please check it with your admin."
        : getApiErrorMessage(error, "Check the invite code.");
      Alert.alert("Could not join", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 py-6" edges={["top", "left", "right"]}>
      <Header title="Join your Nivaas" subtitle="Enter the invite code shared by your admin or neighbour." />
      <Card>
        <Input label="Invite code" value={inviteCode} onChangeText={(value) => {
          setInviteCode(value);
          if (inviteCodeError) setInviteCodeError("");
        }} autoCapitalize="characters" error={inviteCodeError} />
        <Button title="Send join request" icon={<Send color="#FFFFFF" size={18} />} loading={loading} onPress={join} />
        <Text className="mt-4 text-center text-muted">After joining, wait for admin approval before accessing posts.</Text>
      </Card>
      <View className="mt-4">
        <Button title="Logout" icon={<LogOut color="#17231D" size={18} />} variant="secondary" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}
