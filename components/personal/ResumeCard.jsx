import { Component } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { defStyles } from "../styles";
import { SiteUrl } from "../../env";

export default class ResumeCard extends Component {
    constructor(props) {
        super(props);
        this.resume = props.resume;
        this.navigation = props.navigation;
        this.token = props.token;
        this.callback = props.callback
        this.year = (new Date().getFullYear() - this.resume.birthday_year);
        this.created = new Date(props.resume.created_at);
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

        let formData = new FormData()
        formData.append('token', this.token);
        formData.append('resumeId', this.resume.id);

        fetch(`${SiteUrl}api/resume/remove`, {
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
        switch (this.resume.status) {
            case "PUBLISHED":
                return (
                    <View style={[styles.Card, styles.Published]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600 }}>Резюме опубликовано</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity onPress={() => this.navigation.navigate('Resume', { resumeId: this.resume.id })}>
                                    <Text style={[styles.Header]}>{this.resume.job.title}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}
                                        onPress={() => this.navigation.navigate('Resume', { resumeId: this.resume.id })}>
                                        <Text style={{ color: 'white' }}>Посмотреть</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите скрыть резюме?", [
                                            {
                                                text: 'Да, скрыть резюме',
                                                onPress: () => {
                                                    this.changeVisibility('hide');
                                                    this.callback();
                                                }
                                            },
                                            {
                                                text: 'Нет, оставить резюме публичным',
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
                        <View style={styles.CardFooter}>
                            <Text style={{ textAlign: 'right' }}>Создано: {this.created.toLocaleDateString("RU-ru")}</Text>
                        </View>
                    </View >
                )
            case "CANCELED":
                return (
                    <View style={[styles.Card, styles.Canceled]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ color: '#dc3545', fontWeight: 600 }}>Резюме не прошло проверку</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity onPress={() => {
                                    this.navigation.navigate('Applicant', { resumeId: this.resume.id })
                                }}>
                                    <Text style={[styles.Header]}>{this.resume.job.title}</Text>
                                </TouchableOpacity>
                                <View style={{ marginBottom: 10 }}>
                                    <Text><Text style={{ fontWeight: 600 }}>Причина отмены: </Text>{this.resume.cancel_text}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                                        this.navigation.navigate('Applicant', { resumeId: this.resume.id })
                                    }}>
                                        <Text style={{ color: 'white' }}>Изменить резюме</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={() => this.remove()}>
                                        <Text style={{ color: 'white' }}>Удалить резюме</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        <View style={styles.CardFooter}>
                            <Text style={{ textAlign: 'right' }}>Создано: {this.created.toLocaleDateString("RU-ru")}</Text>
                        </View>
                    </View>
                )
            case "CREATED":
                return (
                    <View style={[styles.Card, { borderColor: 'silver' }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{}}>Резюме не опубликовано</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity onPress={() => { this.navigation.navigate('Applicant', { resumeId: this.resume.id }) }}>
                                    <Text style={[styles.Header, { color: 'rgb(120, 120, 120)' }]}>{(this.resume.job && this.resume.job.title) ? this.resume.job.title : "Должность не указана"}</Text>
                                </TouchableOpacity>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 600 }}>Резюме не опубликовано, поскольку вы еще не отправили его на проверку</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => { this.navigation.navigate('Applicant', { resumeId: this.resume.id }) }}>
                                        <Text style={{ color: 'white' }}>Дополнить резюме</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger, { marginRight: 10 }]} onPress={() => this.remove()}>
                                        <Text style={{ color: 'white' }}>Удалить резюме</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        <View style={styles.CardFooter}>
                            <Text style={{ textAlign: 'right' }}>Создано: {this.created.toLocaleDateString("RU-ru")}</Text>
                        </View>
                    </View>
                )
            case "EXPECTING":
                return (
                    <View style={[styles.Card, { borderColor: 'rgb(255,193,7)', borderWidth: 1, }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ color: '#dc3545' }}>Резюме на проверке</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity>
                                    <Text style={[styles.Header, { color: 'rgb(120, 120, 120)' }]}>{(this.resume.job && this.resume.job.title) ? this.resume.job.title : "Должность не указана"}</Text>
                                </TouchableOpacity>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 300, color: '#dc3545' }}>Резюме проходит проверку, дождитесь ее окончания</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.CardFooter}>
                            <Text style={{ textAlign: 'right' }}>Создано: {this.created.toLocaleDateString("RU-ru")}</Text>
                        </View>
                    </View>
                )
            case "HIDDEN":
                return (
                    <View style={[styles.Card, styles.Published, { borderColor: 'gray' }]}>
                        <View style={styles.CardHeader}>
                            <Text style={{ fontWeight: 600, color: 'gray' }}>Резюме скрыто</Text>
                        </View>
                        <View style={styles.CardBody}>
                            <View style={{ marginBottom: 0 }}>
                                <TouchableOpacity onPress={() => this.navigation.navigate('Resume', { resumeId: this.resume.id })}>
                                    <Text style={[styles.Header]}>{this.resume.job.title}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]}
                                        onPress={() => this.navigation.navigate('Resume', { resumeId: this.resume.id })}>
                                        <Text style={{ color: 'white' }}>Посмотреть</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[defStyles.btn, defStyles.btnDanger]} onPress={() => {
                                        Alert.alert("Подтвердите действие", "Вы действительно хотите сделать резюме публичным?", [
                                            {
                                                text: 'Да, сделать публичным',
                                                onPress: () => {
                                                    this.changeVisibility('show');
                                                    this.callback();
                                                }
                                            },
                                            {
                                                text: 'Нет, оставить резюме скрытым',
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
                        <View style={styles.CardFooter}>
                            <Text style={{ textAlign: 'right' }}>Создано: {this.created.toLocaleDateString("RU-ru")}</Text>
                        </View>
                    </View >
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