import * as React from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defStyles } from "../../../components/styles";
import DefaultInput from "../../../components/inputs/DefaultInput";
import { SiteUrl } from "../../../env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import VacancyCard from "../../../components/VacancyCard";

export default function FavoritesScreen({ navigation, route }) {


    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [favorites, setFavorites] = React.useState([]);
    const [vacancies, setVacancies] = React.useState([]);

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', async (errs, user) => {
            await AsyncStorage.getItem('favorites', (errs, favorites) => {
                setFavorites(JSON.parse(favorites));
                if (!JSON.parse(favorites) || !JSON.parse(favorites).length) {
                    setVacancies([]);
                    return;
                };

                let formData = new FormData();
                JSON.parse(favorites).map(e => formData.append("indexes[]", e));
                fetch(`${SiteUrl}api/vacancies/range`, {
                    method: 'post',
                    body: formData
                }).then(response => response.json()).then(response => {
                    setVacancies(response.data.vacancies)
                })
            })
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(getData, [route]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 20, flex: 1 }}>
                        {vacancies.length ?
                            <View>
                                {vacancies.map((vacancy) => {
                                    // console.log(search);
                                    return (
                                        <VacancyCard key={`vacancy-${vacancy.id}`} vacancy={vacancy} navigation={navigation} callback={() => { getData }} favorites={favorites} />
                                    )
                                })}
                            </View>
                            :
                            <View style={{ marginTop: '60%' }}>
                                <Text style={{ fontSize: 24, color: 'gray', textAlign: 'center' }}>У вас нет избранных вакансий</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: 'silver'
    },
    listText: {
        fontSize: 22,
        color: 'rgb(60, 60, 60)'
    }
})