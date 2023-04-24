import { StyleSheet } from "react-native";

// export default function defStyles() {
//     return StyleSheet.create({
//         btn: {
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderRadius: 5,
//             marginBottom: 10,
//         },
//     })
// }

export const defStyles = StyleSheet.create({
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    btnPrimary: {
        backgroundColor: '#0d6efd',
    },
    btnDanger: {
        backgroundColor: '#dc3545',
    },
    header: {
        fontSize: 30,
        fontWeight: 600,
        marginBottom: 20,
    },
    semiHeadeer: {
        fontSize: 20,
        fontWeight: 400,
        marginBottom: 10,
        color: 'rgb(90, 90, 90)'
    }
    // isInvalid: {
    //     borderColor: '#dc3545',
    // },
    // valid: {

    // }
})