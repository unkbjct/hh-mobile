import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Animated,
    Easing
} from 'react-native';
import { defStyles } from '../styles';

export default class LabelInput extends React.Component {
    constructor(props) {
        super(props)
        this.label = props.label;
        this.value = props.value;
        this.help = props.help;
        this.setValue = props.onChange;

    }
    state = {
        styleInput: styles.Input
    }

    onFocus() {
        this.setState({
            styleInput: styles.FocusInput
        })
    }

    onBlur() {
        this.setState({
            styleInput: styles.Input
        })
    }



    render() {
        return (
            <View style={{ marginBottom: 20, }} >
                <View style={[styles.Container]}>
                    <Text style={styles.LabelText}>{this.label}</Text>
                    <View style={styles.InputView}>
                        <TextInput
                            // placeholder={this.label}
                            onBlur={() => this.onBlur()}
                            onFocus={() => this.onFocus()}
                            onChangeText={value => {
                                if (this.setValue) {
                                    this.setValue(value)
                                }
                            }}
                            secureTextEntry={this.secure}
                            // style={s tyles.EditInput}
                            style={[this.state.styleInput]}>{this.value}</TextInput>
                    </View>
                </View>
                {(this.help) ? <Text style={{ color: 'rgb(150, 150, 150)' }}>{this.help}</Text> : <></>}
            </View >
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
        marginBottom: 10,
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