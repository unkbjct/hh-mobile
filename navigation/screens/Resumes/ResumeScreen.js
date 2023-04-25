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


export default function ResumeScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [resume, setResume] = React.useState(null);
    // const [date, setDate] = React.useState(null);
    const [birthday, setBirthday] = React.useState(null);
    const [moving, setMoving] = React.useState(null);
    const [trips, setTrips] = React.useState(null);
    const [education, setEducation] = React.useState(null);

    const { resumeId } = route.params;

    const getData = () => {
        setIsLoading(true);
        // console.log(route.params)
        try {
            fetch(`${SiteUrl}api/resume/${resumeId}`, {
                method: 'post'
            }).then(async function (response) {
                response = await response.json();
                setResume(response.data.resume)
                setBirthday(new Date(`${response.data.resume.personal.birthday_year}-${response.data.resume.personal.birthday_month}-${response.data.resume.personal.birthday_day}`))
                switch (response.data.resume.personal.moving) {
                    case 'cant':
                        setMoving('к переезду не готов')
                        break;
                    case 'can':
                        setMoving('может переехать')
                        break;
                    default:
                        setMoving('желает переехать')
                        break;
                }
                switch (response.data.resume.personal.moving) {
                    case 'never':
                        setTrips('не готов к командировкам')
                        break;
                    case 'ready':
                        setTrips('готов к командировкам')
                        break;
                    default:
                        setTrips('иногда может ездить в командировки')
                        break;
                }
                switch (response.data.resume.education_level) {
                    case 'secondary':
                        setEducation('Среднее')
                        break;
                    case 'special_secondary':
                        setEducation('Среднее')
                        break;
                    case 'unfinished_higher':
                        setEducation('Неоконченное высшее')
                        break;
                    case 'higher':
                        setEducation('Высшее')
                        break;
                    case 'bachelor':
                        setEducation('Бакалавр')
                        break;
                    case 'master':
                        setEducation('Магистр')
                        break;
                    case 'candidate':
                        setEducation('Кандидат наук')
                        break;
                    case 'doctor':
                        setEducation('Доктор наук')
                        break;
                }
                navigation.setOptions({
                    title: `Резюме - ${response.data.resume.job.title}`
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
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Text style={[styles.header, { marginRight: 10, }]}>{resume.personal.surname}</Text>
                            <Text style={[styles.header, { marginRight: 10, }]}>{resume.personal.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                            <Text style={{ fontSize: 18 }}>{(resume.personal.gender == 'MALE') ? "Мужчина" : "Девушка"}, Дата рождения: {birthday.toLocaleDateString("ru-RU")}</Text>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.semiHeader}>Контакты</Text>
                            {resume.contacts.phone ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.text}>{resume.contacts.phone}</Text>
                                    {resume.contacts.recomeded == 'phone' ?
                                        <Text style={styles.text}> - предпочитаемый тип связи</Text>
                                        : <></>
                                    }
                                </View>
                                : <></>
                            }
                            {resume.contacts.email ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.text}>{resume.contacts.email}</Text>
                                    {resume.contacts.recomeded == 'email' ?
                                        <Text style={styles.text}> - предпочитаемый тип связи</Text>
                                        : <></>
                                    }
                                </View>
                                : <></>
                            }
                            {resume.contacts.telegram ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{resume.contacts.telegram}</Text>
                                    {resume.contacts.recomeded == 'telegram' ?
                                        <Text> - предпочитаемый тип связи</Text>
                                        : <></>
                                    }
                                </View>
                                : <></>
                            }
                        </View>
                        <View>
                            <Text style={styles.text}>город {resume.city}, {moving}, {trips}.</Text>
                        </View>
                    </View>
                    <View style={defStyles.hr}></View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[defStyles.header, { marginBottom: 20 }]}>{resume.job.title}</Text>
                        <Text style={styles.header}>{currencyFormat(resume.job.salary)} на руки</Text>
                    </View>
                    <View style={styles.section}>
                        {resume.employments.length ?
                            <View>
                                <Text style={[styles.text, { fontWeight: 700 }]}>Занятость</Text>
                                <View style={styles.list}>
                                    {resume.employments.map((employment) => {
                                        return (
                                            <Text key={`employment-${employment.id}`} style={styles.listItem}>{employment.employment}</Text>
                                        )
                                    })}
                                </View>
                            </View>
                            :
                            <View>
                                <Text style={styles.text}><Text style={[styles.text, { fontWeight: 700 }]}>Занятость</Text>: не указано</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.section}>
                        {resume.schedules.length ?
                            <View>
                                <Text style={[styles.text, { fontWeight: 700 }]}>График работы</Text>
                                <View style={styles.list}>
                                    {resume.schedules.map((schedule) => {
                                        return (
                                            <Text key={`schedule-${schedule.id}`} style={styles.listItem}>{schedule.schedule}</Text>
                                        )
                                    })}
                                </View>
                            </View>
                            :
                            <View>
                                <Text style={styles.text}><Text style={[styles.text, { fontWeight: 700 }]}>График работы</Text>: не указано</Text>
                            </View>
                        }
                    </View>
                    {resume.experiences.length ?
                        <View style={styles.section}>
                            <Text style={[styles.header, { marginRight: 10, marginBottom: 15, }]}>Опыт работы</Text>
                            {resume.experiences.map((item) => {
                                return (
                                    <View key={`experience-${item.id}`} style={styles.card}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <Text style={[styles.text, { fontWeight: 700 }]}>{item.position}</Text>
                                            <Text>6 лет</Text>
                                        </View>
                                        <Text style={[{ color: '#dc3545', fontSize: 20, fontWeight: 500, marginBottom: 10 }]}>{item.company}</Text>
                                        <View style={defStyles.hr}></View>
                                        <Text style={styles.text}>{item.responsibilities}</Text>
                                    </View>
                                )
                            })}
                        </View>
                        :
                        <></>
                    }
                    {(resume.about) ?
                        <View style={styles.section}>
                            <Text style={[styles.header, { marginRight: 10, marginBottom: 15, }]}>Обо мне</Text>
                            <Text style={styles.text}>{resume.about}</Text>
                        </View>
                        :
                        <></>
                    }
                    {(resume.skills.length) ?
                        <View style={styles.section}>
                            <Text style={[styles.header, { marginRight: 10, marginBottom: 15, }]}>Ключевые навыки</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {resume.skills.map((skill, i) => {
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
                        :
                        <></>
                    }
                    <View style={styles.section}>
                        <Text style={[styles.header, { marginRight: 10, marginBottom: 15, }]}>Образование - {education}</Text>
                        {resume.educations.map((item, i) => {
                            return (
                                <View style={styles.card}>
                                    <Text style={[{ color: '#dc3545', fontSize: 20, fontWeight: 500, marginBottom: 10 }]}>{item.college}</Text>
                                    <Text style={styles.text}>{item.faculty}</Text>
                                    <Text style={[styles.text, { fontWeight: 700 }]}>{item.specialitty}</Text>
                                    <Text style={styles.text}>Год окончания: {item.year_end}</Text>
                                </View>
                            )
                        })}
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
    semiHeader: {
        fontSize: 18,
        color: 'rgb(120, 120, 120)',
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        color: 'rgb(40, 40, 40)',
        marginBottom: 8,
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
        marginBottom: 10,
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
    },
    card: {
        backgroundColor: 'white',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: .2,
        width: '100%',
        marginBottom: 20,
        padding: 20,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgb(240, 240, 240)',
    }
})