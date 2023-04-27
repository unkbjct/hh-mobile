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
import { colors, defStyles } from '../../../components/styles';
import { SiteUrl } from '../../../env';
import VacancyCard from '../../../components/VacancyCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompanyCard from '../../../components/personal/CompanyCard';
import { StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import ResumeCard from '../../../components/ResumeCard';

export default function VacancyResponsesScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [responses, setResponses] = React.useState([]);
    const [collapsed, setCollapsed] = React.useState(null);
    const { company, vacancy } = route.params;

    const getData = () => {
        setIsLoading(true);
        fetch(`${SiteUrl}api/company/${company.id}/vacancy/${vacancy.id}/responses`, {
            method: "post",
        }).then(response => response.json()).then(response => {
            // console.log(response)

            setResponses(response.data.responses)
            setIsLoading(false);
        })
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
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[defStyles.header, { textAlign: 'center' }]}>{vacancy.position} - Отклики</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>Всего откликов: {responses.length}</Text>
                    </View>
                    <View>
                        {responses.length ?
                            <View>
                                {responses.map((response, i) => {
                                    let date = new Date(response.created_at).toLocaleString("ru-RU", { hour12: false });
                                    // let [isCollapsed, setIsCollapsed] = React.useState(true);
                                    return (
                                        <View key={`response-${i}`} style={[styles.Card]}>
                                            <View style={styles.CardBody}>
                                                <Text style={[defStyles.semiHeadeer, { fontSize: 22, fontWeight: 600, marginBottom: 20 }]}>Откликнулся {response.surname} {response.name}</Text>
                                                <View style={{ marginBottom: 20 }}>
                                                    <Text style={styles.text}>Почта пользователя:</Text>
                                                    <Text style={[{ color: colors.danger, fontSize: 18 }]}>{response.email}</Text>
                                                </View>
                                                <View style={{ marginBottom: 20, }}>
                                                    <Text style={styles.text}>Телефон пользователя:</Text>
                                                    <Text style={[{ color: colors.danger, fontSize: 18 }]}>{response.phone}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 10 }]} onPress={() => {
                                                        setCollapsed(collapsed == i ? null : i)
                                                        console.log(collapsed)
                                                    }}>
                                                        <Text style={{ color: 'white' }}>{(!(collapsed == i)) ? "Показать резюме пользователя" : "Скрыть резюме пользователя"}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <Collapsible collapsed={!(collapsed == i)}>
                                                    {response.resumes.length ?
                                                        <View>
                                                            {response.resumes.map((resume, i) => {
                                                                return (
                                                                    // <Text>asd</Text>
                                                                    <ResumeCard key={`resume-${resume.id}`} resume={resume} navigation={navigation} />
                                                                )
                                                            })}
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text style={{ fontSize: 20, color: 'gray', textAlign: 'center' }}>У пользователя нет резюме</Text>
                                                        </View>
                                                    }
                                                </Collapsible>
                                            </View>
                                            <View style={styles.CardFooter}>
                                                <Text style={{ textAlign: 'right' }}>Дата отклика: {date}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            :
                            <View style={{ marginTop: '40%' }}>
                                <Text style={{ fontSize: 24, color: 'gray', textAlign: 'center' }}>На вакансию еще никто не откикнулся</Text>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    Card: {
        backgroundColor: 'white',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: .2,
        width: '100%',
        borderRadius: 7,
        marginBottom: 30,
    },
    CardBody: {
        padding: 10,
    },
    CardHeader: {
        backgroundColor: 'rgb(240, 240, 240)',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        padding: 10,
    },
    CardFooter: {
        backgroundColor: 'rgb(240, 240, 240)',
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: 'rgb(40, 40, 40)',
        marginBottom: 8,
    },
})