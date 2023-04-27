import { Component } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, defStyles } from "../styles";
import { SiteUrl } from "../../env";

export default class CompanyCard extends Component {
    constructor(props) {
        super(props);
        this.company = props.company;
        this.navigation = props.navigation;
        this.token = props.token;
        this.callback = props.callback
    }

    changeVisibility(status) {
        let fomrData = new FormData();
        fomrData.append('resumeId', this.resume.id)
        fomrData.append('visibility', status)
        fetch(`${SiteUrl}api/resume/edit/visibility`, {
            method: 'post',
            body: fomrData,
        }).then(response => response.json()).then(response => {
            console.log(response)
        })
    }

    remove() {

        fetch(`${SiteUrl}api/company/${this.company.id}}/remove`, {
            method: 'post',
        }).then(response => response.json()).then((response) => {
            console.log(response.status)
        }).catch(e => {
            console.log(`seme error: ${e}`)
        })
        this.callback();
    }

    render() {
        switch (this.company.status) {
            case "CONFIRMED":
                return (
                    <View style={[styles.Card, styles.Published]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600 }}>Компания опубликовано</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity onPress={() => {
                                    this.navigation.navigate("Company", { company: this.company })
                                }}>
                                    <Text style={[styles.Header]}>{this.company.legal_title}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 0 }]} onPress={() => this.navigation.navigate("CreateCompany", { 'newCompany': false, company: this.company })}>
                                        <Text style={{ color: 'white' }}>Редактировать</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 0 }]} onPress={() => {
                                        this.navigation.navigate("Company", { company: this.company })
                                    }}>
                                        <Text style={{ color: 'white' }}>Вакансий: {this.company.count}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            case "CANCELED":
                return (
                    <View style={[styles.Card, styles.Canceled]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ color: '#dc3545', fontWeight: 600 }}>Компания не прошла проверку</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 10 }}>
                                <Text><Text style={{ fontWeight: 600 }}>Причина отмены: </Text>{this.company.cancel_text}</Text>
                            </View>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity >
                                    <Text style={[styles.Header]}>{this.company.legal_title}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10, marginBottom: 0 }]} onPress={() => this.navigation.navigate("CreateCompany", { 'newCompany': false, company: this.company })}>
                                        <Text style={{ color: 'white' }}>Редактировать</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10, marginBottom: 0 }]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите удалить компанию?", [
                                            {
                                                text: "Да, удалить",
                                                onPress: () => {
                                                    this.remove();
                                                }
                                            },
                                            {
                                                text: "Нет, отмена"
                                            }
                                        ])
                                    }}>
                                        <Text style={{ color: 'white' }}>Удалить компанию</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            case "CREATED":
                return (
                    <View style={[styles.Card, { borderColor: colors.warning, }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ color: '#dc3545' }}>Компания находится на проверки, дождитесь ее окончания</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity >
                                    <Text style={[styles.Header]}>{this.company.legal_title}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                )
        }
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
        borderWidth: 2,
        width: '100%',
        marginBottom: 20,
        borderRadius: 7,
    },
    CardBody: {
        padding: 10,
    },
    CardHeader: {
        backgroundColor: 'rgb(240, 240, 240)',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        padding: 10,
    },
    CardFooter: {
        backgroundColor: 'rgb(240, 240, 240)',
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        padding: 10,
    },
    Published: {
        borderColor: '#0d6efd',
    },
    Canceled: {
        borderColor: '#dc3545',
    },
    Header: {
        fontSize: 30,
        fontWeight: 600,
        marginBottom: 10,
        color: '#0d6efd'
    }
})