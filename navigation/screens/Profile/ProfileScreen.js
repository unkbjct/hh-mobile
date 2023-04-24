import * as React from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defStyles } from "../../../components/styles";

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
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 40, borderBottomColor: '#0d6efd', borderBottomWidth: 1 }}>
                        <Text style={[defStyles.header, { marginRight: 20 }]}>{user.surname}</Text>
                        <Text style={defStyles.header}>{user.name}</Text>
                    </View>
                    <View style={{backgroundColor: 'rgba(200, 200, 200, .15)'}}>
                        <View style={{ padding: 10, marginBottom: 10, paddingTop: 20, }}>
                            <Text style={defStyles.semiHeadeer}>Всего отлкиков на вакинсии: {0}</Text>
                            <Text style={defStyles.semiHeadeer}>Вакансий в избранном: {0}</Text>
                        </View>
                    </View>
                    <View style={{ borderTopWidth: 1, borderColor: '#0d6efd' }}>
                        <TouchableOpacity style={styles.listItem}>
                            <Text style={styles.listText}>Мои отклики</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem}>
                            <Text style={styles.listText}>Избранное</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={()=>navigation.navigate('ChangeData')}>
                            <Text style={styles.listText}>Редактировать данные</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={()=>navigation.navigate('ChangePassword')}>
                            <Text style={styles.listText}>Изменить пароль</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.listItem} onPress={()=>navigation.navigate('Settings')}>
                            <Text style={styles.listText}>Настройки</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.listItem}>
                            <Text style={styles.listText}>Как работают отклики?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => {
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
                            <Text style={styles.listText}>Выход</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#0d6efd40',
    },
    listText: {
        fontSize: 22,
        color: 'rgb(60, 60, 60)'
    }
})