import { createStackNavigator } from "@react-navigation/stack";
import ResumesScreen from "./screens/Personal/ResumesScreen";
import ApplicantScreen from "./screens/Resumes/ApplicantScreen";
import ExperienceScreen from "./screens/Resumes/ExperienceScreen";
import EducationScreen from "./screens/Resumes/EducationScreen";


const Stack = createStackNavigator();

export default function ResumesNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Resumes" component={ResumesScreen} options={{ title: 'Мои резюме', headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name="Applicant" component={ApplicantScreen} options={{ title: 'Редактирование', headerShown: true, headerBackTitleVisible: false, unmountOnBlur: true }} />
            <Stack.Screen name="Experience" component={ExperienceScreen} options={{ title: 'Опыт работы', headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name="Education" component={EducationScreen} options={{ title: 'Место учебы', headerShown: true, headerBackTitleVisible: false, }} />
        </Stack.Navigator>
    )
}