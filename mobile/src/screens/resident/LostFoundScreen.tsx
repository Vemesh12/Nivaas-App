import CategoryPostsScreen from "./shared/CategoryPostsScreen";

export default function LostFoundScreen(props: any) {
  return <CategoryPostsScreen {...props} category="LOST_FOUND" title="Lost & Found" subtitle="Missing items, pets, keys, and found updates." />;
}
