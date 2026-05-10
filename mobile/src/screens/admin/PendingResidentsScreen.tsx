import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
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
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const insets = useSafeAreaInsets();
  const load = async () => {
    setLoading(true);
    try {
      const response: any = await userApi.pendingResidents();
      setResidents(response.data.residents);
      setLoadError("");
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Could not load pending residents. Pull down to try again."));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const runAction = async (id: string, action: "approve" | "reject") => {
    setActionId(`${action}:${id}`);
    try {
      await (action === "approve" ? userApi.approve(id) : userApi.reject(id));
      await load();
    } catch (error: any) {
      Alert.alert("Action failed", getApiErrorMessage(error, "Please try again."));
    } finally {
      setActionId(null);
    }
  };

  const act = (resident: PendingResident, action: "approve" | "reject") => {
    if (action === "approve") {
      runAction(resident.id, action);
      return;
    }

    Alert.alert("Reject resident?", `Reject ${resident.fullName}'s request to join this community?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => runAction(resident.id, action) }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={residents}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <EmptyState
            title={loadError ? "Could not load requests" : "No pending residents"}
            message={loadError || "New join requests will appear here for approval."}
          />
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mt-1 text-muted">{item.flatNumber} - {item.phone}</Text>
            <View className="mt-4 flex-row gap-3">
              <Button
                title="Approve"
                icon={<Check color="#FFFFFF" size={18} />}
                className="flex-1"
                loading={actionId === `approve:${item.id}`}
                disabled={!!actionId}
                onPress={() => act(item, "approve")}
              />
              <Button
                title="Reject"
                icon={<X color="#17231D" size={18} />}
                className="flex-1"
                variant="secondary"
                loading={actionId === `reject:${item.id}`}
                disabled={!!actionId}
                onPress={() => act(item, "reject")}
              />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
