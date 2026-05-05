import { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Edit3, Heart, MessageCircle, Trash2 } from "lucide-react-native";
import { postApi } from "../../api/postApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";
import { Post } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";
import { formatDate } from "../../utils/formatDate";

export default function PostDetailsScreen({ navigation, route }: any) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const id = route.params.id;

  const load = async () => {
    const response: any = await postApi.get(id);
    setPost(response.data.post);
  };

  useFocusEffect(useCallback(() => { load(); }, [id]));

  const like = async () => {
    await postApi.like(id);
    await load();
  };

  const addComment = async () => {
    if (!comment.trim()) {
      setCommentError("Write a comment before posting.");
      return;
    }
    try {
      await postApi.comment(id, comment.trim());
      setComment("");
      setCommentError("");
      await load();
    } catch (error: any) {
      Alert.alert("Could not comment", getApiErrorMessage(error, "Please try again."));
    }
  };

  const deletePost = () => {
    Alert.alert("Delete post?", "This will permanently remove your post and its comments.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await postApi.remove(id);
            navigation.goBack();
          } catch (error: any) {
            Alert.alert("Could not delete post", getApiErrorMessage(error, "Please try again."));
          }
        }
      }
    ]);
  };

  if (!post) return <SafeAreaView className="flex-1 bg-background px-5 pt-5" edges={["left", "right"]}><Text>Loading...</Text></SafeAreaView>;

  const isOwner = post.author.id === user?.id;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <FlatList
        className="px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}
        data={post.comments || []}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View>
            <Card>
              <Text className="text-xs font-semibold uppercase text-primary">{post.category.replace("_", " ")}</Text>
              <Text className="mt-2 text-2xl font-bold text-ink">{post.title}</Text>
              <Text className="mt-2 leading-6 text-muted">{post.description}</Text>
              <Text className="mt-4 text-xs text-muted">By {post.author.fullName} - {formatDate(post.createdAt)}</Text>
              {isOwner ? (
                <View className="mt-4 flex-row gap-3">
                  <Button
                    title="Edit"
                    icon={<Edit3 color="#17231D" size={18} />}
                    className="flex-1"
                    variant="secondary"
                    onPress={() => navigation.navigate("CreatePost", { mode: "edit", post })}
                  />
                  <Button
                    title="Delete"
                    icon={<Trash2 color="#FFFFFF" size={18} />}
                    className="flex-1"
                    variant="danger"
                    onPress={deletePost}
                  />
                </View>
              ) : null}
              <View className="mt-4">
                <Button title={post.likedByMe ? "Liked" : "Like"} icon={<Heart color={post.likedByMe ? "#17231D" : "#FFFFFF"} size={18} />} variant={post.likedByMe ? "secondary" : "primary"} onPress={like} />
              </View>
            </Card>
            <Text className="mb-2 mt-5 text-lg font-bold text-ink">Comments</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <Text className="font-semibold text-ink">{item.author.fullName}</Text>
            <Text className="mt-1 text-muted">{item.text}</Text>
          </Card>
        )}
        ListFooterComponent={
          <View className="pb-8">
            <Input label="Add comment" value={comment} onChangeText={(value) => {
              setComment(value);
              if (commentError) setCommentError("");
            }} error={commentError} />
            <Button title="Post comment" icon={<MessageCircle color="#FFFFFF" size={18} />} onPress={addComment} />
          </View>
        }
      />
    </SafeAreaView>
  );
}
