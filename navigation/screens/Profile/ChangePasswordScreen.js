import * as React from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defStyles } from "../../../components/styles";
import DefaultInput from "../../../components/inputs/DefaultInput";
import { SiteUrl } from "../../../env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ChangePasswordScreen({ navigation }) {


    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [oldPasswd, setOldPasswd] = React.useState(null);
    const [newPasswd, setNewPasswd] = React.useState(null);
    const [confirmPasswd, setConfirmPasswd] = React.useState(null);

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            setUser(JSON.parse(user));
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
                                <Text style={defStyles.semiHeadeer}>Старый пароль:</Text>
                                <DefaultInput style={styles.input} data={{ label: null, secure: true }} onChange={(text) => setOldPasswd(text)} />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Новый пароль:</Text>
                                <DefaultInput style={styles.input} data={{ label: null, secure: true }} onChange={(text) => setNewPasswd(text)} />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={defStyles.semiHeadeer}>Подтверждение пароля:</Text>
                                <DefaultInput style={styles.input} data={{ label: null, secure: true }} onChange={(text) => setConfirmPasswd(text)} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary]} onPress={() => navigation.navigate('Profile')}>
                                <Text style={{ color: 'white' }}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[defStyles.btn, defStyles.btnDanger]}
                                onPress={() => {
                                    if (!oldPasswd || !newPasswd || !confirmPasswd) {
                                        Alert.alert("Ошибка", "Не все поля заполнены!");
                                        return
                                    };

                                    if (newPasswd != confirmPasswd) {
                                        Alert.alert("Ошибка", "Пароли не совпадают");
                                        return;
                                    }

                                    let formdata = new FormData();
                                    formdata.append("oldPasswd", oldPasswd);
                                    formdata.append("newPasswd", newPasswd);
                                    formdata.append("confrimPasswd", confirmPasswd);
                                    formdata.append("id", user.id);

                                    fetch(SiteUrl + 'api/password/edit', {
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