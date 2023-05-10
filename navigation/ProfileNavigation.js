import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import ChangeDataScreen from "./screens/Profile/ChangeDataScreen";
import ChangePasswordScreen from "./screens/Profile/ChangePasswordScreen";
import SettingsScreen from "./screens/Profile/SettingsScreen";
import FavoritesScreen from "./screens/Profile/FavoritesScreen";
import ResponsesScreen from "./screens/Profile/ResponsesScreen";
import HowResponsesScreen from "./screens/Profile/HowResponsesScreen";

const Stack = createStackNavigator();

export default function ProfileNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Личный кабинет' }} />
            <Stack.Screen name="ChangeData" component={ChangeDataScreen} options={{ title: 'Персональные данные', headerBackTitleVisible: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Редактирование пароля', headerBackTitleVisible: false }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Избранное', headerBackTitleVisible: false }} />
            <Stack.Screen name="Responses" component={ResponsesScreen} options={{ title: 'Мои отклики', headerBackTitleVisible: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки', headerBackTitleVisible: false }} />
            <Stack.Screen name="HowResponses" component={HowResponsesScreen} options={{ title: 'FAQ', headerBackTitleVisible: false }} />
        </Stack.Navigator>
    )
}