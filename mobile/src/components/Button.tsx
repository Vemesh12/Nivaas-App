import { ReactNode } from "react";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  icon?: ReactNode;
};

export default function Button({ title, variant = "primary", loading, icon, className = "", disabled, ...props }: Props) {
  const styles = {
    primary: "bg-primary",
    secondary: "bg-white border border-line",
    danger: "bg-danger"
  };
  const text = variant === "secondary" ? "text-ink" : "text-white";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      className={`h-12 items-center justify-center rounded-xl px-4 ${styles[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0F8A4B" : "#FFFFFF"} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`font-semibold ${text}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
