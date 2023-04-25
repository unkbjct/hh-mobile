import * as React from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SiteUrl } from '../../../env';
import { Loading } from '../../../components/Loading';
import { defStyles } from '../../../components/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function VacancyScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [company, setCompany] = React.useState(null);
    const [vacancy, setVacancy] = React.useState(null);
    const [date, setDate] = React.useState(null);
    const { companyId, vacancyId } = route.params;

    const getData = () => {
        setIsLoading(true);
        // console.log(route.params)
        try {
            fetch(`${SiteUrl}api/bug/company/${companyId}/vacancy/${vacancyId}`, {
                method: 'post'
            }).then(async function (response) {
                response = await response.json();
                setCompany(response.data.company)
                setVacancy(response.data.vacancy)
                setDate(new Date(response.data.vacancy.created_at))

                navigation.setOptions({
                    title: `Вакансия - ${response.data.vacancy.position}`
                })
            }).then(() => setIsLoading(false))
        } catch (e) {
            Alert.alert("Ошибка", "Проверьте подключение к интернету")
        }
    }

    React.useEffect(getData, [])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View style={{ padding: 20 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={defStyles.header}>{vacancy.position}</Text>
                        <Text style={[defStyles.semiHeadeer,]}>от {currencyFormat(vacancy.salary)} на руки</Text>
                        <Text style={{ marginBottom: 10, }}>Требуемый опыт работы: {vacancy.experience}</Text>
                        <Text style={{ marginBottom: 10, }}>Уровень образования: {vacancy.education}</Text>
                        <Text style={{ marginBottom: 10, }}>{vacancy.employment}, {vacancy.schedule}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]}>
                                <Text style={{ color: 'white' }}>Откликнуться</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary,]}
                                onPress={() => Alert.alert(`${vacancy.surname} ${vacancy.name}`, `${vacancy.phone}${(vacancy.email) ? '\n${vacancy.email}' : ''}`)}>
                                <Text style={{ color: 'white' }}>Показать контакты</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ marginRight: 10 }}>
                            <Ionicons name={'heart-outline'} size={35} color={'#dc3545'}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <View><Text style={defStyles.textMuted}>Вакансия опубликована {date.toLocaleDateString("ru-RU")}</Text></View>
                    <View style={defStyles.hr}></View>
                    <View style={{ marginTop: 30 }}>
                        {vacancy.requirements ?
                            <View style={styles.section}>
                                <Text style={styles.header}>Требования</Text>
                                <View style={styles.list}>
                                    {vacancy.requirements.map((requirement, i) => {
                                        return (
                                            <Text
                                                key={`requirement-${requirement.id}`}
                                                style={[styles.listItem, (i === vacancy.requirements.length) ? styles.borderBottom : styles.withoutBorder]}>
                                                {requirement.requirement}
                                            </Text>
                                        )
                                    })}
                                </View>
                            </View>
                            : <></>
                        }
                        {vacancy.responsibilities ?
                            <View style={styles.section}>
                                <Text style={styles.header}>Обязанности</Text>
                                <View style={styles.list}>
                                    {vacancy.responsibilities.map((responsibility, i) => {
                                        return (
                                            <Text
                                                key={`responsibility-${responsibility.id}`}
                                                style={[styles.listItem, (i === vacancy.responsibilities.length) ? styles.borderBottom : styles.withoutBorder]}>
                                                {responsibility.responsibility}
                                            </Text>
                                        )
                                    })}
                                </View>
                            </View>
                            : <></>
                        }
                        {vacancy.offers ?
                            <View style={styles.section}>
                                <Text style={styles.header}>Что мы предлагаем</Text>
                                <View style={styles.list}>
                                    {vacancy.offers.map((offer, i) => {
                                        return (
                                            <Text
                                                key={`offer-${offer.id}`}
                                                style={[styles.listItem, (i === vacancy.offers.length) ? styles.borderBottom : styles.withoutBorder]}>
                                                {offer.offer}
                                            </Text>
                                        )
                                    })}
                                </View>
                            </View>
                            : <></>
                        }
                        {vacancy.skills ?
                            <View style={styles.section}>
                                <Text style={[styles.header, { marginBottom: 10 }]}>Ключевые навыки</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {vacancy.skills.map((skill, i) => {
                                        return (
                                            <View key={`skill-${skill.id}`} style={{ alignItems: 'baseline' }}>
                                                <View style={styles.skill}>
                                                    <Text key={`skill-${skill.id}`} style={{}}>{skill.skill}</Text>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            : <></>
                        }
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[styles.header, { marginBottom: 10 }]}>Адрес</Text>
                        <Text>город {vacancy.city} {vacancy.address}</Text>
                    </View>
                    <View style={defStyles.hr}></View>
                    <View>
                        <Text style={[styles.header, { marginBottom: 20, textAlign: 'center' }]}>Информация о компании</Text>
                        <View>
                            <Image style={styles.companyLogo} source={{ uri: `${SiteUrl}/${company.image}` }} />
                        </View>
                        <TouchableOpacity>
                            <Text style={[styles.header, { textAlign: 'center', color: '#0d6efd' }]}>{company.legal_title}</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + " ₽."
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
        width: '80%',
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        marginBottom: 20,
    }
})