import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import { postApi } from "../../api/postApi";
import Button from "../../components/Button";
import CategoryBadge from "../../components/CategoryBadge";
import Input from "../../components/Input";
import { PostCategory } from "../../types";

const categories: PostCategory[] = ["GENERAL", "ALERT", "HELP", "LOST_FOUND", "EVENT"];

export default function CreatePostScreen({ navigation, route }: any) {
  const initialCategory = route.params?.category as PostCategory | undefined;
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: initialCategory || "GENERAL" as PostCategory });
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      await postApi.create(form);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Could not create post", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
      <ScrollView className="px-5" contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}>
        <Input label="Title" value={form.title} onChangeText={(v) => set("title", v)} />
        <Input label="Description" value={form.description} onChangeText={(v) => set("description", v)} multiline className="min-h-28 pt-3" />
        <Text className="mb-2 text-sm font-semibold text-ink">Category</Text>
        <View className="mb-3 flex-row flex-wrap">
          {categories.map((item) => <CategoryBadge key={item} category={item} active={form.category === item} onPress={() => setForm((c) => ({ ...c, category: item }))} />)}
        </View>
        <Input label="Image URL optional" value={form.imageUrl} onChangeText={(v) => set("imageUrl", v)} autoCapitalize="none" />
        <Button title="Publish post" icon={<Send color="#FFFFFF" size={18} />} loading={loading} onPress={submit} />
        <TouchableOpacity onPress={() => navigation.goBack()} className="my-5 items-center">
          <Text className="font-semibold text-muted">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
