import { Text, View } from "react-native";

export default function Header({ title, subtitle, align = "left" }: { title: string; subtitle?: string; align?: "left" | "center" }) {
  const alignment = align === "center" ? "items-center" : "";
  const textAlignment = align === "center" ? "text-center" : "";

  return (
    <View className={`mb-4 ${alignment}`}>
      <Text className={`text-3xl font-bold text-ink ${textAlignment}`}>{title}</Text>
      {subtitle ? <Text className={`mt-1 text-base text-muted ${textAlignment}`}>{subtitle}</Text> : null}
    </View>
  );
}
