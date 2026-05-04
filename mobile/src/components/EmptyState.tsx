import { Text, View } from "react-native";

export default function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-line bg-white p-8">
      <Text className="text-lg font-bold text-ink">{title}</Text>
      {message ? <Text className="mt-2 text-center text-muted">{message}</Text> : null}
    </View>
  );
}
