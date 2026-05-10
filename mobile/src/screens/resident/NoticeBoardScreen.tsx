import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { noticeApi } from "../../api/noticeApi";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import { Notice } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";
import { formatDate } from "../../utils/formatDate";

export default function NoticeBoardScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const insets = useSafeAreaInsets();
  const load = async () => {
    setLoading(true);
    try {
      const response: any = await noticeApi.list();
      setNotices(response.data.notices);
      setLoadError("");
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Could not load notices. Pull down to try again."));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title="Notice board" subtitle="Important community announcements first." />
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={notices}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <EmptyState
            title={loadError ? "Could not load notices" : "No notices yet"}
            message={loadError || "Important and regular announcements from admins will appear here."}
          />
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Card className={item.isImportant ? "border-primary" : ""}>
            <Text className="text-xs font-semibold uppercase text-primary">{item.isImportant ? "Important" : "Notice"}</Text>
            <Text className="mt-2 text-lg font-bold text-ink">{item.title}</Text>
            <Text className="mt-1 text-muted">{item.description}</Text>
            <Text className="mt-3 text-xs text-muted">{formatDate(item.createdAt)}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
