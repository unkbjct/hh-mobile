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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelInput from '../../../components/inputs/Labelnput';
import Check from '../../../components/inputs/Check';
import { StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';


export default function VacancyFilterScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    



    const getData = () => {
        setIsLoading(true);

        let formdata = new FormData();
        formdata.append("position", "**");
        fetch(`${SiteUrl}api/search/vacancies`, {
            method: 'post',
            body: formdata,
        }).then(response => response.json()).then(async response => {
            let tempSchedules = response.data.schedules;
            setEmployments(response.data.employments.map(e => { e.isChecked = false; return e }));
            setSchedules(response.data.schedules.map(e => { e.isChecked = false; return e }));



            // setIsLoading(false);

        })

        // const unsubscribe = navigation.addListener('blur', (e) => {
        //     Alert.alert('123')
        // });
        setIsLoading(false);
        // return unsubscribe;
    }

    React.useEffect(getData, [navigation]);

    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />} style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView >
                <ScrollView nestedScrollEnabled={true} >
                    
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
    text: {
        fontSize: 20,
        color: 'rgb(40, 40, 40)',
        marginBottom: 8,
    },
    Container: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    Checkbox: {
        marginRight: 15,
        borderRadius: 10,
    },
})