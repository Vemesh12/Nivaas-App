import { useFocusEffect } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { postApi } from "../../../api/postApi";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import EmptyState from "../../../components/EmptyState";
import Header from "../../../components/Header";
import { Post, PostCategory } from "../../../types";
import { formatDate } from "../../../utils/formatDate";

export default function CategoryPostsScreen({
  navigation,
  category,
  title,
  subtitle
}: {
  navigation: any;
  category: PostCategory;
  title: string;
  subtitle: string;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await postApi.list(category);
    setPosts(response.data.posts);
  };
  useFocusEffect(useCallback(() => { load(); }, [category]));

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["top", "left", "right"]}>
      <Header title={title} subtitle={subtitle} />
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Button title={`Create ${title} post`} icon={<Plus color="#FFFFFF" size={18} />} className="mb-4" onPress={() => navigation.navigate("CreatePost", { category })} />}
        ListEmptyComponent={<EmptyState title="Nothing here yet" message="Posts in this category will appear here." />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { id: item.id })} activeOpacity={0.85} className="mb-3">
            <Card>
              <Text className="text-lg font-bold text-ink">{item.title}</Text>
              <Text numberOfLines={3} className="mt-1 text-muted">{item.description}</Text>
              <Text className="mt-3 text-xs text-muted">{item.author.fullName} - {formatDate(item.createdAt)}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
