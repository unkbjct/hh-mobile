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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResumeCard from '../../../components/personal/ResumeCard';
import CompanyCard from '../../../components/personal/CompanyCard';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import PersonalVacancyCard from '../../../components/personal/PersonalVacancyCard';

export default function CompanyScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    // const [company, setCompany] = React.useState(null);
    const [vacancies, setVacancies] = React.useState([]);
    const [isOwner, setIsOwner] = React.useState(false);
    const [favorites, setFavorites] = React.useState([]);



    const { company } = route.params;

    const getData = () => {
        setIsLoading(true);
        try {
            navigation.setOptions({
                title: `${company.legal_title}`
            })
            AsyncStorage.getItem('user', async (errs, tempUser) => {
                tempUser = JSON.parse(tempUser)
                setUser(tempUser);

                fetch(`${SiteUrl}api/company/${company.id}`, {
                    method: 'post',
                }).then(response => response.json()).then(async response => {
                    setIsOwner(response.data.company.users.includes(tempUser.id))
                    setVacancies(response.data.vacancies);
                    await AsyncStorage.getItem('favorites', (errs, favorites) => {
                        setFavorites(JSON.parse(favorites));
                    })

                }).then(() => { setIsLoading(false) })
            })
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(getData, [route]);


    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View style={{ padding: 10 }}>
                    <View style={{ marginBottom: 25 }}>
                        <View>
                            <Text style={[defStyles.header, { textAlign: 'center' }]}>{company.legal_title}</Text>
                        </View>
                        <View>
                            {company.image ? <Image style={styles.companyLogo} source={{ uri: `${SiteUrl}/${company.image}` }} /> : <></>}
                        </View>
                        <View>
                            <Text style={{ fontSize: 20, textAlign: 'center' }}>{company.description}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.header, { textAlign: 'center', marginBottom: 20 }]}>Вакансии компании</Text>
                        {isOwner ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 20 }]} onPress={() => {
                                    navigation.navigate("CreateVacancy", { newVacancy: true, company: company })
                                }}>
                                    <Text style={{ color: 'white' }}>Доабвить вакансию</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <></>
                        }

                        {vacancies.length ?
                            <View>
                                {vacancies.map((vacancy) => {
                                    if (isOwner) {
                                        return (
                                            <PersonalVacancyCard key={`vacancy-${vacancy.id}`} vacancy={vacancy} company={company} navigation={navigation} callback={getData} />
                                        )
                                    } else {
                                        return (
                                            <VacancyCard key={`vacancy-${vacancy.id}`} vacancy={vacancy} navigation={navigation} callback={() => { getData }} favorites={favorites} />
                                        )
                                    }
                                })}
                            </View>
                            :
                            <View>
                                <Text style={{ fontSize: 20, color: 'gray', textAlign: 'center' }}>На данный момент у компании нет открытых вакансий</Text>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    header: {
        fontWeight: 700,
        fontSize: 24,
        color: 'rgb(90, 90, 90)',
    },
    section: {
        marginBottom: 15,
    },
    list: {
        padding: 10,
    },
    listItem: {
        fontSize: 18,
        paddingLeft: 20,
    },
    borderBottom: {
        borderWidth: 1,
        borderColor: 'rgb(200, 200, 200)',
    },
    skill: {
        // height: 200,
        backgroundColor: 'white',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: .2,
        width: '100%',
        marginBottom: 20,
        padding: 10,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgb(240, 240, 240)',
    },
    companyLogo: {
        width: '100%',
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        marginBottom: 20,
    }
})