import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { noticeApi } from "../../api/noticeApi";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import { Notice } from "../../types";
import { formatDate } from "../../utils/formatDate";

export default function NoticeBoardScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await noticeApi.list();
    setNotices(response.data.notices);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title="Notice board" subtitle="Important community announcements first." />
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={notices}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No notices" message="Admin notices will appear here." />}
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
