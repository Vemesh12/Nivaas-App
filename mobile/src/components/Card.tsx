import { ReactNode } from "react";
import { View } from "react-native";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-2xl border border-line bg-white p-4 ${className}`}>{children}</View>;
}
