import { Component } from "react";
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { defStyles } from "./styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SiteUrl } from "../env";
import { Alert } from "react-native";

export default class VacancyCard extends Component {
    constructor(props) {
        super(props)
        this.vacancy = props.vacancy;
        navigation = props.navigation;
        this.navigation = props.navigation;
        this.callback = props.callback;
    }

    response() {
        fetch(`${SiteUrl}api/vacancy/${this.vacancy.id}/response`, {
            method: 'post'
        }).then(response => response.json()).then(response => {
            if (response.status == 'timestamp') {
                Alert.alert(`Ошибка`, `По правилам, пользователь может откилкнуться на одну и туже вакансию только один раз в день`)
            } else {
                Alert.alert(`Отклик: ${this.vacancy.position}`, `Если работодателю понравиться ваше резюме, он скоро свяжется с вами`)
                this.callback();
            }
        })
    }

    render() {
        return (
            <View style={styles.Card}>
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.navigation.navigate('Vacancy', { companyId: this.vacancy.company.id, vacancyId: this.vacancy.id })
                        }}
                    >
                        <Text style={[styles.Header]}>{this.vacancy.position}</Text>
                    </TouchableOpacity>
                    <Text style={[defStyles.semiHeadeer, { fontWeight: 600 }]}>До {currencyFormat(this.vacancy.salary)} на руки</Text>
                    <Text style={defStyles.semiHeadeer}>{this.vacancy.company.legal_title}</Text>
                    <Text style={[defStyles.semiHeadeer, { color: 'red', fontWeight: 600 }]}>{this.vacancy.city}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => this.response()}>
                        <Text style={{ color: 'white' }}>Откликнуться</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }}>
                        <Ionicons name={'heart-outline'} size={35} color={'#dc3545'}></Ionicons>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    Card: {
        backgroundColor: 'white',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: .2,
        width: '100%',
        marginBottom: 20,
        padding: 10,
        borderRadius: 7,
    },
    Header: {
        fontSize: 30,
        fontWeight: 600,
        marginBottom: 10,
        color: '#0d6efd'
    }
})

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + " ₽."
}