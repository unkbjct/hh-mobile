import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import ChangeDataScreen from "./screens/Profile/ChangeDataScreen";
import ChangePasswordScreen from "./screens/Profile/ChangePasswordScreen";
import SettingsScreen from "./screens/Profile/SettingsScreen";

const Stack = createStackNavigator();

export default function ProfileNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Личный кабинет' }} />
            <Stack.Screen name="ChangeData" component={ChangeDataScreen} options={{ title: 'Персональные данные', headerBackTitleVisible: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Редактирование пароля', headerBackTitleVisible: false }} />
            {/* <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки', headerBackTitleVisible: false }} /> */}
        </Stack.Navigator>
    )
}