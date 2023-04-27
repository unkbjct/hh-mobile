import { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { defStyles } from "./styles";

export default class ResumeCard extends Component {
    constructor(props) {
        super(props);
        this.resume = props.resume;
        this.navigation = props.navigation;
        this.year = (new Date().getFullYear() - this.resume.birthday_year);
    }

    render() {
        return (
            <View style={styles.Card}>
                <View style={{ marginBottom: 0 }}>
                    <TouchableOpacity onPress={() => this.navigation.navigate('Resume', { resumeId: this.resume.id })}>
                        <Text style={[styles.Header]}>{this.resume.position}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[defStyles.semiHeadeer, { fontWeight: 600, marginRight: 10 }]}>{this.resume.surname}</Text>
                        <Text style={[defStyles.semiHeadeer, { fontWeight: 600 }]}>{this.resume.name}</Text>
                    </View>
                    <Text style={[defStyles.semiHeadeer, { color: 'red', fontWeight: 400 }]}>{this.resume.city}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginRight: 20 }}>Возраст - {this.year} лет</Text>
                    <Text>Опыт работы - {this.resume.hasExperience ? 'Есть' : 'Нет'}</Text>
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
            height: 2,
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