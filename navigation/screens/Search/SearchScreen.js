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
import { defStyles, colors } from '../../../components/styles';
import { SiteUrl } from '../../../env';
import VacancyCard from '../../../components/VacancyCard';
import ResumeCard from '../../../components/ResumeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collapsible from 'react-native-collapsible';
import LabelInput from '../../../components/inputs/Labelnput';
import Check from '../../../components/inputs/Check';
import Checkbox from 'expo-checkbox';
import { StyleSheet } from 'react-native';

export default function SearchScreen({ navigation }) {

    const Tab = createMaterialTopTabNavigator();


    return (
        <Tab.Navigator style={{ borderWidth: 0 }}>
            <Tab.Screen name="Искать работу" component={SearchVacancies} />
            <Tab.Screen name="Искать работника" component={SearchResumes} />
        </Tab.Navigator>
    );
}


const SearchResumes = ({ navigation }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [resumes, setResumes] = React.useState(null);
    const [isCollapsed, setCollapsed] = React.useState(true);
    const [isFiltered, setFiltered] = React.useState(false);

    const [position, setPosition] = React.useState('');

    const [educations, setEducations] = React.useState([
        { isChecked: false, label: 'Среднее', id: 'secondary' },
        { isChecked: false, label: 'Среднее специальное', id: 'special_secondary' },
        { isChecked: false, label: 'Неоконченное высшее', id: 'unfinished_higher' },
        { isChecked: false, label: 'Высшее', id: 'higher' },
        { isChecked: false, label: 'Бакалавр', id: 'bachelor' },
        { isChecked: false, label: 'Магистр', id: 'master' },
        { isChecked: false, label: 'Кандидат наук', id: 'candidate' },
        { isChecked: false, label: 'Доктор наук', id: 'doctor' },
    ]);
    const [experienceList, setExperienceList] = React.useState([
        { isChecked: false, label: 'Есть опыт работы', id: 1 },
        { isChecked: false, label: 'нет опыта работы', id: 0 },
    ]);
    const [sortList, setSortList] = React.useState([
        { isChecked: false, label: 'Сначала новые', id: 'created_at|desc' },
        { isChecked: false, label: 'Сначала старые', id: 'created_at|asc' },
    ]);
    const [sort, setSort] = React.useState('');
    const [experience, setExperience] = React.useState('some');

    const [employments, setEmployments] = React.useState([]);
    const [schedules, setSchedules] = React.useState([]);

    const findInit = (list, need, key = 'id') => {
        return list.findIndex((element) => element[key] == need);
    }

    const editChecks = (list, setList, value, status) => {
        list[findInit(list, value)].isChecked = status;
        setList(list);
    }


    const getData = () => {
        setIsLoading(true);
        try {

            fetch(SiteUrl + 'api/search/resumes', {
                method: 'post'
            }).then(async function (response) {
                response = await response.json();
                await setResumes(response.data.resumes)
                setEmployments(response.data.employments.map(e => { e.isChecked = false; return e }));
                setSchedules(response.data.schedules.map(e => { e.isChecked = false; return e }));
            }).finally(() => setIsLoading(false))

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
                        <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => { setCollapsed(!isCollapsed) }}>
                            <Text style={{ color: 'white' }}>Фильтры</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Collapsible collapsed={isCollapsed} duration={1000}>
                            <View style={{ padding: 10 }}>
                                <Text style={[defStyles.semiHeadeer, { textAlign: 'center', marginBottom: 20 }]}>Поиск работника - фильтры</Text>
                                <View>
                                    <LabelInput label={'Должность'} value={position} onChange={value => setPosition(value)} />
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Образование</Text>
                                        {educations.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`educations-${i}`} value={item.id} onChange={(value, status) => editChecks(educations, setEducations, value, status)} isChecked={item.isChecked} label={item.label} />
                                            )
                                        })}
                                    </View>

                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Требуемый опыт работы</Text>
                                        {experienceList.map((item, i) => {
                                            return (
                                                <TouchableOpacity key={`sort-${i}`} style={styles.Container} onPress={() => setExperience(item.id)}>
                                                    <Checkbox
                                                        style={styles.Checkbox}
                                                        value={(experience == item.id)}
                                                        onValueChange={() => { }}
                                                        color={(experience == item.id) ? colors.danger : undefined}
                                                    />
                                                    <Text style={{ fontSize: 20 }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Тип занятости</Text>
                                        {employments.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`employments-${i}`} value={item.id} onChange={(value, status) => editChecks(employments, setEmployments, value, status)} isChecked={item.isChecked} label={item.employment} />
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>График работы</Text>
                                        {schedules.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`schedules-${i}`} value={item.id} onChange={(value, status) => editChecks(schedules, setSchedules, value, status)} isChecked={item.isChecked} label={item.schedule} />
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Сортировка</Text>
                                        {sortList.map((item, i) => {
                                            return (
                                                <TouchableOpacity key={`sort-${i}`} style={styles.Container} onPress={() => setSort(item.id)}>
                                                    <Checkbox
                                                        style={styles.Checkbox}
                                                        value={(sort == item.id)}
                                                        onValueChange={() => { }}
                                                        color={(sort == item.id) ? colors.danger : undefined}
                                                    />
                                                    <Text style={{ fontSize: 20 }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={async () => {
                                        await setFiltered(false);
                                        await setExperience('some')
                                        setEmployments(employments.map(e => { e.isChecked = false; return e }))
                                        setSchedules(schedules.map(e => { e.isChecked = false; return e }))
                                        setEducations(educations.map(e => { e.isChecked = false; return e }))
                                        setPosition('');
                                        setSort('');
                                        await setCollapsed(true);
                                        getData();
                                    }}>
                                        <Text style={{ color: 'white' }}>Сбросить</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                        let formData = new FormData();
                                        formData.append("position", position);
                                        formData.append("experience[]", experience);
                                        formData.append("sort", sort);
                                        educations.map(e => { if (e.isChecked) formData.append('education[]', e.id) })
                                        employments.map(e => { if (e.isChecked) formData.append('employments[]', e.id) })
                                        schedules.map(e => { if (e.isChecked) formData.append('schedules[]', e.id) })

                                        fetch(`${SiteUrl}api/search/resumes`, {
                                            method: 'post',
                                            body: formData
                                        }).then(response => response.json()).then(async response => {
                                            console.log(response)

                                            setResumes(response.data.resumes)
                                            setCollapsed(!isCollapsed)
                                            setFiltered(true);
                                        })
                                    }}>
                                        <Text style={{ color: 'white' }}>Применить</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Collapsible>
                    </View>
                    {resumes.length ?
                        <View style={{}}>
                            {resumes.map((resume) => {
                                return (
                                    <ResumeCard key={`resume-${resume.id}`} resume={resume} navigation={navigation} />
                                )
                            })}
                        </View>
                        :
                        <View style={{ marginTop: '40%' }}>
                            <Text style={{ textAlign: 'center', fontSize: 24, color: 'gray' }}>По заданным фильтрам ничего не найдено</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const SearchVacancies = ({ navigation }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [vacancies, setVacancies] = React.useState(null);
    const [favorites, setFavorites] = React.useState([]);
    const [isCollapsed, setCollapsed] = React.useState(true);
    const [isFiltered, setFiltered] = React.useState(false);

    const [position, setPosition] = React.useState('');
    const [salaryFrom, setSalaryFrom] = React.useState('');
    const [salaryTo, setSalaryTo] = React.useState('');

    const [educations, setEducations] = React.useState([
        { isChecked: false, label: 'Не требуется или не указано', id: 'Не требуется' },
        { isChecked: false, label: 'Среднее профессиональное', id: 'Среднее профессиональное' },
        { isChecked: false, label: 'Высшее', id: 'Высшее' },
    ]);
    const [experienceList, setExperienceList] = React.useState([
        { isChecked: false, label: 'Не имеет значения', id: 'Не имеет значения' },
        { isChecked: false, label: 'Нет опыта', id: 'Нет опыта' },
        { isChecked: false, label: 'От 1 года до 3 лет', id: 'От 1 года до 3 лет' },
        { isChecked: false, label: 'От 3 лет до 6 лет', id: 'От 3 лет до 6 лет' },
        { isChecked: false, label: 'Более 6 лет', id: 'Более 6 лет' },
    ]);
    const [sortList, setSortList] = React.useState([
        { isChecked: false, label: 'Сначала новые', id: 'created_at|desc' },
        { isChecked: false, label: 'Сначала старые', id: 'created_at|asc' },
        { isChecked: false, label: 'По убыванию зарплат', id: 'salary|desc' },
        { isChecked: false, label: 'По возрастанию зарплат', id: 'salary|asc' },
    ]);
    const [sort, setSort] = React.useState('');
    const [experience, setExperience] = React.useState('');

    const [employments, setEmployments] = React.useState([]);
    const [schedules, setSchedules] = React.useState([]);

    const findInit = (list, need, key = 'id') => {
        return list.findIndex((element) => element[key] == need);
    }

    const editChecks = (list, setList, value, status) => {
        list[findInit(list, value)].isChecked = status;
        setList(list);
    }

    const getData = () => {
        setIsLoading(true);
        try {
            fetch(SiteUrl + 'api/search/vacancies', {
                method: 'post'
            }).then(async function (response) {
                response = await response.json();
                if (!isFiltered) setVacancies(response.data.vacancies)
                setEmployments(response.data.employments.map(e => { e.isChecked = false; return e }));
                setSchedules(response.data.schedules.map(e => { e.isChecked = false; return e }));
                await AsyncStorage.getItem('favorites', (errs, favorites) => {
                    if(!favorites) return
                    console.log(favorites)
                    setFavorites(JSON.parse(favorites));
                })
            }).finally(() => setIsLoading(false))


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
                        <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => { setCollapsed(!isCollapsed) }}>
                            <Text style={{ color: 'white' }}>Фильтры</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Collapsible collapsed={isCollapsed} duration={1000}>
                            <View style={{ padding: 10 }}>
                                <Text style={[defStyles.semiHeadeer, { textAlign: 'center', marginBottom: 20 }]}>Поиск работы - фильтры</Text>
                                <View>
                                    <LabelInput label={'Должность'} />
                                    <LabelInput label={'Уровень дохода от'} />
                                    <LabelInput label={'Уровень дохода до'} />
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Образование</Text>
                                        {educations.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`educations-${i}`} value={item.id} onChange={(value, status) => editChecks(educations, setEducations, value, status)} isChecked={item.isChecked} label={item.id} />
                                            )
                                        })}
                                    </View>

                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Требуемый опыт работы</Text>
                                        {experienceList.map((item, i) => {
                                            return (
                                                <TouchableOpacity key={`sort-${i}`} style={styles.Container} onPress={() => setExperience(item.id)}>
                                                    <Checkbox
                                                        style={styles.Checkbox}
                                                        value={(experience == item.id)}
                                                        onValueChange={() => { }}
                                                        color={(experience == item.id) ? colors.danger : undefined}
                                                    />
                                                    <Text style={{ fontSize: 20 }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Тип занятости</Text>
                                        {employments.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`employments-${i}`} value={item.id} onChange={(value, status) => editChecks(employments, setEmployments, value, status)} isChecked={item.isChecked} label={item.employment} />
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>График работы</Text>
                                        {schedules.map((item, i) => {
                                            // console.log(employ)
                                            return (
                                                <Check key={`schedules-${i}`} value={item.id} onChange={(value, status) => editChecks(schedules, setSchedules, value, status)} isChecked={item.isChecked} label={item.schedule} />
                                            )
                                        })}
                                    </View>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={[styles.text, { marginBottom: 10 }]}>Сортировка</Text>
                                        {sortList.map((item, i) => {
                                            return (
                                                <TouchableOpacity key={`sort-${i}`} style={styles.Container} onPress={() => setSort(item.id)}>
                                                    <Checkbox
                                                        style={styles.Checkbox}
                                                        value={(sort == item.id)}
                                                        onValueChange={() => { }}
                                                        color={(sort == item.id) ? colors.danger : undefined}
                                                    />
                                                    <Text style={{ fontSize: 20 }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={async () => {
                                        await setFiltered(false);
                                        await setExperience('')
                                        setEmployments(employments.map(e => { e.isChecked = false; return e }))
                                        setSchedules(schedules.map(e => { e.isChecked = false; return e }))
                                        setEducations(educations.map(e => { e.isChecked = false; return e }))
                                        setPosition('');
                                        setSalaryFrom('');
                                        setSalaryTo('');
                                        setSort('');
                                        await setCollapsed(true);
                                        getData();
                                    }}>
                                        <Text style={{ color: 'white' }}>Сбросить</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                        let formData = new FormData();
                                        formData.append("position", position);
                                        formData.append("salary[from]", salaryFrom);
                                        formData.append("salary[to]", salaryTo);
                                        formData.append("experience", experience);
                                        formData.append("sort", sort);
                                        educations.map(e => { if (e.isChecked) formData.append('education[]', e.id) })
                                        employments.map(e => { if (e.isChecked) formData.append('employments[]', e.id) })
                                        schedules.map(e => { if (e.isChecked) formData.append('schedules[]', e.id) })

                                        fetch(`${SiteUrl}api/search/vacancies`, {
                                            method: 'post',
                                            body: formData
                                        }).then(response => response.json()).then(async response => {
                                            setVacancies(response.data.vacancies)
                                            setCollapsed(!isCollapsed)
                                            setFiltered(true);
                                        })
                                    }}>
                                        <Text style={{ color: 'white' }}>Применить</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Collapsible>
                    </View>
                    {vacancies.length ?
                        <View style={{}}>
                            {vacancies.map((vacancy) => {
                                // console.log(search);
                                return (
                                    <VacancyCard key={`${vacancy.id}`} vacancy={vacancy} navigation={navigation} callback={() => { getData }} favorites={favorites} />
                                )
                            })}
                        </View>
                        :
                        <View style={{ marginTop: '40%' }}>
                            <Text style={{ textAlign: 'center', fontSize: 24, color: 'gray' }}>По заданным фильтрам ничего не найдено</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
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
    Container: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    Checkbox: {
        marginRight: 15,
        borderRadius: 10,
    },
})