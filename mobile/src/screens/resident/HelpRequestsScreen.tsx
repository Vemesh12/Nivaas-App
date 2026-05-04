import CategoryPostsScreen from "./shared/CategoryPostsScreen";

export default function HelpRequestsScreen(props: any) {
  return <CategoryPostsScreen {...props} category="HELP" title="Help requests" subtitle="Ask neighbours for recommendations or local help." />;
}
