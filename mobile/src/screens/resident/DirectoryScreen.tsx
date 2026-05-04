import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { userApi } from "../../api/userApi";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";

type Resident = { id: string; fullName: string; flatNumber: string; phone?: string | null };

export default function DirectoryScreen() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await userApi.directory();
    setResidents(response.data.residents);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title="Neighbours" subtitle="Approved residents in your community." />
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={residents}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No residents" />}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mt-1 text-muted">Flat {item.flatNumber}</Text>
            <Text className="mt-1 text-muted">{item.phone || "Phone hidden by resident"}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
