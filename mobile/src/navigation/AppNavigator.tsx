import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Bell, HandHeart, Home, Search, ShieldCheck, User, Users } from "lucide-react-native";
import { colors } from "../constants/colors";
import { useAuthStore } from "../store/authStore";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ManageMembersScreen from "../screens/admin/ManageMembersScreen";
import ManageNoticesScreen from "../screens/admin/ManageNoticesScreen";
import PendingResidentsScreen from "../screens/admin/PendingResidentsScreen";
import JoinCommunityScreen from "../screens/onboarding/JoinCommunityScreen";
import PendingApprovalScreen from "../screens/onboarding/PendingApprovalScreen";
import CreatePostScreen from "../screens/resident/CreatePostScreen";
import DirectoryScreen from "../screens/resident/DirectoryScreen";
import HelpRequestsScreen from "../screens/resident/HelpRequestsScreen";
import HomeFeedScreen from "../screens/resident/HomeFeedScreen";
import LostFoundScreen from "../screens/resident/LostFoundScreen";
import NoticeBoardScreen from "../screens/resident/NoticeBoardScreen";
import PostDetailsScreen from "../screens/resident/PostDetailsScreen";
import ProfileScreen from "../screens/resident/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Feed: Home,
  Notices: Bell,
  LostFound: Search,
  Help: HandHeart,
  Directory: Users,
  Profile: User,
  Admin: ShieldCheck
};

function ResidentTabs() {
  const { user } = useAuthStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
        tabBarItemStyle: { paddingTop: 8 },
        tabBarStyle: {
          height: 68,
          paddingBottom: 8,
          paddingTop: 4,
          borderTopColor: colors.line,
          backgroundColor: colors.surface
        },
        tabBarIcon: ({ color, size, focused }) => {
          const Icon = tabIcons[route.name as keyof typeof tabIcons] || Home;
          return <Icon color={color} size={focused ? size + 1 : size} strokeWidth={focused ? 2.5 : 2} />;
        }
      })}
    >
      <Tab.Screen name="Feed" component={HomeFeedScreen} />
      <Tab.Screen name="Notices" component={NoticeBoardScreen} />
      <Tab.Screen name="LostFound" component={LostFoundScreen} options={{ title: "Lost" }} />
      <Tab.Screen name="Help" component={HelpRequestsScreen} />
      <Tab.Screen name="Directory" component={DirectoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === "ADMIN" ? <Tab.Screen name="Admin" component={AdminDashboardScreen} /> : null}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuthStore();

  if (!user?.communityId) return <JoinCommunityScreen />;
  if (user.status === "PENDING") return <PendingApprovalScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.ink, fontSize: 18, fontWeight: "700" },
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="ResidentTabs" component={ResidentTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: "Create Post" }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: "Post" }} />
      <Stack.Screen name="PendingResidents" component={PendingResidentsScreen} options={{ title: "Pending Residents" }} />
      <Stack.Screen name="ManageNotices" component={ManageNoticesScreen} options={{ title: "Manage Notices" }} />
      <Stack.Screen name="ManageMembers" component={ManageMembersScreen} options={{ title: "Manage Members" }} />
    </Stack.Navigator>
  );
}
