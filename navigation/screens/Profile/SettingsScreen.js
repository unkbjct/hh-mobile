import * as React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Loading } from '../../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { defStyles } from '../../../components/styles';
import Selector from '../../../components/inputs/Selector';


export default function SettingsScreen({ navigation }) {
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
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View>
                    <Text style={[defStyles.semiHeadeer, { textAlign: 'left', marginTop: 50, marginBottom: 40, paddingHorizontal: 20 }]}>Если вы не собираетесь размещать вакансии Вы можете изменить нижнию панель навигации, и наоборот</Text>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20, borderColor: 'silver', borderTopWidth: 1, borderBottomWidth: 1, }}>
                        <Selector initial={findInit(tabItems, tabs)} onChange={value => setTab(value)} label={'Выберите что именно отображать'} options={tabItems} />
                    </View>
                    <Text style={[defStyles.semiHeadeer, { textAlign: 'left', marginTop: 50, marginBottom: 40, paddingHorizontal: 20 }]}>Сообщения/подсказки пропадут после первого изменения</Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}