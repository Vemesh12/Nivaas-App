import { Text, TouchableOpacity } from "react-native";
import { PostCategory } from "../types";

const labels: Record<PostCategory, string> = {
  GENERAL: "General",
  ALERT: "Alert",
  HELP: "Help",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event"
};

export default function CategoryBadge({
  category,
  active,
  onPress
}: {
  category: PostCategory;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mr-2 rounded-full px-3 py-2 ${active ? "bg-primary" : "bg-white border border-line"}`}
    >
      <Text className={`text-sm font-semibold ${active ? "text-white" : "text-muted"}`}>{labels[category]}</Text>
    </TouchableOpacity>
  );
}
