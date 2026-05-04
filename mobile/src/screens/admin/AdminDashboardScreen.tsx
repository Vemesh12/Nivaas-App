import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, FileText, Users } from "lucide-react-native";
import { userApi } from "../../api/userApi";
import Card from "../../components/Card";
import Header from "../../components/Header";

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState({ pendingResidentsCount: 0, totalMembers: 0, totalPosts: 0 });
  const load = async () => {
    const response: any = await userApi.adminDashboard();
    setStats(response.data);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const cards = [
    { title: "Pending residents", value: stats.pendingResidentsCount, route: "PendingResidents", icon: Users },
    { title: "Total members", value: stats.totalMembers, route: "ManageMembers", icon: Users },
    { title: "Total posts", value: stats.totalPosts, route: undefined, icon: FileText },
    { title: "Manage notices", value: "Open", route: "ManageNotices", icon: Bell },
    { title: "Manage members", value: "Open", route: "ManageMembers", icon: Users }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title="Admin" subtitle="Approve residents and keep the community board tidy." />
      <View className="flex-row flex-wrap justify-between">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity key={item.title} className="mb-3 w-[48%]" activeOpacity={0.85} disabled={!item.route} onPress={() => navigation.navigate(item.route)}>
              <Card className="min-h-28">
                <Icon color="#0F8A4B" size={22} />
                <Text className="mt-3 text-sm font-semibold text-muted">{item.title}</Text>
                <Text className="mt-2 text-2xl font-bold text-ink">{item.value}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
