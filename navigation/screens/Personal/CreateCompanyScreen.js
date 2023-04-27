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
import { colors, defStyles } from '../../../components/styles';
import { SiteUrl } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelInput from '../../../components/inputs/Labelnput';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function CreateCompanyScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [legalTitle, setLegalTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [city, setCity] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [logo, setLogo] = React.useState(false);
    const [logoUri, setLogoUri] = React.useState('');
    const [logoText, setLogoText] = React.useState('');
    const [citiesList, setCitiesList] = React.useState([]);
    const [cityText, setCityText] = React.useState('');
    const [qwe, setQwe] = React.useState([]);
    const [toggle, setToggle] = React.useState(false);

    const { newCompany, company } = route.params;

    const cityFind = (value) => {
        if (value == '') {
            setCitiesList([]);
            setToggle(!toggle);
            return;
        }
        let formData = new FormData();
        formData.append('city', value)
        fetch(`${SiteUrl}api/city/find?${new URLSearchParams({
            city: value,
        })}`, {
            method: 'get',
        }).then(response => response.json()).then(response => {
            setCitiesList(response);
            setToggle(!toggle);
        })
        // console.log(value)
    }

    const createCompany = () => {
        let formData = new FormData();
        formData.append("token", user.api_token);
        formData.append("legal_title", legalTitle);
        formData.append("description", description);
        formData.append("city", city);
        formData.append("address", address);
        if (logo) formData.append("image", { uri: logo, name: 'image.png', type: 'image/png' });

        fetch(`${SiteUrl}api/company/create`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then(async response => {
            if (response.errors) {
                let errors = response.errors
                let alertString = "";
                for (let key in errors) {
                    console.log(key)
                    alertString += `\n${errors[key]}`;
                }
                Alert.alert("Ошибка", alertString);
                return;
            }
            Alert.alert("Компания успешно добавлена", "Дождитесь окончания проверки, чтобы добавть вакансию", [{
                text: "ок",
                onPress: () => navigation.navigate("Companies", { refresh: true })
            }])
        })
    }

    const editCompany = () => {
        let formData = new FormData();
        formData.append("token", user.api_token);
        formData.append("legal_title", legalTitle);
        formData.append("description", description);
        formData.append("city", city);
        formData.append("address", address);
        if (logo) formData.append("image", { uri: logo, name: 'image.png', type: 'image/png' });

        console.log(formData);

        fetch(`${SiteUrl}api/company/${company.id}/edit`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then(async response => {
            if (response.errors) {
                let errors = response.errors
                let alertString = "";
                for (let key in errors) {
                    console.log(key)
                    alertString += `\n${errors[key]}`;
                }
                Alert.alert("Ошибка", alertString);
                return;
            }
            Alert.alert("Компания успешно сохранена", "", [{
                text: "ок",
                onPress: () => navigation.navigate("Companies", { refresh: true })
            }])
            return
        })
    }

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', async (errs, tempUser) => {
            tempUser = JSON.parse(tempUser)
            setUser(tempUser);
            if (!newCompany) {
                setLegalTitle(company.legal_title);
                setDescription(company.description);
                setCity(company.city);
                setCityText(company.city);
                setAddress(company.address);
                setLogoUri(company.image);
            }
            setIsLoading(false);
        })
    }

    React.useEffect(getData, [route]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />} style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView >
                <ScrollView nestedScrollEnabled={true} >
                    <View style={{ padding: 10 }}>
                        <Text style={[defStyles.header, { textAlign: 'center', marginBottom: 20 }]}>{newCompany ? "Добавление новой компании" : "Редактирование компании"} </Text>
                        <View>
                            <LabelInput value={legalTitle} label={'Юридическое название компании'} help={'Обязательно'} onChange={value => { setLegalTitle(value) }} />
                            <LabelInput value={description} label={'Описание'} multiline={true} help={'Обязательно, минимум 100 символов'} onChange={value => { setDescription(value) }} />
                            <View style={{ position: 'relative' }}>
                                <LabelInput value={cityText} onChange={value => cityFind(value)} label={'Город'} help={'Обязательно, выбран из списка'} />
                                <ScrollView style={[styles.citiesList, (!citiesList.length) ? { borderWidth: 0 } : {}]} nestedScrollEnabled={true}>
                                    {citiesList.map((city, i) => {
                                        return (
                                            // <Text>asd</Text>
                                            <TouchableOpacity key={`city-${i}`} style={[styles.cityItem, (i == citiesList.length - 1) ? { borderBottomWidth: 0 } : {}]} onPress={async () => {
                                                setCity(city.id);
                                                setCityText((city.city) ? city.city : city.region)
                                                setToggle(!toggle);
                                                getData();
                                                setCitiesList([]);
                                                setToggle(!toggle);
                                            }}>
                                                <Text>{(city.city) ? city.city : city.region}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                            <LabelInput value={address} label={'Адрес'} onChange={value => { setAddress(value) }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity disabled={logo ? true : false} style={[defStyles.btn, defStyles.btnPrimary]} onPress={async () => {
                                    let result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        // allowsEditing: true,
                                        // aspect: [4, 3],
                                        quality: 1,
                                    });

                                    setLogoUri(result.assets[0].uri)
                                    setLogo(result.assets[0].uri);
                                    setLogoText()
                                }}>
                                    <Text style={{ color: colors.white }}>Лого компании</Text>
                                </TouchableOpacity>
                                <Text>{logoText}</Text>
                                {logo ?
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                                        setLogo(false)
                                        setToggle(!toggle)
                                    }}>
                                        <Text style={{ color: colors.white }}>Удалить изображение</Text>
                                    </TouchableOpacity>
                                    :
                                    <></>
                                }
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                {logoUri ?
                                    <Image style={styles.companyLogo} source={{ uri: (logo) ? `${logoUri}` : `${SiteUrl}/${logoUri}` }} />
                                    :
                                    <></>
                                }
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 10 }]} onPress={() => navigation.navigate("Companies")}>
                                <Text style={{ color: 'white' }}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 10 }]} onPress={() => {
                                (newCompany) ? createCompany() : editCompany();

                            }}>
                                <Text style={{ color: 'white' }}>{newCompany ? "Добавить компанию" : "Сохнарить компанию"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    cityItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        zIndex: 10,
        borderBottomColor: 'silver',
        borderBottomWidth: 1,
    },
    citiesList: {
        position: 'absolute',
        // top: '100%',
        bottom: '100%',
        left: 0,
        right: 0,
        zIndex: 10,
        maxHeight: 200,
        overflow: 'scroll',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 7,
    },
    borderTop: {
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
    },
    borderBottom: {
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
    },
    companyLogo: {
        width: '80%',
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        marginBottom: 20,
    },
})