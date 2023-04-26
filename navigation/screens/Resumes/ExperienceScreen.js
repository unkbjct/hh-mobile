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
import LabelInput from '../../../components/inputs/Labelnput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ExperienceScreen({ navigation, route }) {
    const { experience, resumeId, token, newExp } = route.params;

    const [isLoading, setIsLoading] = React.useState(true);
    const [company, setCompany] = React.useState((newExp) ? '' : experience.company)
    const [position, setPosition] = React.useState((newExp) ? '' : experience.position)
    const [responsibilities, setResponsibilities] = React.useState((newExp) ? '' : experience.responsebilities)
    const [start_year, setStart_year] = React.useState((newExp) ? 0 : experience.start_year)
    const [end_year, setEnd_year] = React.useState((newExp) ? 0 : experience.end_year)


    const getData = () => {
        setIsLoading(true);
        setIsLoading(false);
    }

    React.useEffect(getData, []);


    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'white' }} nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
            <SafeAreaView>
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <Text style={[defStyles.semiHeadeer, { textAlign: 'center', marginBottom: 20 }]}>{newExp ? "Создание места работы" : "Редактирование места работы"} </Text>
                        <View>
                            <LabelInput label={'Организация'} value={newExp ? null : experience.company} onChange={value => setCompany(value)} />
                            <LabelInput label={'Должность'} value={newExp ? null : experience.position} onChange={value => setPosition(value)} />
                            <LabelInput label={'Обязанности'} multiline={true} value={newExp ? null : experience.responsibilities} onChange={value => setResponsibilities(value)} />
                            <LabelInput label={'Год начала работы'} value={newExp ? null : experience.start_year} onChange={value => setStart_year(value)} />
                            <LabelInput label={'Год окончания работы'} value={newExp ? null : experience.end_year} onChange={value => setEnd_year(value)} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={() => navigation.goBack()}>
                                    <Text style={{ color: 'white' }}>Отмена</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {

                                    // console.log(experience.id)

                                    let formData = new FormData();
                                    formData.append('token', token)
                                    formData.append('resumeId', resumeId)
                                    formData.append('epxerienceItemId', (newExp ? null : experience.id));
                                    formData.append('company', company)
                                    formData.append('position', position)
                                    formData.append('responsibilities', responsibilities)
                                    formData.append('start_day', 1)
                                    formData.append('start_year', start_year)
                                    formData.append('end_day', 1)
                                    formData.append('end_year', start_year)
                                    try {
                                        fetch(SiteUrl + 'api/resume/edit/experience/item', {
                                            method: 'post',
                                            body: formData,
                                        }).catch(e => {
                                            console.log(`some error: ${e}`)
                                        }).then(async (response) => {
                                            if (!response.ok) {
                                                response = await response.json();
                                                let errors = await response.errors
                                                let alertString = "";
                                                for (let key in errors) {
                                                    console.log(key)
                                                    alertString += `\n${errors[key]}`;
                                                }
                                                Alert.alert("Ошибка", alertString);
                                                return;
                                            } else {
                                                navigation.navigate('Applicant', { resumeId: resumeId, refresh: true })
                                            }
                                        }).then((response) => {
                                            console.log(response)

                                            // response = await response.json();
                                            // // AsyncStorage.setItem("user", JSON.stringify(response.data.user), () => {
                                            //     // navigation.navigate("main");
                                            // // });

                                        })
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }}>
                                    <Text style={{ color: 'white' }}>Сохранить</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}