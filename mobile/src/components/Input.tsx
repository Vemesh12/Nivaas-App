import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
};

export default function Input({ label, error, className = "", showPasswordToggle, secureTextEntry, ...props }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldHideText = showPasswordToggle ? !isPasswordVisible : secureTextEntry;

  return (
    <View className="mb-3">
      {label ? <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text> : null}
      <View className={`flex-row items-center rounded-xl border bg-white ${error ? "border-danger" : "border-line"}`}>
        <TextInput
          placeholderTextColor="#8A9690"
          secureTextEntry={shouldHideText}
          className={`min-h-12 flex-1 px-4 text-base text-ink ${showPasswordToggle ? "pr-2" : ""} ${className}`}
          {...props}
        />
        {showPasswordToggle ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
            activeOpacity={0.75}
            className="h-12 w-12 items-center justify-center"
            onPress={() => setIsPasswordVisible((value) => !value)}
          >
            {isPasswordVisible ? <EyeOff color="#66736D" size={20} /> : <Eye color="#66736D" size={20} />}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="mt-1 text-xs font-medium text-danger">{error}</Text> : null}
    </View>
  );
}
