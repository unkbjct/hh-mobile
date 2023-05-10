import * as React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Loading } from '../../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { colors, defStyles } from '../../../components/styles';
import Selector from '../../../components/inputs/Selector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';


export default function HowResponsesScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [tabs, setTabs] = React.useState(undefined);

    const findInit = (list, need, key = 'value') => {
        return list.findIndex((element) => element[key] == need);
    }

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('tabs', (errs, tabs) => {
            setTabs(JSON.parse(tabs))
            console.log(tabs)
        }).then(() => setIsLoading(false))
    }

    const tabItems = [
        { label: 'Все', value: 'undefined', key: 'undefined' },
        { label: 'Резюме', value: 'resume', key: 'resume' },
        { label: 'Вакансии', value: 'vacancy', key: 'vacancy' },
    ]

    async function setTab(value) {
        setIsLoading(true)
        await AsyncStorage.setItem('tabs', JSON.stringify(value), () => {
            Alert.alert("изменения вступят в силу после перезапуска приложения");
            setTabs(value)
        })
        setIsLoading(false)
    }

    React.useEffect(getData, []);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 20 }}>
                        <Ionicons name={"help-circle-outline"} size={70} color={'#dc3545'}></Ionicons>
                    </View>
                    <Text style={[defStyles.semiHeadeer, { textAlign: 'left', marginBottom: 20, paddingHorizontal: 20 }]}>Как работают отклики? все очень просто!</Text>
                    <Text style={styles.text}>Полсе того как вы зарегистрировались на сайте и авторизовались, вы можете оставить отклик на понравившуюся вам вакансию, даже если у вас еще нет резюме. После отклика на вакансию, вы получаете сообщение об успешном выполение действия:</Text>
                    <View style={{ backgroundColor: '#f8d7da', borderColor: colors.danger, borderLeftWidth: 4, borderRadius: 8, paddingVertical: 15, marginHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 700, paddingHorizontal: 20, marginBottom: 20 }}>! важно</Text>
                        <Text style={styles.text}>На одну вакансию можно откликнуться только один раз в день! Поэтому убедитесь что у вас есть опубликованное разюме и оно обладает всей необходимой информацией для работодателя, иначе работодатель пропустит вас.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        paddingHorizontal: 20,
        color: 'rgb(45, 45, 45)',
        marginBottom: 30
    }
})