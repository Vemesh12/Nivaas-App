import { useFocusEffect } from "@react-navigation/native";
import { Edit3, Save, Trash2, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, Switch, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { noticeApi } from "../../api/noticeApi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Input from "../../components/Input";
import { colors } from "../../constants/colors";
import { Notice } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";
import { FieldErrors, isBlank } from "../../utils/formValidation";

type NoticeField = "title" | "description";

export default function ManageNoticesScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [form, setForm] = useState({ title: "", description: "", isImportant: false });
  const [errors, setErrors] = useState<FieldErrors<NoticeField>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const save = async () => {
    const nextErrors: FieldErrors<NoticeField> = {};
    if (isBlank(form.title)) nextErrors.title = "Enter a notice title.";
    else if (form.title.trim().length < 3) nextErrors.title = "Title must be at least 3 characters.";
    if (isBlank(form.description)) nextErrors.description = "Enter a notice description.";
    else if (form.description.trim().length < 3) nextErrors.description = "Description must be at least 3 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        isImportant: form.isImportant
      };
      if (editingId) {
        await noticeApi.update(editingId, payload);
      } else {
        await noticeApi.create(payload);
      }
      setForm({ title: "", description: "", isImportant: false });
      setErrors({});
      setEditingId(null);
      await load();
    } catch (error: any) {
      Alert.alert("Could not save notice", getApiErrorMessage(error, "Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const edit = (notice: Notice) => {
    setEditingId(notice.id);
    setErrors({});
    setForm({ title: notice.title, description: notice.description, isImportant: notice.isImportant });
  };

  const runRemove = async (id: string) => {
    setDeletingId(id);
    try {
      await noticeApi.remove(id);
      await load();
    } catch (error) {
      Alert.alert("Could not delete notice", getApiErrorMessage(error, "Please try again."));
    } finally {
      setDeletingId(null);
    }
  };

  const remove = (notice: Notice) => {
    Alert.alert("Delete notice?", `Delete "${notice.title}" from the notice board?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => runRemove(notice.id) }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={["left", "right"]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        data={notices}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListHeaderComponent={
          <Card className="mb-4">
            <Input label="Notice title" value={form.title} onChangeText={(title) => {
              setForm((c) => ({ ...c, title }));
              if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
            }} error={errors.title} />
            <Input label="Description" value={form.description} onChangeText={(description) => {
              setForm((c) => ({ ...c, description }));
              if (errors.description) setErrors((current) => ({ ...current, description: undefined }));
            }} multiline className="min-h-24 pt-3" error={errors.description} />
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-semibold text-ink">Important notice</Text>
              <Switch value={form.isImportant} onValueChange={(isImportant) => setForm((c) => ({ ...c, isImportant }))} trackColor={{ true: colors.primary }} />
            </View>
            <Button title={editingId ? "Update notice" : "Create notice"} icon={<Save color="#FFFFFF" size={18} />} loading={saving} onPress={save} />
            {editingId ? (
              <View className="mt-3">
                <Button title="Cancel edit" icon={<X color="#17231D" size={18} />} variant="secondary" onPress={() => {
                  setEditingId(null);
                  setErrors({});
                  setForm({ title: "", description: "", isImportant: false });
                }} />
              </View>
            ) : null}
          </Card>
        }
        ListEmptyComponent={
          <EmptyState
            title={loadError ? "Could not load notices" : "No notices"}
            message={loadError || "Created notices will appear below this form."}
          />
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-xs font-semibold uppercase text-primary">{item.isImportant ? "Important" : "Notice"}</Text>
            <Text className="mt-2 text-lg font-bold text-ink">{item.title}</Text>
            <Text className="mb-4 mt-1 text-muted">{item.description}</Text>
            <View className="flex-row gap-3">
              <Button title="Edit" icon={<Edit3 color="#17231D" size={18} />} className="flex-1" variant="secondary" onPress={() => edit(item)} />
              <Button
                title="Delete"
                icon={<Trash2 color="#FFFFFF" size={18} />}
                className="flex-1"
                variant="danger"
                loading={deletingId === item.id}
                disabled={!!deletingId}
                onPress={() => remove(item)}
              />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
