import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Heart, MessageCircle } from "lucide-react-native";
import { postApi } from "../../api/postApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Post } from "../../types";
import { formatDate } from "../../utils/formatDate";

export default function PostDetailsScreen({ route }: any) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const insets = useSafeAreaInsets();
  const id = route.params.id;

  const load = async () => {
    const response: any = await postApi.get(id);
    setPost(response.data.post);
  };

  useEffect(() => { load(); }, [id]);

  const like = async () => {
    await postApi.like(id);
    await load();
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      await postApi.comment(id, comment.trim());
      setComment("");
      await load();
    } catch (error: any) {
      Alert.alert("Could not comment", error.message || "Please try again.");
    }
  };

  if (!post) return <SafeAreaView className="flex-1 bg-background px-5 pt-5" edges={["left", "right"]}><Text>Loading...</Text></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <FlatList
        className="px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}
        data={post.comments || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Card>
              <Text className="text-xs font-semibold uppercase text-primary">{post.category.replace("_", " ")}</Text>
              <Text className="mt-2 text-2xl font-bold text-ink">{post.title}</Text>
              <Text className="mt-2 leading-6 text-muted">{post.description}</Text>
              <Text className="mt-4 text-xs text-muted">By {post.author.fullName} - {formatDate(post.createdAt)}</Text>
              <View className="mt-4">
                <Button title={post.likedByMe ? "Liked" : "Like"} icon={<Heart color={post.likedByMe ? "#17231D" : "#FFFFFF"} size={18} />} variant={post.likedByMe ? "secondary" : "primary"} onPress={like} />
              </View>
            </Card>
            <Text className="mb-2 mt-5 text-lg font-bold text-ink">Comments</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="font-semibold text-ink">{item.author.fullName}</Text>
            <Text className="mt-1 text-muted">{item.text}</Text>
          </Card>
        )}
        ListFooterComponent={
          <View className="pb-8">
            <Input label="Add comment" value={comment} onChangeText={setComment} />
            <Button title="Post comment" icon={<MessageCircle color="#FFFFFF" size={18} />} onPress={addComment} />
          </View>
        }
      />
    </SafeAreaView>
  );
}
