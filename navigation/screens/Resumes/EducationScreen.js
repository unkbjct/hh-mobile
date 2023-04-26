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

export default function EducationScreen({ navigation, route }) {
    const { education, resumeId, token, newEdu } = route.params;

    const [isLoading, setIsLoading] = React.useState(true);

    const edit = async (value, name) => {
        let formData = new FormData();
        formData.append("resumeId", education.resume);
        formData.append("token", token);
        formData.append('educationItemId', education.id);
        formData.append(name, value);
        await fetch(`${SiteUrl}api/resume/edit/education/item/edit`, {
            method: 'post',
            body: formData
        }).then(response => response.text()).then((response) => console.log(response))
    }

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
                        <Text style={[defStyles.semiHeadeer, { textAlign: 'center', marginBottom: 20 }]}>{newEdu ? "Новое место учебы" : "Редактирование места учебы"} </Text>
                        <View>
                            <LabelInput label={'Учебное заведение'} value={newEdu ? null : education.college} onChange={value => edit(value, 'college')} />
                            <LabelInput label={'Факультет'} value={newEdu ? null : education.faculty} onChange={value => edit(value, 'faculty')} />
                            <LabelInput label={'Специализация'} value={newEdu ? null : education.specialitty} onChange={value => edit(value, 'specialitty')} />
                            <LabelInput label={'Год окончания'} help={'Если учитесь в настоящее время укажите год предполагаемого окончания'} value={newEdu ? null : education.year_end} onChange={value => edit(value, 'year_end')} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text>Сохранение происходит автоматически</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}