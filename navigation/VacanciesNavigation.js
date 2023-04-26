import { createStackNavigator } from "@react-navigation/stack";
import CompaniesScreen from "./screens/Personal/CompaniesScreen";
import CreateCompanyScreen from "./screens/Personal/CreateCompanyScreen";


const Stack = createStackNavigator();

export default function VacanciesNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Companies" component={CompaniesScreen} options={{ title: 'Мои компании', headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} options={{ title: 'Мои компании', headerShown: true, headerBackTitleVisible: false, }} />
        </Stack.Navigator>
    )
}