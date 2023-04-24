import * as React from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defStyles } from "../../../components/styles";
import DefaultInput from "../../../components/inputs/DefaultInput";
import { SiteUrl } from "../../../env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ChangeDataScreen({ navigation }) {


    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [surname, setSurname] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [phone, setPhone] = React.useState(null);

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            setUser(JSON.parse(user));
            setSurname(JSON.parse(user).surname);
            setName(JSON.parse(user).name);
            setEmail(JSON.parse(user).email);
            setPhone(JSON.parse(user).phone);
            // console.log(user)
        }).finally(() => setIsLoading(false));
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
                    <View style={{ padding: 20, }}>
                        <View style={{ marginBottom: 20 }}>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Электронная почта:</Text>
                                <DefaultInput style={styles.input} data={{ label: "Почта", value: user.email }} onChange={(text) => setEmail(text)} />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Телефон:</Text>
                                <DefaultInput style={styles.input} data={{ label: "Телефон", value: user.phone }} onChange={(text) => setPhone(text)} />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Имя:</Text>
                                <DefaultInput style={styles.input} data={{ label: "Имя", value: user.name }} onChange={(text) => setName(text)} />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Фамилия:</Text>
                                <DefaultInput style={styles.input} data={{ label: "Фамилия", value: user.surname }} onChange={(text) => setSurname(text)} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary]} onPress={() => navigation.navigate('Profile')}>
                                <Text style={{ color: 'white' }}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[defStyles.btn, defStyles.btnDanger]}
                                onPress={() => {
                                    if (name == user.name
                                        && surname == user.surname
                                        && email == user.email) return;

                                    if (!name || !surname || !email) Alert.alert("Не все поля заполнены!", "Для изменения данных нужно заполнить все поля.")

                                    let formdata = new FormData();
                                    formdata.append("name", name);
                                    formdata.append("surname", surname);
                                    formdata.append("email", email);
                                    formdata.append("phone", phone);
                                    formdata.append("id", user.id);

                                    fetch(SiteUrl + 'api/personal/edit', {
                                        method: 'post',
                                        body: formdata,
                                    }).then(async function (response) {
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
                                        }


                                        response = await response.json();

                                        AsyncStorage.setItem('user', JSON.stringify(response.data.user), () => {
                                            getData();
                                            Alert.alert("Успех", "Данные успешно обнавлены")
                                        })

                                    })
                                }}
                            >
                                <Text style={{ color: 'white' }}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
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