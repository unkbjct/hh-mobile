import { Component } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, defStyles } from "../styles";
import { SiteUrl } from "../../env";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PersonalVacancyCard extends Component {
    constructor(props) {
        super(props);
        this.token = props.token;
        this.vacancy = props.vacancy;
        this.navigation = props.navigation;
        this.callback = props.callback;
        this.company = props.company;
    }

    changeVisibility(status) {
        let fomrData = new FormData();
        // fomrData.append('resumeId', this.resume.id)
        fomrData.append('token', this.token)
        fomrData.append('vacancyId', this.vacancy.id)
        fomrData.append('visibility', status)
        fetch(`${SiteUrl}api/company/${this.company.id}/vacancy/visibility`, {
            method: 'post',
            body: fomrData,
        }).then(response => response.text()).then(response => {
            console.log(response)
        })
    }

    remove() {

        let formData = new FormData()
        formData.append('token', this.token);
        formData.append('vacancyId', this.vacancy.id);

        fetch(`${SiteUrl}api/company/${this.company.id}/vacancy/remove`, {
            method: 'post',
            body: formData
        }).then(response => response.json()).then((response) => {
            console.log(response.status)
        }).catch(e => {
            console.log(`seme error: ${e}`)
        })
        this.callback();
    }

    render() {
        switch (this.vacancy.status) {
            case "PUBLISHED":
                return (
                    <View style={[styles.Card, styles.Published]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600 }}>Вакансия опубликовано</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                                    <TouchableOpacity onPress={() => {
                                        this.navigation.navigate('Vacancy', { companyId: this.vacancy.company.id, vacancyId: this.vacancy.id })
                                    }}>
                                        <Text style={[styles.Header]}>{this.vacancy.position}</Text>
                                    </TouchableOpacity>
                                    <Text style={[defStyles.semiHeadeer,]}>{currencyFormat(this.vacancy.salary)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                        this.navigation.navigate("VacancyResponses", { company: this.company, vacancy: this.vacancy })
                                    }}>
                                        <Text style={{ color: 'white' }}>Откликов: {(this.vacancy.responses) ? this.vacancy.responses : 0}{this.vacancy.count}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите скрыть резюме?", [
                                            {
                                                text: 'Да, скрыть вакансию',
                                                onPress: () => {
                                                    this.changeVisibility('hide');
                                                    this.callback();
                                                }
                                            },
                                            {
                                                text: 'Нет, оставить вакансию публичным',
                                                onPress: () => {

                                                }
                                            },

                                        ])
                                    }}>
                                        <Text style={{ color: 'white' }}>Изменить видимость</Text>
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
                            <Text style={{ fontWeight: 600, color: colors.danger }}>Вакансия не прошла проверку</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                                    <TouchableOpacity>
                                        <Text style={[styles.Header]}>{this.vacancy.position}</Text>
                                    </TouchableOpacity>
                                    <Text style={[defStyles.semiHeadeer,]}>{currencyFormat(this.vacancy.salary)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}>
                                        <Text style={{ color: 'white' }}>Редактировать вакансию</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите удалить вакансию?", [
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
                                        <Text style={{ color: 'white' }}>Удалить вакансию</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )

            case "CREATED":
                return (
                    <View style={[styles.Card, { borderColor: 'rgb(255,193,7)', borderWidth: 1, }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600, color: colors.danger }}>Вакансия проходит проверку</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                                    <TouchableOpacity>
                                        <Text style={[styles.Header]}>{this.vacancy.position}</Text>
                                    </TouchableOpacity>
                                    <Text style={[defStyles.semiHeadeer,]}>{currencyFormat(this.vacancy.salary)}</Text>
                                </View>
                                <Text>Вакансия проходит проверку, дождитесь ее окончания</Text>
                            </View>
                        </View>
                    </View>
                )
            case "HIDDEN":
                return (
                    <View style={[styles.Card, styles.Published, { borderColor: 'gray' }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600, color: 'gray' }}>Вакансия скрыта для всех</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                                    <TouchableOpacity onPress={() => {
                                        this.navigation.navigate('Vacancy', { companyId: this.vacancy.company.id, vacancyId: this.vacancy.id })
                                    }}>
                                        <Text style={[styles.Header]}>{this.vacancy.position}</Text>
                                    </TouchableOpacity>
                                    <Text style={[defStyles.semiHeadeer,]}>{currencyFormat(this.vacancy.salary)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                        this.navigation.navigate("VacancyResponses", { company: this.company, vacancy: this.vacancy })
                                    }}>
                                        <Text style={{ color: 'white' }}>Откликов: {(this.vacancy.responses) ? this.vacancy.responses : 0}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}
                                        onPress={() => { this.navigation.navigate("CreateVacancy", { newVacancy: false, vacancy: this.vacancy, company: this.company }) }}
                                    >
                                        <Text style={{ color: 'white' }}>Редактировать</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите сделать вакансию публичной?", [
                                            {
                                                text: 'Да, сделать публичной',
                                                onPress: () => {
                                                    this.changeVisibility('show');
                                                    this.callback();
                                                }
                                            },
                                            {
                                                text: 'Нет, оставить вакансию скрытой',
                                                onPress: () => {

                                                }
                                            },

                                        ])
                                    }}>
                                        <Text style={{ color: 'white' }}>Изменить видимость</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]}
                                        onPress={() => {
                                            Alert.alert("Подтвердите действие", "Вы действительно хотите удалить вакансию?", [
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
                                        <Text style={{ color: 'white' }}>Удалить</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
        }
    }
}

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + " ₽."
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