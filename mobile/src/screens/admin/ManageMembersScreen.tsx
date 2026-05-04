import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Trash2 } from "lucide-react-native";
import { userApi } from "../../api/userApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";

type Resident = { id: string; fullName: string; flatNumber: string; phone?: string | null };

export default function ManageMembersScreen() {
  const [members, setMembers] = useState<Resident[]>([]);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await userApi.directory();
    setMembers(response.data.residents);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const remove = async (id: string) => {
    try {
      await userApi.remove(id);
      await load();
    } catch (error: any) {
      Alert.alert("Could not remove", error.message || "Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={members}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No members" />}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-lg font-bold text-ink">{item.fullName}</Text>
            <Text className="mb-4 mt-1 text-muted">Flat {item.flatNumber}</Text>
            <Button title="Remove resident" icon={<Trash2 color="#FFFFFF" size={18} />} variant="danger" onPress={() => remove(item.id)} />
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
