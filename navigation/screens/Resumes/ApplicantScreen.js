import * as React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, defStyles } from '../../../components/styles';
import LabelInput from '../../../components/inputs/Labelnput';
import { Loading } from '../../../components/Loading';
import { SiteUrl } from '../../../env';
import SwitchSelector from "react-native-switch-selector";
import Checkbox from 'expo-checkbox';
import Selector from '../../../components/inputs/Selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import Select from '../../../components/inputs/Select';
import Check from '../../../components/inputs/Check';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from 'react-native';
// import BouncyCheckbox from "react-native-bouncy-checkbox";


export default function ApplicantScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [resume, setResume] = React.useState(null);
    const [user, setUser] = React.useState(null);

    const [birthday, setBirthday] = React.useState(null);
    const [gender, setGender] = React.useState("MALE");
    const [moving, setMoving] = React.useState(null);
    const [trips, setTrips] = React.useState(null);
    const [experience, setExperience] = React.useState(0);
    const [educationLevel, setEducationLevel] = React.useState('secondary');

    const [employments, setEmployments] = React.useState();
    const [schedules, setSchedules] = React.useState();
    const [drivingcategoires, setDrivingCategories] = React.useState();
    const [skills, setSkills] = React.useState();

    const [employmentsList, setEmploymentsList] = React.useState();
    const [schedulesList, setSchedulesList] = React.useState();
    const [skillText, setSkillText] = React.useState('');

    const [toggle, setToggle] = React.useState(true);

    const { resumeId, refresh } = route.params;

    const optionsGender = [
        { label: 'Мужской', value: 'MALE' },
        { label: 'Женский', value: 'FEMALE' }
    ]
    const optionsMoving = [
        { label: 'Невозможен', value: 'cant' },
        { label: 'Возможен', value: 'can' },
        { label: 'Желателен', value: 'hope' }
    ];
    const optionsTrip = [
        { label: 'Никогда', value: 'never' },
        { label: 'Готов', value: 'ready' },
        { label: 'Иногда', value: 'sometimes' }
    ]
    const optionsExperience = [
        { label: 'Нет опыта работы', value: 0 },
        { label: 'Есть опыт работы', value: 1 }
    ]
    const optionsEducation = [
        { label: 'Среднее', value: 'secondary', key: 'secondary' },
        { label: 'Среднее специальное', value: 'special_secondary', key: 'special_secondary' },
        { label: 'Неоконченное высшее', value: 'unfinished_higher', key: 'unfinished_higher' },
        { label: 'Высшее', value: 'higher', key: 'higher' },
        { label: 'Бакалавр', value: 'bachelor', key: 'bachelor' },
        { label: 'Магистр', value: 'master', key: 'master' },
        { label: 'Кандидат наук', value: 'candidate', key: 'candidate' },
        { label: 'Доктор наук', value: 'doctor', key: 'doctor' },
    ]


    const findInit = (list, need, key = 'value') => {
        return list.findIndex((element) => element[key] == need);
    }

    const editPersonal = (value, name) => {
        let formData = new FormData();
        formData.append("resumeId", resume.id);
        formData.append("token", user.api_token);
        formData.append(name, value);
        fetch(`${SiteUrl}api/resume/edit/personal`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => console.log(response))
    }

    const editContacts = (value, name) => {
        let formData = new FormData();
        formData.append("resumeId", resume.id);
        formData.append("token", user.api_token);
        formData.append(name, value);
        fetch(`${SiteUrl}api/resume/edit/contacts`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => console.log(response))
    }

    const editJob = (value, name) => {
        if (!value) return;
        let formData = new FormData();
        formData.append("resumeId", resume.id);
        formData.append("token", user.api_token);
        formData.append(name, value);
        fetch(`${SiteUrl}api/resume/edit/job`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => console.log(response))
    }

    const editExperience = async (value, name) => {
        // if (value === '') return;
        let formData = new FormData();
        formData.append("resumeId", resume.id);
        formData.append("token", user.api_token);
        formData.append(name, value);
        await fetch(`${SiteUrl}api/resume/edit/experience`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => console.log(response))
    }

    const edit = async (value, name) => {
        if (value === '') return;
        let formData = new FormData();
        formData.append("resumeId", resume.id);
        formData.append("token", user.api_token);
        formData.append(name, value);
        await fetch(`${SiteUrl}api/resume/edit`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => console.log(response))
    }

    const editEmployments = (value, status) => {
        employmentsList[findInit(employmentsList, value, 'id')].isChecked = status;
        let formData = new FormData();
        employmentsList.forEach(employ => {
            if (employ.isChecked) formData.append("employments[]", employ.id);
        });
        formData.append("token", user.api_token);
        formData.append("resumeId", resume.id);

        fetch(`${SiteUrl}api/resume/edit/employments`, {
            method: 'post',
            body: formData,
        }).then(response => response.text()).then(response => console.log(response))

    }

    const editSchedules = (value, status) => {
        schedulesList[findInit(schedulesList, value, 'id')].isChecked = status;
        let formData = new FormData();
        schedulesList.forEach(schedule => {
            if (schedule.isChecked) formData.append("schedules[]", schedule.id);
        });
        formData.append("token", user.api_token);
        formData.append("resumeId", resume.id);

        fetch(`${SiteUrl}api/resume/edit/schedules`, {
            method: 'post',
            body: formData,
        }).then(response => response.text()).then(response => console.log(response))

    }

    const editSkills = () => {
        if (findInit(skills, skillText, 'skill') != -1 || !skillText) return;
        let tmpSkills = skills;
        tmpSkills.push({ skill: skillText })

        let formData = new FormData();
        tmpSkills.forEach(skill => formData.append("skills[]", skill.skill));
        formData.append("token", user.api_token);
        formData.append("resumeId", resume.id);

        fetch(`${SiteUrl}api/resume/edit/skills`, {
            method: 'post',
            body: formData,
        }).then(response => response.text()).then(response => console.log(response))

        setSkills(tmpSkills)
        setSkillText('')
    }

    const editRemoveSkills = async (value) => {
        let tmpSkills = skills;
        tmpSkills.splice(findInit(skills, value, 'skill'), 1)
        let formData = new FormData();
        tmpSkills.forEach(skill => formData.append("skills[]", skill.skill));
        formData.append("token", user.api_token);
        formData.append("resumeId", resume.id);

        fetch(`${SiteUrl}api/resume/edit/skills`, {
            method: 'post',
            body: formData,
        }).then(response => response.text()).then(response => console.log(response))
        setSkills(tmpSkills)
        setToggle(!toggle);
    }

    const getData = () => {
        setIsLoading(true);
        try {
            fetch(`${SiteUrl}api/resume/${resumeId}`, {
                method: 'post'
            }).then(response => response.json()).then(response => {
                setResume(response.data.resume)
                setGender(response.data.resume.personal.gender)
                setMoving(response.data.resume.personal.moving)
                setTrips(response.data.resume.personal.trips)
                setExperience(response.data.resume.hasExperience.has)
                setEducationLevel(response.data.resume.education_level)
                setEmployments(response.data.resume.employments)
                setSchedules(response.data.resume.schedules)
                setDrivingCategories(response.data.resume.drivingCategories)
                setSkills(response.data.resume.skills)
                return response;
            }).then(async (response) => {
                await AsyncStorage.getItem('user', (errs, user) => {
                    setUser(JSON.parse(user));
                });
                let tmpOldEmployments = response.data.resume.employments;
                let tmpOldSchedules = response.data.resume.schedules;
                let formdata = new FormData();
                formdata.append("position", "**");
                await fetch(`${SiteUrl}api/search/vacancies`, {
                    method: 'post',
                    body: formdata,
                }).then(response => response.json()).then(async response => {
                    let tempEmployments = response.data.employments;
                    let tempSchedules = response.data.schedules;
                    tempSchedules.forEach(element => {
                        element.isChecked = (tmpOldSchedules.some(e => e.schedule === element.schedule)) ? true : false;
                    })
                    tempEmployments.forEach(element => {
                        element.isChecked = (tmpOldEmployments.some(e => e.employment === element.employment)) ? true : false;
                    });
                    setEmploymentsList(tempEmployments);
                    setSchedulesList(tempSchedules);
                    setIsLoading(false);

                })
            })


        } catch (e) {
            Alert.alert("Ошибка", "Проверьте подключение к интернету")
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
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
            <SafeAreaView>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <Text style={[defStyles.header, { textAlign: 'center' }]}>Ваше резюме</Text>
                        <View style={styles.section}>
                            <Text style={styles.header}>Персональный данные</Text>
                            <LabelInput label={'Имя'} value={resume.personal.name} onChange={value => editPersonal(value, 'name')} />
                            <LabelInput label={'Фамилия'} value={resume.personal.surname} onChange={value => editPersonal(value, 'surname')} />
                            <LabelInput label={'Отчество'} value={resume.personal.patronymic} help={'Не обязательно'} onChange={value => editPersonal(value, 'patronymic')} />
                            <LabelInput label={'Город проживания'} value={resume.city} />
                            <Selector initial={findInit(optionsGender, gender)} onChange={value => editPersonal(value, 'gender')} label={'Пол'} options={optionsGender} />
                            <Selector initial={findInit(optionsMoving, moving)} onChange={value => editPersonal(value, 'moving')} label={'Переезд'} options={optionsMoving} />
                            <Selector initial={findInit(optionsTrip, trips)} onChange={value => editPersonal(value, 'trips')} label={'Готовность к командировкам'} options={optionsTrip} />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.header}>Контактная информация</Text>
                            <LabelInput label={'Желаемая должность'} value={resume.contacts.phone} onChange={value => editContacts(value, 'phone')} />
                            <LabelInput label={'Почта'} value={resume.contacts.email} onChange={value => editContacts(value, 'email')} />
                            <LabelInput label={'Телеграм'} value={resume.contacts.telegram} onChange={value => editContacts(value, 'telegram')} />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.header}>Специальность</Text>
                            <LabelInput label={'Желаемая должность'} value={(resume.job && resume.job.title) ? resume.job.title : null} onChange={value => editJob(value, 'title')} />
                            <LabelInput label={'Желаемая зарплата'} value={(resume.job && resume.job.salary) ? resume.job.salary : null} onChange={value => editJob(value, 'salary')} />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.header}>Опыт работы</Text>
                            <Selector initial={findInit(optionsExperience, experience)} onChange={value => { editExperience(value, 'has'); setExperience(value) }} label={'Опыт работы'} options={optionsExperience} />
                            {(experience) ?
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                            navigation.navigate("Experience", { newExp: true, resumeId: resume.id, token: user.api_token })
                                        }}>
                                            <Text style={{ color: 'white' }}>Добавить место работы</Text>
                                        </TouchableOpacity>
                                    </View>
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
                                                <View style={{ flexDirection: 'row', justifyContent: 'left', marginTop: 20 }}>
                                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                                        navigation.navigate("Experience", { experience: item, newExp: false, resumeId: resume.id, token: user.api_token })
                                                    }}>
                                                        <Text style={{ color: 'white' }}>Изменить</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={() => {
                                                        let formData = new FormData();
                                                        formData.append('token', user.api_token)
                                                        formData.append('resumeId', resume.id)
                                                        formData.append('epxerienceItemId', item.id);
                                                        fetch(SiteUrl + 'api/resume/edit/experience/item/remove', {
                                                            method: 'post',
                                                            body: formData,
                                                        }).then((response) => response.text()).then((response) => {
                                                            console.log(response)
                                                            getData();
                                                        }).catch(e => {
                                                            console.log(`some error: ${e}`)
                                                        })
                                                    }}>
                                                        <Text style={{ color: 'white' }}>Удалить</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                                :
                                <></>
                            }
                            <LabelInput label={'О себе'} value={(resume.about) ? resume.about : null} multiline={true} onChange={value => edit(value, 'about')} />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.header}>Образование</Text>
                            <Select items={optionsEducation} label={'Уровень'} itemKey={educationLevel} onChange={(value) => { edit(value, 'education_level'); setEducationLevel(value) }} />
                            {educationLevel != 'secondary' ?
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                            let formData = new FormData();
                                            formData.append('token', user.api_token)
                                            formData.append('resumeId', resume.id)
                                            formData.append('educationItemId', null);
                                            fetch(SiteUrl + 'api/resume/edit/education/item', {
                                                method: 'post',
                                                body: formData,
                                            }).catch(e => {
                                                console.log(`some error: ${e}`)
                                            }).then(response => response.json()).then(response => {
                                                navigation.navigate("Education", { education: response.data.education, newEdu: false, resumeId: resume.id, token: user.api_token })
                                            })
                                        }}>
                                            <Text style={{ color: 'white' }}>{resume.educations.length > 0 ? 'Добавить еще одно место учебы' : 'Добавить место учебы'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {resume.educations.map((item, i) => {
                                        return (
                                            <View key={`education-${item.id}`} style={styles.card}>
                                                <Text style={[{ color: '#dc3545', fontSize: 20, fontWeight: 500, marginBottom: 10 }]}>{item.college}</Text>
                                                <Text style={styles.text}>{item.faculty}</Text>
                                                <Text style={[styles.text, { fontWeight: 700 }]}>{item.specialitty}</Text>
                                                <Text style={styles.text}>Год окончания: {item.year_end}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'left', marginTop: 20 }}>
                                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 0 }]} onPress={() => {
                                                        navigation.navigate("Education", { education: item, newEdu: false, resumeId: resume.id, token: user.api_token })
                                                    }}>
                                                        <Text style={{ color: 'white' }}>Изменить</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 0 }]} onPress={() => {
                                                        let formData = new FormData();
                                                        formData.append('token', user.api_token)
                                                        formData.append('resumeId', resume.id)
                                                        formData.append('educationItemId', item.id);
                                                        fetch(SiteUrl + 'api/resume/edit/education/item/remove', {
                                                            method: 'post',
                                                            body: formData,
                                                        }).then((response) => response.text()).then((response) => {
                                                            console.log(response)
                                                            getData();
                                                        }).catch(e => {
                                                            console.log(`some error: ${e}`)
                                                        })
                                                    }}>
                                                        <Text style={{ color: 'white' }}>Удалить</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                                :
                                <></>
                            }
                        </View>
                        <View style={styles.section}>
                            <Text style={[styles.header, { marginBottom: 30 }]}>Другая важная информация</Text>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={[styles.text, { marginBottom: 10 }]}>Занятость</Text>
                                {employmentsList.map((employ) => {
                                    // console.log(employ)
                                    return (
                                        <Check key={`employment-${employ.id}`} value={employ.id} onChange={(value, status) => editEmployments(value, status)} isChecked={employ.isChecked} label={employ.employment} />
                                    )
                                })}
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={[styles.text, { marginBottom: 10 }]}>График работы</Text>
                                {schedulesList.map((schedule) => {
                                    // console.log(employ)
                                    return (
                                        <Check key={`schedule-${schedule.id}`} value={schedule.id} onChange={(value, status) => editSchedules(value, status)} isChecked={schedule.isChecked} label={schedule.schedule} />
                                    )
                                })}
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={[styles.text, { marginBottom: 10 }]}>Ключевые навыки</Text>
                                <View style={styles.inputSkillView}>
                                    <TextInput style={styles.inputSkill} value={skillText} placeholder='Введите навык и добавьте его' onChangeText={value => setSkillText(value)} />
                                    <TouchableOpacity style={styles.btnSkill} onPress={() => editSkills()}>
                                        <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {resume.skills.map((skill, i) => {
                                        return (
                                            <View key={`skill-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                                <View style={styles.skill}>
                                                    <Text key={`skill-${skill.id}`} style={{ fontSize: 20, marginRight: 10 }}>{skill.skill}</Text>
                                                    <TouchableOpacity onPress={() => editRemoveSkills(skill.skill)}>
                                                        <Ionicons name={'close-circle-outline'} size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary]} onPress={() => {
                                    let formData = new FormData();
                                    formData.append("token", user.api_token);
                                    formData.append("resumeId", resume.id);
                                    fetch(`${SiteUrl}api/resume/publish`, {
                                        method: 'post',
                                        body: formData,
                                    }).then(response => response.text()).then((response) => {
                                        console.log(response)
                                        navigation.navigate("Resumes", { 'refresh': 'true' });
                                    })
                                }}>
                                    <Text style={{ color: colors.white }}>Опубликовать резюме</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 700,
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        color: 'rgb(90, 90, 90)',
    },
    text: {
        fontSize: 20,
        color: 'rgb(40, 40, 40)',
        marginBottom: 8,
    },
    semiHeader: {
        fontSize: 18,
        color: 'rgb(120, 120, 120)',
        marginBottom: 10,
    },
    section: {
        marginBottom: 30,
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
        marginBottom: 15,
        padding: 10,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgb(240, 240, 240)',
        flexDirection: 'row',
    },
    inputSkillView: {
        borderColor: 'silver',
        borderWidth: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        resizeMode: 'contain',
        flex: 1,
        marginBottom: 15
    },
    inputSkill: {
        fontSize: 22,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 11,
    },
    btnSkill: {
        borderColor: colors.primary,
        borderLeftColor: 'silver',
        borderWidth: 1,
        // borderLeftWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: colors.primary,
        flex: 1,
    }
})