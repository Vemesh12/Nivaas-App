import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Trash2 } from "lucide-react-native";
import { userApi } from "../../api/userApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { getApiErrorMessage } from "../../utils/apiError";

type Resident = { id: string; fullName: string; flatNumber: string; phone?: string | null };

export default function ManageMembersScreen() {
  const [members, setMembers] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const insets = useSafeAreaInsets();
  const load = async () => {
    setLoading(true);
    try {
      const response: any = await userApi.directory();
      setMembers(response.data.residents);
      setLoadError("");
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Could not load members. Pull down to try again."));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const runRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await userApi.remove(id);
      await load();
    } catch (error: any) {
      Alert.alert("Could not remove", getApiErrorMessage(error, "Please try again."));
    } finally {
      setRemovingId(null);
    }
  };

  const remove = (member: Resident) => {
    Alert.alert("Remove resident?", `Remove ${member.fullName} from this community?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => runRemove(member.id) }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={members}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <EmptyState
            title={loadError ? "Could not load members" : "No members"}
            message={loadError || "Approved residents will appear here."}
          />
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mb-4 mt-1 text-muted">Flat {item.flatNumber}</Text>
            <Button
              title="Remove resident"
              icon={<Trash2 color="#FFFFFF" size={18} />}
              variant="danger"
              loading={removingId === item.id}
              disabled={!!removingId}
              onPress={() => remove(item)}
            />
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
