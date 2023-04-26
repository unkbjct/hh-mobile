import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { colors } from '../styles';

export default class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.label = props.label;
        this.value = props.value;
        this.help = props.help;
        this.setValue = props.onChange;
        this.initial = props.initial;
        this.options = props.options;

    }


    render() {
        return (
            <View style={[styles.Container]}>
                <Text style={styles.LabelText}>{this.label}</Text>
                <SwitchSelector style={{ borderWidth: 1, borderColor: 'silver', borderRadius: 50, padding: 5, }}
                    // options={options}
                    buttonColor={colors.danger}
                    selectedColor={colors.white}
                    initial={this.initial}
                    options={this.options}
                    onPress={value => this.setValue(value)}
                />
                {(this.help) ? <Text style={{ color: 'rgb(150, 150, 150)' }}>{this.help}</Text> : <></>}
            </View>
        )
    }
}


// Animated.timing(this.state.xPosition, {
//     toValue: 100,
//     easing: Easing.back(),
//     duration: 2000,
//     useNativeDriver: true,
//   }).start();


const styles = StyleSheet.create({
    Container: {
        // borderBottomWidth: 1,
        // borderColor: 'silver',
        marginBottom: 20,
    },
    ContainerFocus: {
        // borderBottomWidth: 1,
        // borderColor: '#0d6efd',
        marginBottom: 10,
    },
    LabelView: {
        zIndex: 0,
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    LabelText: {
        marginLeft: 10,
        marginBottom: 10,
        color: 'rgb(40, 40, 40)',
        fontSize: 20,
        // textAlign: 'center'
    },
    InputView: {
    },
    Input: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 2,
        borderColor: 'silver',
        borderWidth: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: 7,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    FocusInput: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 2,
        borderColor: '#dc354577',
        borderWidth: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: 7,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
})