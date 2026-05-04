import { Text, View } from "react-native";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-4">
      <Text className="text-3xl font-bold text-ink">{title}</Text>
      {subtitle ? <Text className="mt-1 text-base text-muted">{subtitle}</Text> : null}
    </View>
  );
}
