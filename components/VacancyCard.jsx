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

export default class VacancyCard extends Component {
    constructor(props) {
        super(props)
        this.vacancy = props.vacancy;
        navigation = props.navigation;
        this.navigation = props.navigation;
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
                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]}>
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