import { useFocusEffect } from "@react-navigation/native";
import { Edit3, Save, Trash2, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Switch, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { noticeApi } from "../../api/noticeApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { colors } from "../../constants/colors";
import { Notice } from "../../types";

export default function ManageNoticesScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [form, setForm] = useState({ title: "", description: "", isImportant: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const load = async () => {
    const response: any = await noticeApi.list();
    setNotices(response.data.notices);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const save = async () => {
    try {
      if (editingId) {
        await noticeApi.update(editingId, form);
      } else {
        await noticeApi.create(form);
      }
      setForm({ title: "", description: "", isImportant: false });
      setEditingId(null);
      await load();
    } catch (error: any) {
      Alert.alert("Could not save notice", error.message || "Please try again.");
    }
  };

  const edit = (notice: Notice) => {
    setEditingId(notice.id);
    setForm({ title: notice.title, description: notice.description, isImportant: notice.isImportant });
  };

  const remove = async (id: string) => {
    await noticeApi.remove(id);
    await load();
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={notices}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Card className="mb-4">
            <Input label="Notice title" value={form.title} onChangeText={(title) => setForm((c) => ({ ...c, title }))} />
            <Input label="Description" value={form.description} onChangeText={(description) => setForm((c) => ({ ...c, description }))} multiline className="min-h-24 pt-3" />
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-semibold text-ink">Important notice</Text>
              <Switch value={form.isImportant} onValueChange={(isImportant) => setForm((c) => ({ ...c, isImportant }))} trackColor={{ true: colors.primary }} />
            </View>
            <Button title={editingId ? "Update notice" : "Create notice"} icon={<Save color="#FFFFFF" size={18} />} onPress={save} />
            {editingId ? (
              <View className="mt-3">
                <Button title="Cancel edit" icon={<X color="#17231D" size={18} />} variant="secondary" onPress={() => {
                  setEditingId(null);
                  setForm({ title: "", description: "", isImportant: false });
                }} />
              </View>
            ) : null}
          </Card>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-xs font-semibold uppercase text-primary">{item.isImportant ? "Important" : "Notice"}</Text>
            <Text className="mt-2 text-lg font-bold text-ink">{item.title}</Text>
            <Text className="mb-4 mt-1 text-muted">{item.description}</Text>
            <View className="flex-row gap-3">
              <Button title="Edit" icon={<Edit3 color="#17231D" size={18} />} className="flex-1" variant="secondary" onPress={() => edit(item)} />
              <Button title="Delete" icon={<Trash2 color="#FFFFFF" size={18} />} className="flex-1" variant="danger" onPress={() => remove(item.id)} />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
