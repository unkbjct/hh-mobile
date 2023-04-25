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
import VacancyCard from '../../../components/VacancyCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResumeCard from '../../../components/personal/ResumeCard';

export default function ResumesScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [resumes, setResumes] = React.useState(null);

    const getData = () => {
        setIsLoading(true);
        try {
            AsyncStorage.getItem('user', async (errs, tempUser) => {
                tempUser = JSON.parse(tempUser)
                setUser(tempUser);

                let formData = new FormData();
                formData.append("apiToren", tempUser.api_token);
                fetch(`${SiteUrl}api/personal/resumes`, {
                    method: 'post',
                    body: formData,
                }).then(async (response) => {
                    response = await response.json()
                    setResumes(response.data.resumes);
                }).then(() => { setIsLoading(false) })
            })
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(getData, []);


    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
                <View style={{ padding: 10 }}>
                    <View>
                        <Text style={[defStyles.header, { textAlign: 'center' }]}>Мои резюме</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                        <TouchableOpacity style={[defStyles.btn, defStyles.btnPrimary, { marginRight: 10 }]} onPress={() => {
                            console.log(user.api_token)

                            fetch(`${SiteUrl}api/city/define`, { method: 'get' }).then(() => {
                                let formdata = new FormData();
                                formdata.append("apiToken", user.api_token);

                                fetch(`${SiteUrl}api/resume/resume/create`, {
                                    method: 'post',
                                    body: formdata,
                                }).then(response => response.json())
                                    .then(response => {
                                        // console.log(response)
                                        navigation.navigate('Applicant', { resumeId: response.data.resume.id })
                                    }).catch(error => {
                                        console.log('it was some error:' + error)
                                    })
                            })

                            // navigation.navigate('Applicant', {})
                        }}>
                            <Text style={{ color: 'white' }}>Создать новое резюме</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{}}>
                        {resumes.map((resume) => {
                            return (
                                <ResumeCard key={`resume-${resume.id}`} resume={resume} navigation={navigation} token={user.api_token} callback={getData} />
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}