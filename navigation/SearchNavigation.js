import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "./screens/Profile/SettingsScreen";
import SearchScreen from "./screens/Search/SearchScreen";
import VacancyScreen from "./screens/Vacancies/VacancyScreen";
import ResumeScreen from "./screens/Resumes/ResumeScreen";
import CompanyScreen from "./screens/Vacancies/CompanyScreen";
import VacancyFilterScreen from "./screens/Search/VacancyFiltersScreen";

const Stack = createStackNavigator();

export default function ProfileNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Поиск', headerShown: true, headerBackTitleVisible: false }} />
            <Stack.Screen name="VacancyFilters" component={VacancyFilterScreen} options={{ title: 'Поиск', headerShown: true, headerBackTitleVisible: false }} />
            <Stack.Screen name="Vacancy" component={VacancyScreen} options={{ title: 'Вакансия', headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name="Resume" component={ResumeScreen} options={{ title: 'Резюме', headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name="Company" component={CompanyScreen} options={{ title: 'Компания', headerShown: true, headerBackTitleVisible: false, }} />
        </Stack.Navigator>
    )
}