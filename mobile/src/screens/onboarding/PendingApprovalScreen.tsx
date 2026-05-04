import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut, RefreshCw } from "lucide-react-native";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/authStore";

export default function PendingApprovalScreen() {
  const { refreshMe, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background px-5 py-6" edges={["top", "left", "right"]}>
      <Header title="Approval pending" subtitle="Your request is waiting for admin approval." />
      <Card>
        <Text className="text-base leading-6 text-muted">Once your admin approves you, community posts, notices, and directory will unlock automatically.</Text>
        <View className="mt-5">
          <Button title="Check status" icon={<RefreshCw color="#FFFFFF" size={18} />} onPress={refreshMe} />
        </View>
        <View className="mt-3">
          <Button title="Logout" icon={<LogOut color="#17231D" size={18} />} variant="secondary" onPress={logout} />
        </View>
      </Card>
    </SafeAreaView>
  );
}
