import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label?: string;
};

export default function Input({ label, className = "", ...props }: Props) {
  return (
    <View className="mb-3">
      {label ? <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#8A9690"
        className={`min-h-12 rounded-xl border border-line bg-white px-4 text-base text-ink ${className}`}
        {...props}
      />
    </View>
  );
}
