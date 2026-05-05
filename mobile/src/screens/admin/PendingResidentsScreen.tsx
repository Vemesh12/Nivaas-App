import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, X } from "lucide-react-native";
import { userApi } from "../../api/userApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { getApiErrorMessage } from "../../utils/apiError";

type PendingResident = { id: string; fullName: string; phone: string; flatNumber: string };

export default function PendingResidentsScreen() {
  const [residents, setResidents] = useState<PendingResident[]>([]);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await userApi.pendingResidents();
    setResidents(response.data.residents);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const act = async (id: string, action: "approve" | "reject") => {
    try {
      await (action === "approve" ? userApi.approve(id) : userApi.reject(id));
      await load();
    } catch (error: any) {
      Alert.alert("Action failed", getApiErrorMessage(error, "Please try again."));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={residents}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No pending residents" />}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mt-1 text-muted">{item.flatNumber} - {item.phone}</Text>
            <View className="mt-4 flex-row gap-3">
              <Button title="Approve" icon={<Check color="#FFFFFF" size={18} />} className="flex-1" onPress={() => act(item.id, "approve")} />
              <Button title="Reject" icon={<X color="#17231D" size={18} />} className="flex-1" variant="secondary" onPress={() => act(item.id, "reject")} />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
