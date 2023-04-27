import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import { Loading } from '../components/Loading';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistratinScreen';
import SearchNavigation from './SearchNavigation';

import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileNavigation from './ProfileNavigation';
import ResumesNavigation from './ResumesNavigation';
import VacanciesNavigation from './VacanciesNavigation';


const ScreenNames = {
    Search: 'Поиск',
    Profile: 'Профиль',
    Resumes: 'Мои резюме',
    Vacancies: 'Мои вакансии',
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


export default function MainNavigation() {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isLogin, setIsLogin] = React.useState(true);

    const checkLogin = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            (user) ? setIsLogin(true) : setIsLogin(false);
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(checkLogin, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName={isLogin ? 'main' : 'auth'}>
                <Tab.Screen name='auth' component={Auth} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
                <Tab.Screen name='main' component={Main} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
    function Auth() {
        return (
            <Stack.Navigator>
                <Stack.Screen name='login' component={LoginScreen} options={{ title: 'Авторизация', headerShown: false, unmountOnBlur: true }} />
                <Stack.Screen name='registration' component={RegistrationScreen} options={{ title: 'Регистрация', headerShown: false }} />
            </Stack.Navigator>
        )
    }
    function Main() {
        return (
            <Tab.Navigator
                // header={'asd'}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        let rn = route.name;
                        // console.debug();
                        if (rn === ScreenNames.Search) {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if (rn === ScreenNames.Resumes) {
                            iconName = focused ? 'reader' : 'reader-outline';
                        } else if (rn === ScreenNames.Vacancies) {
                            iconName = focused ? 'business' : 'business-outline';
                        } else if (rn === ScreenNames.Profile) {
                            iconName = focused ? 'person' : 'person-outline';
                        }
                        color = focused ? '#dc3545' : null;
                        // size = 20;
                        return <Ionicons name={iconName} size={25} color={color} />
                    },
                    tabBarLabelStyle: {
                        color: null
                    }
                })}
            >

                <Tab.Screen name={ScreenNames.Search} component={SearchNavigation} options={{ title: 'Каталог', headerShown: false, }} />
                <Tab.Screen name={ScreenNames.Resumes} component={ResumesNavigation} options={{ headerShown: false, unmountOnBlur: false }} />
                {isLogin ?
                    <Tab.Screen name={ScreenNames.Vacancies} component={VacanciesNavigation} options={{ headerShown: false }} />
                    :
                    <></>
                }
                <Tab.Screen name={ScreenNames.Profile} component={ProfileNavigation} options={{ headerShown: false }} />

            </Tab.Navigator>
        );
    }
}


