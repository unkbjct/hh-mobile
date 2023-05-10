import * as React from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, defStyles } from "../../../components/styles";

export default function ProfileScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();

    const getUser = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            setUser(JSON.parse(user));
            // console.log(user)
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(getUser, []);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getUser} />}>
                <View>
                    <View style={[styles.headerView, { paddingHorizontal: 10, paddingTop: 20 }]}>
                        <Text style={[defStyles.header, { textAlign: "center", color: 'rgb(70, 70, 70)' }]}>{user.surname} {user.name}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Responses")}>
                            <Text style={styles.listText}>Мои отклики</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Favorites")}>
                            <Text style={styles.listText}>Избранное</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ChangeData')}>
                            <Text style={styles.listText}>Редактировать данные</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ChangePassword')}>
                            <Text style={styles.listText}>Изменить пароль</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Settings')}>
                            <Text style={styles.listText}>Настройки</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("HowResponses")}>
                            <Text style={styles.listText}>Как работают отклики?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#dc354573' }]} onPress={() => {
                            Alert.alert(
                                "Вы уверены что хотите выйти?", null,
                                [
                                    {
                                        text: "Выйти",
                                        onPress: () => {
                                            AsyncStorage.removeItem('user');
                                            navigation.navigate('auth');
                                        },
                                    }, {
                                        text: "Отмена",
                                    },
                                ]
                            );
                        }}>
                            <Text style={[styles.listText, { color: 'white' }]}>Выход</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    headerView: {
        backgroundColor: 'white',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: .2,
    },
    listItem: {
        padding: 15,
        borderColor: 'rgb(220, 220, 220)',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: 'white',
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: .2,
    },
    listText: {
        fontSize: 22,
        color: 'rgb(60, 60, 60)',
        // textAlign: 'center'
    }
})