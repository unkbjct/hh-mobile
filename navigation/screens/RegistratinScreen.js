import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    Alert,
    View,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SiteUrl } from '../../env';
import DefaultInput from '../../components/inputs/DefaultInput';
import { defStyles } from '../../components/styles';



export default function LoginScreen({ navigation }) {

    let data = {
        email: '',
        phone: '',
        name: '',
        surname: '',
        passwd: '',
        confirmPasswd: '',
    }


    return (
        <KeyboardAwareScrollView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* <StatusBar  hidden = {true} backgroundColor="#00BCD4" /> */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>WantWork</Text>
                    </View>
                    <Text style={{ marginTop: 10, marginBottom: 30 }}>Найти работу - просто</Text>
                    <Text style={styles.title}>Создание аккаунта</Text>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Электронная почта" }} onChange={(text) => data.email = text} />
                    </View>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Телефон" }} onChange={(text) => data.phone = text} />
                    </View>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Имя" }} onChange={(text) => data.name = text} />
                    </View>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Фамилия" }} onChange={(text) => data.surname = text} />
                    </View>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Пароль", secure: true }} onChange={(text) => data.passwd = text} />
                    </View>
                    <View style={styles.inputItem}>
                        <DefaultInput style={styles.input} data={{ label: "Подтверждение пароля", secure: true }} onChange={(text) => data.confirmPasswd = text} />
                    </View>
                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                        let errs = [];
                        if (!data.email) errs.push('Почта обязательное поле');
                        if (!data.name) errs.push('Почта обязательное поле');
                        if (!data.surname) errs.push('Почта обязательное поле');
                        if (!data.passwd) errs.push('Пароль обязательное поле');
                        if (!data.confirmPasswd) errs.push('Пароль обязательное поле');

                        if (errs.length) {
                            Alert.alert('Не все поля заполнены!');
                            return;
                        }

                        var formdata = new FormData();
                        formdata.append("email", data.email);
                        formdata.append("phone", data.phone);
                        formdata.append("name", data.name);
                        formdata.append("surname", data.surname);
                        formdata.append("passwd", data.passwd);
                        formdata.append("confirmPasswd", data.confirmPasswd);


                        fetch(SiteUrl + 'api/signup', {
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

                            AsyncStorage.setItem("user", JSON.stringify(response.data.user), () => {
                                navigation.navigate("main");
                            });

                        })
                        // .then(response => {
                        //     response = JSON.parse(response)

                        //     // if (response.status == 'error') {
                        //     //     Alert.alert("Пользователь не найден!")
                        //     // } else {
                        //     //     console.log()
                        //     //     AsyncStorage.setItem('user', JSON.stringify(response.data.user), () => {
                        //     //         navigation.navigate('main')
                        //     //     });
                        //     // }
                        // })
                    }}>
                        <Text style={{ color: 'white' }}>Создать аккаунт</Text>
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 20, }}>Все поля обязательные</Text>
                    <Text style={styles.small}>Уже есть аккаунт? войдите в него <Text style={styles.link} onPress={() => { navigation.navigate('login') }}>здесь</Text></Text>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'white',
    },
    inner: {
        padding: 24,
        // flex: 1,
        paddingTop: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    logo: {
        backgroundColor: '#dc3545',
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
    },
    logoText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 700,
    },
    inputItem: {
        borderColor: 'red',
        width: '80%'
    },
    title: {
        fontSize: 25,
        marginBottom: 30,
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    small: {
    },
    link: {
        color: '#0d6efd',
    }
})