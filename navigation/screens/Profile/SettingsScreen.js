// import * as React from 'react';
// import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
// import { Loading } from '../../../components/Loading';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RadioButton } from 'react-native-paper';


// export default function SettingsScreen({ navigation }) {
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [user, setUser] = React.useState();
//     const [oldPasswd, setOldPasswd] = React.useState(null);
//     const [newPasswd, setNewPasswd] = React.useState(null);
//     const [confirmPasswd, setConfirmPasswd] = React.useState(null);
//     const [selected, setSelected] = React.useState(false);
//     const [show, setShow] = React.useState(false);
//     const [checked, setChecked] = React.useState('first');
//     const getData = () => {
//         setIsLoading(true);
//         AsyncStorage.getItem('user', (errs, user) => {
//             setUser(JSON.parse(user));
//             // console.log(user)
//         }).finally(() => setIsLoading(false));
//     }

//     const changeShow = (value) => {
//         setShow(value)
//         return value;
//     }

//     React.useEffect(getData, []);

//     if (isLoading) {
//         return (
//             <Loading />
//         )
//     }

//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
//                 <View>
//                     {/* <RadioInput label={'Отображать вакансии, скрыть резюме'} selected={true} value={'vacancies'} onSelect={value => changeShow(value)}></RadioInput>
//                     <RadioInput label={'Отображать резюме, скрыть вакансии'} selected={true} value={'resumes'} onSelect={value => changeShow(value)}></RadioInput>
//                     <RadioInput label={'Отображать вакансии, скрыть резюме'} selected={true} value={'vacancies'} onSelect={value => changeShow(value)}></RadioInput>
//                     <RadioInput label={'Отображать резюме, скрыть вакансии'} selected={true} value={'resumes'} onSelect={value => changeShow(value)}></RadioInput> */}
//                     <RadioButton
//                         value="first"
//                         status={checked === 'first' ? 'checked' : 'unchecked'}
//                         onPress={() => setChecked('first')}
//                     />
//                     <Text>asd</Text>
//                     <RadioButton
//                         value="second"
//                         status={checked === 'second' ? 'checked' : 'unchecked'}
//                         onPress={() => setChecked('second')}
//                     />
//                     <Text>settings</Text>
//                 </View>
//             </ScrollView>
//         </SafeAreaView >
//     )
// }