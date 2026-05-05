import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Save, Send } from "lucide-react-native";
import { postApi } from "../../api/postApi";
import Button from "../../components/Button";
import CategoryBadge from "../../components/CategoryBadge";
import Input from "../../components/Input";
import { Post, PostCategory } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";
import { FieldErrors, isBlank, isValidUrl } from "../../utils/formValidation";

const categories: PostCategory[] = ["GENERAL", "ALERT", "HELP", "LOST_FOUND", "EVENT"];
type PostFormField = "title" | "description" | "imageUrl";

export default function CreatePostScreen({ navigation, route }: any) {
  const initialCategory = route.params?.category as PostCategory | undefined;
  const editPost = route.params?.mode === "edit" ? route.params?.post as Post : undefined;
  const [form, setForm] = useState({
    title: editPost?.title || "",
    description: editPost?.description || "",
    imageUrl: editPost?.imageUrl || "",
    category: editPost?.category || initialCategory || "GENERAL" as PostCategory
  });
  const [errors, setErrors] = useState<FieldErrors<PostFormField>>({});
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const isEditing = !!editPost;

  const submit = async () => {
    const nextErrors: FieldErrors<PostFormField> = {};
    if (isBlank(form.title)) nextErrors.title = "Enter a post title.";
    else if (form.title.trim().length < 3) nextErrors.title = "Title must be at least 3 characters.";
    if (isBlank(form.description)) nextErrors.description = "Enter a post description.";
    else if (form.description.trim().length < 3) nextErrors.description = "Description must be at least 3 characters.";
    if (!isValidUrl(form.imageUrl)) nextErrors.imageUrl = "Enter a valid image URL, or leave it empty.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim()
      };
      if (isEditing) {
        await postApi.update(editPost.id, payload);
      } else {
        await postApi.create(payload);
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(isEditing ? "Could not update post" : "Could not create post", getApiErrorMessage(error, "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <ScrollView className="px-5" contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}>
        <Input label="Title" value={form.title} onChangeText={(v) => set("title", v)} error={errors.title} />
        <Input label="Description" value={form.description} onChangeText={(v) => set("description", v)} multiline className="min-h-28 pt-3" error={errors.description} />
        <Text className="mb-2 text-sm font-semibold text-ink">Category</Text>
        <View className="mb-3 flex-row flex-wrap" style={{ rowGap: 8 }}>
          {categories.map((item) => <CategoryBadge key={item} category={item} active={form.category === item} onPress={() => setForm((c) => ({ ...c, category: item }))} />)}
        </View>
        <Input label="Image URL optional" value={form.imageUrl} onChangeText={(v) => set("imageUrl", v)} autoCapitalize="none" error={errors.imageUrl} />
        <Button
          title={isEditing ? "Save changes" : "Publish post"}
          icon={isEditing ? <Save color="#FFFFFF" size={18} /> : <Send color="#FFFFFF" size={18} />}
          loading={loading}
          onPress={submit}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} className="my-5 items-center">
          <Text className="font-semibold text-muted">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
