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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelInput from '../../../components/inputs/Labelnput';
import { StyleSheet } from 'react-native';

export default function CreateCompanyScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [legalTitle, setLegalTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [city, setCity] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [logo, setLogo] = React.useState('');
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

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', async (errs, tempUser) => {
            tempUser = JSON.parse(tempUser)
            setUser(tempUser);
            if (!newCompany) {
                setLegalTitle(company.legalTitle);
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
                            <LabelInput label={'Лого компании'} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 10 }]} onPress={() => navigation.navigate("CreateCompany", { 'newCompany': true })}>
                                <Text style={{ color: 'white' }}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 10 }]} onPress={() => navigation.navigate("CreateCompany", { 'newCompany': true })}>
                                <Text style={{ color: 'white' }}>Добавить компанию</Text>
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
    }
})