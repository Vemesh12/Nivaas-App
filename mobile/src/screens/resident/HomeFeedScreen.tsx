import { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { communityApi } from "../../api/communityApi";
import { postApi } from "../../api/postApi";
import Card from "../../components/Card";
import CategoryBadge from "../../components/CategoryBadge";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import { Community } from "../../types";
import { Post, PostCategory } from "../../types";
import { formatDate } from "../../utils/formatDate";

const categories: PostCategory[] = ["GENERAL", "ALERT", "HELP", "LOST_FOUND", "EVENT"];

export default function HomeFeedScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<PostCategory | undefined>();
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState<Community | null>(null);
  const insets = useSafeAreaInsets();

  const load = async (selected = category) => {
    setLoading(true);
    try {
      const response: any = await postApi.list(selected);
      setPosts(response.data.posts);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunity = async () => {
    try {
      const response: any = await communityApi.myCommunity();
      setCommunity(response.data.community);
    } catch {
      setCommunity(null);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [category]));
  useFocusEffect(useCallback(() => { loadCommunity(); }, []));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="px-5 pt-4">
        <View className="mb-5 items-center">
          <Text className="text-3xl font-extrabold text-primary">Nivaas</Text>
          <Text className="mt-1 text-center text-sm font-semibold text-muted">
            {community?.name || "Your community"}
          </Text>
        </View>
        <Header title="Community feed" subtitle="Pinned notices and neighbour updates in one calm place." />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          className="mb-4"
          ListHeaderComponent={
            <TouchableOpacity onPress={() => setCategory(undefined)} className={`mr-2 rounded-full px-3 py-2 ${!category ? "bg-primary" : "bg-white border border-line"}`}>
              <Text className={`text-sm font-semibold ${!category ? "text-white" : "text-muted"}`}>All</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => <CategoryBadge category={item} active={category === item} onPress={() => setCategory(item)} />}
        />
      </View>
      <FlatList
        className="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load()} />}
        ListEmptyComponent={<EmptyState title="No posts yet" message="Create the first structured update for your Nivaas." />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { id: item.id })} activeOpacity={0.85} className="mb-3">
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold uppercase text-primary">{item.isPinned ? "Pinned" : item.category.replace("_", " ")}</Text>
                <Text className="text-xs text-muted">{formatDate(item.createdAt)}</Text>
              </View>
              <Text className="mt-2 text-lg font-bold text-ink">{item.title}</Text>
              <Text numberOfLines={3} className="mt-1 leading-5 text-muted">{item.description}</Text>
              <Text className="mt-3 text-xs text-muted">By {item.author.fullName} - {item.author.flatNumber} - {item._count?.likes || 0} likes - {item._count?.comments || 0} comments</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("CreatePost")}
        className="absolute right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        style={{ bottom: insets.bottom + 84 }}
      >
        <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
