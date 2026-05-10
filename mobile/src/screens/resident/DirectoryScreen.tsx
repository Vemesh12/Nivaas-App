import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { userApi } from "../../api/userApi";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import { getApiErrorMessage } from "../../utils/apiError";

type Resident = { id: string; fullName: string; flatNumber: string; phone?: string | null };

export default function DirectoryScreen() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const insets = useSafeAreaInsets();
  const load = async () => {
    setLoading(true);
    try {
      const response: any = await userApi.directory();
      setResidents(response.data.residents);
      setLoadError("");
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Could not load neighbours. Pull down to try again."));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title="Neighbours" subtitle="Approved residents in your community." />
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={residents}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <EmptyState
            title={loadError ? "Could not load neighbours" : "No neighbours yet"}
            message={loadError || "Approved residents from your community will appear here."}
          />
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Card>
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mt-1 text-muted">Flat {item.flatNumber}</Text>
            <Text className="mt-1 text-muted">{item.phone || "Phone hidden by resident"}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
