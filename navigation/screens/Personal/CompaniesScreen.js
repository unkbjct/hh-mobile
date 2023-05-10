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

export default function CompaniesScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [companies, setCompanies] = React.useState(null);
    const [tabs, setTabs] = React.useState(null);

    const getData = () => {
        setIsLoading(true);
        try {
            AsyncStorage.getItem('user', async (errs, tempUser) => {
                tempUser = JSON.parse(tempUser)
                setUser(tempUser);

                // let formData = new FormData();
                // formData.append("apiToren", tempUser.api_token);
                fetch(`${SiteUrl}api/companies`, {
                    method: 'post',
                }).then(response => response.json()).then(async response => {
                    // console.log(response)
                    setCompanies(response.data.companies);
                    await AsyncStorage.getItem('tabs', (errs, tabs) => {
                        setTabs(JSON.parse(tabs))
                    })
                    setIsLoading(false)
                })
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
                    <View>
                        <Text style={[defStyles.header, { textAlign: 'center' }]}>Мои компании</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                        <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 10 }]} onPress={() => navigation.navigate("CreateCompany", { 'newCompany': true })}>
                            <Text style={{ color: 'white' }}>Добавить новую компанию</Text>
                        </TouchableOpacity>
                    </View>
                    {tabs == null ? <Text style={{ textAlign: 'center', marginBottom: 10 }}>Если вы не хотите видеть отдел "мои компании", перейдите в настройки в личном кабинете</Text> : <></>}
                    <View >
                        {companies.length ?
                            <View>
                                {companies.map((company, i) => {
                                    return (
                                        // <></>
                                        <CompanyCard key={`company-${i}`} company={company} navigation={navigation} token={user.api_token} callback={getData} />
                                    )
                                })}
                            </View>
                            :
                            <View style={{ flex: 1, alignItems: 'center', marginTop: '30%' }}>
                                <Text style={{ fontSize: 25, textAlign: 'center', color: 'gray' }}>У вас еще нет созданных компаний</Text>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}