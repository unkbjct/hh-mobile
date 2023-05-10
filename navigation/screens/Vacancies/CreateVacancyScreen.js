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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelInput from '../../../components/inputs/Labelnput';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import Check from '../../../components/inputs/Check';
import Checkbox from 'expo-checkbox';
import { TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CreateVacancyScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [position, setPosition] = React.useState('');
    const [salary, setSalary] = React.useState('');
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [city, setCity] = React.useState('');
    const [cityText, setCityText] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [schedule, setSchedule] = React.useState('');
    const [employment, setEmployment] = React.useState('');
    const [experience, setExperience] = React.useState('');
    const [education, setEducation] = React.useState('');

    const [requirements, setRequirements] = React.useState([]);
    const [requirementText, setRequirementText] = React.useState('');

    const [responsebilities, setResponsibilities] = React.useState([]);
    const [responsebilityText, setResponsibilityText] = React.useState('');

    const [offers, setOffers] = React.useState([]);
    const [offerText, setOfferText] = React.useState('');

    const [pluses, setPluses] = React.useState([]);
    const [plusText, setPLusText] = React.useState('');

    const [skills, setSkills] = React.useState([]);
    const [skillText, setSkillText] = React.useState('');

    const [citiesList, setCitiesList] = React.useState([]);
    const [toggle, setToggle] = React.useState(false);

    const [employmentsList, setEmploymentsList] = React.useState();
    const [schedulesList, setSchedulesList] = React.useState();

    const { company, newVacancy, vacancy } = route.params;

    const experienceList = [
        { label: 'Не имеет значения', value: 'Не имеет значения' },
        { label: 'Нет опыта', value: 'Нет опыта' },
        { label: 'От 1 года до 3 лет', value: 'От 1 года до 3 лет' },
        { label: 'От 3 лет до 6 лет', value: 'От 3 лет до 6 лет' },
        { label: 'Более 6 лет', value: 'Более 6 лет' },
    ]

    const educationList = [
        { label: 'Не требуется', value: 'Не требуется' },
        { label: 'Среднее профессиональное', value: 'Среднее профессиональное' },
        { label: 'Высшее', value: 'Высшее' },
    ]

    const findInit = (list, need, key = 'value') => {
        return list.findIndex((element) => element[key] == need);
    }

    const cityFind = (value) => {
        if (value == '') {
            setCitiesList([]);
            setToggle(!toggle);
            return;
        }
        let formData = new FormData();
        formData.append('city', value)
        fetch(`${SiteUrl}api/city/find?${new URLSearchParams({
            city: value,
        })}`, {
            method: 'get',
        }).then(response => response.json()).then(response => {
            // console.log(response)
            setCitiesList(response);
            setToggle(!toggle);
        })
    }


    const addItem = (list, setList, value, setValue) => {
        if (value == '' || list.includes(value)) return;

        tmpList = list;
        tmpList.push(value);
        setList(tmpList);
        setValue('');
        setToggle(!toggle);
    }

    const removeItem = (list, setList, value) => {
        tmpList = list;
        tmpList.splice(list.findIndex(e => e == value), 1);
        setList(tmpList);
        setToggle(!toggle);
    }

    const editVacancy = () => {
        let formData = new FormData();
        formData.append("position", position);
        formData.append("salary", salary);
        formData.append("salary", salary);
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("experience", experience);
        formData.append("education", education);
        formData.append("employment", employment);
        formData.append("schedule", schedule);
        requirements.forEach(e => formData.append("requirements[]", e));
        responsebilities.forEach(e => formData.append("responsibilities[]", e));
        offers.forEach(e => formData.append("offers[]", e));
        pluses.forEach(e => formData.append("pluses[]", e));
        skills.forEach(e => formData.append("skills[]", e));

        fetch(`${SiteUrl}api/company/${company.id}/vacancy/${vacancy.id}/edit`, {
            method: 'post',
            body: formData,
        }).then(response => response.text()).then(response => {
            if (response.errors) {
                let errors = response.errors
                let alertString = "";
                for (let key in errors) {
                    alertString += `\n${errors[key]}`;
                }
                Alert.alert("Ошибка", alertString);
                return;
            }
            Alert.alert("Вакансия успешно сохранена", "", [{
                text: "ок",
                onPress: () => navigation.navigate("Company", { refresh: true, company: company })
            }])
        })
    }

    const createVacancy = () => {
        let formData = new FormData();
        formData.append("position", position);
        formData.append("salary", salary);
        formData.append("salary", salary);
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("experience", experience);
        formData.append("education", education);
        formData.append("employment", employment);
        formData.append("schedule", schedule);
        requirements.forEach(e => formData.append("requirements[]", e));
        responsebilities.forEach(e => formData.append("responsibilities[]", e));
        offers.forEach(e => formData.append("offers[]", e));
        pluses.forEach(e => formData.append("pluses[]", e));
        skills.forEach(e => formData.append("skills[]", e));

        fetch(`${SiteUrl}api/company/${company.id}/vacancy/create`, {
            method: 'post',
            body: formData,
        }).then(response => response.json()).then(response => {
            if (response.errors) {
                let errors = response.errors
                let alertString = "";
                for (let key in errors) {
                    alertString += `\n${errors[key]}`;
                }
                Alert.alert("Ошибка", alertString);
                return;
            }
            Alert.alert("Вакансия успешно добавлена", "Дождитесь окончания проверки, после чего ее смогут  увидеть другие пользователи", [{
                text: "ок",
                onPress: () => navigation.navigate("Company", { refresh: true, company: company })
            }])
        })
    }

    const getData = () => {

        setIsLoading(true);
        AsyncStorage.getItem('user', async (errs, tempUser) => {
            tempUser = JSON.parse(tempUser)
            setUser(tempUser);

            if (!newVacancy) {
                await fetch(`${SiteUrl}api/vacancy/${vacancy.id}`, {
                    method: 'post'
                }).then(response => response.json()).then(async response => {
                    setPosition(response.data.vacancy.position)
                    setSalary(response.data.vacancy.salary)
                    setName(response.data.vacancy.name)
                    setSurname(response.data.vacancy.surname)
                    setPhone(response.data.vacancy.phone)
                    setEmail(response.data.vacancy.email)
                    setCity(response.data.vacancy.city.id)
                    setCityText(response.data.vacancy.city.city ? response.data.vacancy.city.city : response.data.vacancy.city.region)
                    setAddress(response.data.vacancy.address)
                    setDescription(response.data.vacancy.description)
                    setExperience(response.data.vacancy.experience)
                    setEducation(response.data.vacancy.education)
                    setEmployment(response.data.vacancy.employment.id)
                    setSchedule(response.data.vacancy.schedule.id)
                    setResponsibilities(response.data.vacancy.responsibilities.map((e) => e.responsibility))
                    setRequirements(response.data.vacancy.requirements.map(e => e.requirement))
                    setOffers(response.data.vacancy.offers.map(e => e.offer))
                    setPluses(response.data.vacancy.pluses.map(e => e.plus))
                    setSkills(response.data.vacancy.skills.map(e => e.skill))
                })
            }


            let formdata = new FormData();
            formdata.append("position", "**");
            await fetch(`${SiteUrl}api/search/vacancies`, {
                method: 'post',
                body: formdata,
            }).then(response => response.json()).then(async response => {
                let tempEmployments = response.data.employments;
                let tempSchedules = response.data.schedules;

                setEmploymentsList(tempEmployments);
                setSchedulesList(tempSchedules);

            })


            setIsLoading(false)
        })
    }

    React.useEffect(getData, [route]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />} style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView >
                <ScrollView nestedScrollEnabled={true} >
                    <View style={{ padding: 10 }}>
                        <Text style={[defStyles.header, { textAlign: 'center', marginBottom: 20 }]}>{newVacancy ? "Добавление новой вакансии" : "Редактирование вакансии"} </Text>
                        <LabelInput value={position} label={"Должность"} onChange={value => setPosition(value)} help={"Обязательно"} />
                        <LabelInput value={salary} label={"Зарплата"} onChange={value => setSalary(value)} help={"Обязательно"} />
                        <LabelInput value={name} label={"Имя человека для связи"} onChange={value => setName(value)} help={"Обязательно"} />
                        <LabelInput value={surname} label={"фамилия человека для связи"} onChange={value => setSurname(value)} help={"Обязательно"} />
                        <LabelInput value={phone} label={"Телефон для связи"} onChange={value => setPhone(value)} help={"Обязательно"} />
                        <LabelInput value={email} label={"Почта для связи"} onChange={value => setEmail(value)} help={"Не обязательно"} />
                        <View style={{ position: 'relative' }}>
                            <LabelInput value={cityText} onChange={value => cityFind(value)} label={'Город'} help={'Обязательно, выбран из списка'} />
                            <ScrollView style={[styles.citiesList, (!citiesList.length) ? { borderWidth: 0 } : {}]} nestedScrollEnabled={true}>
                                {citiesList.map((city, i) => {
                                    return (
                                        // <Text>asd</Text>
                                        <TouchableOpacity key={`city-${i}`} style={[styles.cityItem, (i == citiesList.length - 1) ? { borderBottomWidth: 0 } : {}]} onPress={async () => {
                                            setCity(city.id);
                                            setCityText((city.city) ? city.city : city.region)
                                            setToggle(!toggle);
                                            getData();
                                            setCitiesList([]);
                                            setToggle(!toggle);
                                        }}>
                                            <Text>{(city.city) ? city.city : city.region}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <LabelInput value={address} label={"Адрес"} onChange={value => setAddress(value)} help={"Не обязательно"} />
                        <LabelInput value={description} label={"Подробное описание"} onChange={value => setDescription(value)} help={"Не обязательно"} />
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>График работы</Text>
                            {schedulesList.map((item, i) => {
                                return (
                                    <TouchableOpacity key={`schedule-${i}`} style={styles.Container} onPress={() => setSchedule(item.id)}>
                                        <Checkbox
                                            style={styles.Checkbox}
                                            value={(schedule == item.id)}
                                            onValueChange={() => { }}
                                            color={(schedule == item.id) ? colors.danger : undefined}
                                        />
                                        <Text style={{ fontSize: 20, marginBottom: 10 }}>{item.schedule}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Тип занятости</Text>
                            {employmentsList.map((item, i) => {
                                return (
                                    <TouchableOpacity key={`employment-${i}`} style={styles.Container} onPress={() => setEmployment(item.id)}>
                                        <Checkbox
                                            style={styles.Checkbox}
                                            value={(employment == item.id)}
                                            onValueChange={() => { }}
                                            color={(employment == item.id) ? colors.danger : undefined}
                                        />
                                        <Text style={{ fontSize: 20, marginBottom: 10 }}>{item.employment}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Опыт работы</Text>
                            {experienceList.map((item, i) => {
                                return (
                                    <TouchableOpacity key={`experience-${i}`} style={styles.Container} onPress={() => setExperience(item.value)}>
                                        <Checkbox
                                            style={styles.Checkbox}
                                            value={(experience == item.value)}
                                            onValueChange={() => { }}
                                            color={(experience == item.value) ? colors.danger : undefined}
                                        />
                                        <Text style={{ fontSize: 20, marginBottom: 10 }}>{item.label}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Образование</Text>
                            {educationList.map((item, i) => {
                                return (
                                    <TouchableOpacity key={`education-${i}`} style={styles.Container} onPress={() => setEducation(item.value)}>
                                        <Checkbox
                                            style={styles.Checkbox}
                                            value={(education == item.value)}
                                            onValueChange={() => { }}
                                            color={(education == item.value) ? colors.danger : undefined}
                                        />
                                        <Text style={{ fontSize: 20, marginBottom: 10 }}>{item.label}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Требования</Text>
                            <View style={styles.inputAddView}>
                                <TextInput style={styles.inputAdd} value={requirementText} placeholder='Введите навык и добавьте его' onChangeText={value => setRequirementText(value)} />
                                <TouchableOpacity style={styles.btnAdd} onPress={() => addItem(requirements, setRequirements, requirementText, setRequirementText)}>
                                    <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                {requirements.map((item, i) => {
                                    return (
                                        <View key={`requirement-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                            <View style={styles.listItem}>
                                                <Text style={{ fontSize: 20, marginRight: 10, flex: 9 }}>{item}</Text>
                                                <TouchableOpacity style={{ flex: 1 }} onPress={() => removeItem(requirements, setRequirements, item)}>
                                                    <Ionicons name={'close-circle-outline'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Обязанности</Text>
                            <View style={styles.inputAddView}>
                                <TextInput style={styles.inputAdd} value={responsebilityText} placeholder='Введите навык и добавьте его' onChangeText={value => setResponsibilityText(value)} />
                                <TouchableOpacity style={styles.btnAdd} onPress={() => addItem(responsebilities, setRequirements, responsebilityText, setResponsibilityText)}>
                                    <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                {responsebilities.map((item, i) => {
                                    return (
                                        <View key={`responsebility-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                            <View style={styles.listItem}>
                                                <Text style={{ fontSize: 20, marginRight: 10, flex: 9 }}>{item}</Text>
                                                <TouchableOpacity style={{ flex: 1 }} onPress={() => removeItem(responsebilities, setRequirements, item)}>
                                                    <Ionicons name={'close-circle-outline'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Будет плюсом</Text>
                            <View style={styles.inputAddView}>
                                <TextInput style={styles.inputAdd} value={plusText} placeholder='Введите навык и добавьте его' onChangeText={value => setPLusText(value)} />
                                <TouchableOpacity style={styles.btnAdd} onPress={() => addItem(pluses, setPluses, plusText, setPLusText)}>
                                    <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                {pluses.map((item, i) => {
                                    return (
                                        <View key={`plus-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                            <View style={styles.listItem}>
                                                <Text style={{ fontSize: 20, marginRight: 10, flex: 9 }}>{item}</Text>
                                                <TouchableOpacity style={{ flex: 1 }} onPress={() => removeItem(pluses, setPluses, item)}>
                                                    <Ionicons name={'close-circle-outline'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Что мы предлагаем</Text>
                            <View style={styles.inputAddView}>
                                <TextInput style={styles.inputAdd} value={offerText} placeholder='Введите навык и добавьте его' onChangeText={value => setOfferText(value)} />
                                <TouchableOpacity style={styles.btnAdd} onPress={() => addItem(offers, setOffers, offerText, setOfferText)}>
                                    <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                {offers.map((item, i) => {
                                    return (
                                        <View key={`offer-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                            <View style={styles.listItem}>
                                                <Text style={{ fontSize: 20, marginRight: 10, flex: 9 }}>{item}</Text>
                                                <TouchableOpacity style={{ flex: 1 }} onPress={() => removeItem(offers, setOffers, item)}>
                                                    <Ionicons name={'close-circle-outline'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.text, { marginBottom: 10 }]}>Ключевые навыки</Text>
                            <View style={styles.inputAddView}>
                                <TextInput style={styles.inputAdd} value={skillText} placeholder='Введите навык и добавьте его' onChangeText={value => setSkillText(value)} />
                                <TouchableOpacity style={styles.btnAdd} onPress={() => addItem(skills, setSkills, skillText, setSkillText)}>
                                    <Ionicons name='add-circle-outline' size={24} color={'white'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {skills.map((item, i) => {
                                    return (
                                        <View key={`skill-${i}`} style={{ alignItems: 'baseline', marginRight: 15, }}>
                                            <View style={styles.listItem}>
                                                <Text style={{ fontSize: 20, marginRight: 10 }}>{item}</Text>
                                                <TouchableOpacity style={{}} onPress={() => removeItem(skills, setSkills, item)}>
                                                    <Ionicons name={'close-circle-outline'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            {newVacancy ?
                                <Text style={{ textAlign: 'center', marginBottom: 15 }}>Полсе публикации вакансия будет отправлена на проверку, дождитесь ее окончания</Text>
                                :
                                <></>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 20 }]} onPress={() => {
                                    newVacancy ? createVacancy() : editVacancy();
                                }}>
                                    <Text style={{ color: 'white' }}>{newVacancy ? "Опубликовать вакансию" : "Сохранить вакансию"}</Text>
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
    cityItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        zIndex: 10,
        borderBottomColor: 'silver',
        borderBottomWidth: 1,
    },
    text: {
        fontSize: 20,
        color: 'rgb(40, 40, 40)',
        marginBottom: 8,
    },
    citiesList: {
        position: 'absolute',
        // top: '100%',
        bottom: '100%',
        left: 0,
        right: 0,
        zIndex: 10,
        maxHeight: 200,
        overflow: 'scroll',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 7,
    },
    borderTop: {
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
    },
    borderBottom: {
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
    },
    companyLogo: {
        width: '80%',
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    Container: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    Checkbox: {
        marginRight: 15,
    },
    listItem: {
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
    inputAddView: {
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
    inputAdd: {
        fontSize: 22,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 11,
    },
    btnAdd: {
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
    },
})