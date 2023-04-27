import * as React from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Loading } from "../../../components/Loading";
import { defStyles } from '../../../components/styles';
import { SiteUrl } from '../../../env';
import VacancyCard from '../../../components/VacancyCard';
import ResumeCard from '../../../components/ResumeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = React.useState('vacancy');
    const [vacancies, setVacancies] = React.useState(null);
    const [resumes, setResumes] = React.useState(null);
    const [favorites, setFavorites] = React.useState([]);

    const changeSearch = (content) => {
        setSearch(content)
        getData();
    }

    const getData = (content = 'vacancy') => {
        setIsLoading(true);
        setSearch(content);
        try {
            if (content == 'vacancy') {
                fetch(SiteUrl + 'api/search/vacancies', {
                    method: 'post'
                }).then(async function (response) {
                    response = await response.json();
                    setVacancies(response.data.vacancies)
                    await AsyncStorage.getItem('favorites', (errs, favorites) => {
                        setFavorites(JSON.parse(favorites));
                    })
                }).finally(() => setIsLoading(false))
            } else {
                fetch(SiteUrl + 'api/search/resumes', {
                    method: 'post'
                }).then(async function (response) {
                    response = await response.json();
                    setResumes(response.data.resumes)
                }).finally(() => setIsLoading(false))
            }

        } catch (e) {
            Alert.alert("Ошибка", "Проверьте подключение к интернету")
        }
    }

    React.useEffect(getData, []);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {search == 'vacancy' ?
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}
                                onPress={() => { getData('resume') }}
                            >
                                <Text style={{ color: 'white' }}>Искать работника</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}
                                onPress={() => { getData('vacancy') }}
                            >
                                <Text style={{ color: 'white' }}>Искать работу</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]}>
                            <Text style={{ color: 'white' }}>Фильтры</Text>
                        </TouchableOpacity>
                    </View>
                    {(search === 'vacancy') ?
                        <View style={{}}>
                            {vacancies.map((vacancy) => {
                                // console.log(search);
                                return (
                                    <VacancyCard key={`vacancy-${vacancy.id}`} vacancy={vacancy} navigation={navigation} callback={() => { getData }} favorites={favorites} />
                                )
                            })}
                        </View>
                        :
                        <View style={{}}>
                            {resumes.map((resume) => {
                                return (
                                    <ResumeCard key={`resume-${resume.id}`} resume={resume} navigation={navigation} />
                                )
                            })}
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}