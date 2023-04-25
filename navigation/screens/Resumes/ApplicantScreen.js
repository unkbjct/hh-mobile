import * as React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, defStyles } from '../../../components/styles';
import LabelInput from '../../../components/inputs/Labelnput';
import { Loading } from '../../../components/Loading';
import { SiteUrl } from '../../../env';
import SwitchSelector from "react-native-switch-selector";
import CheckBox from '@react-native-community/checkbox';


export default function ApplicantScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [resume, setResume] = React.useState(null);
    // const [date, setDate] = React.useState(null);
    const [birthday, setBirthday] = React.useState(null);
    const [moving, setMoving] = React.useState(null);
    const [trips, setTrips] = React.useState(null);
    const [education, setEducation] = React.useState(null);
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

    const { resumeId } = route.params;

    const options = [
        { label: "Мужской", value: "MALE" },
        { label: "Женский", value: "FEMALE" },
    ];

    const getData = () => {
        setIsLoading(true);
        try {
            fetch(`${SiteUrl}api/resume/${resumeId}`, {
                method: 'post'
            }).then(response => response.json()).then(response => {
                setResume(response.data.resume)
            }).then(() => setIsLoading(false))
        } catch (e) {
            Alert.alert("Ошибка", "Проверьте подключение к интернету")
            console.log(e)
        }
    }

    React.useEffect(getData, []);


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
                            <LabelInput label={'Имя'} value={resume.personal.name} />
                            <LabelInput label={'Фамилия'} value={resume.personal.surname} />
                            <LabelInput label={'Отчество'} value={resume.personal.patronymic} help={'Не обязательно'} />
                            <LabelInput label={'Город проживания'} value={resume.city} />
                            <SwitchSelector style={{ borderWidth: 1, borderColor: 'silver', borderRadius: 50, padding: 5, }}
                                options={options}
                                borderColor={'silver'}
                                borderWidth={1}
                                buttonColor={colors.danger}
                                selectedColor={colors.white}
                                initial={0}
                                onPress={value => console.log(`Call onPress with value: ${value}`)}
                            />
                            <CheckBox></CheckBox>
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
    semiHeader: {
        fontSize: 18,
        color: 'rgb(120, 120, 120)',
        marginBottom: 10,
    },
    section: {
        marginBottom: 30,
    }
})