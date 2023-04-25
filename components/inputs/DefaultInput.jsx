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

export default class DefaultInput extends React.Component {
    constructor(props) {
        super(props)
    }



    state = {
        stylesContainer: styles.Container,
        stylesLabel: styles.LabelText,
        stylesValid: defStyles.valid,
        label: this.props.data.label,
        value: this.props.data.value,
        help: this.props.data.help,
        secure: this.props.data.secure,
        setValue: this.props.onChange,

    }

    onFocus() {
        this.setState({
            stylesContainer: styles.ContainerFocus,
            // stylesValid: defStyles.isInvalid,
        })
    }

    onBlur() {
        this.setState({
            stylesContainer: styles.Container,
            // stylesValid: defStyles.valid,
        })
    }



    render() {
        return (
            <View style={{ marginBottom: 20, }} >
                <View style={[this.state.stylesContainer]}>
                    <View style={styles.InputView}>
                        <TextInput
                            placeholder={this.state.label}

                            onBlur={() => this.onBlur()}
                            onFocus={() => this.onFocus()}
                            onChangeText={value => {
                                if (this.state.setValue) {
                                    this.state.setValue(value)
                                }
                            }}
                            secureTextEntry={this.state.secure}
                            // style={s tyles.EditInput}
                            style={[styles.Input]}>{this.state.value}</TextInput>
                    </View>
                </View>
                {(this.state.help) ? <Text style={{ color: 'rgb(150, 150, 150)' }}>{this.state.help}</Text> : <></>}
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
        borderBottomWidth: 1,
        borderColor: 'silver',
        marginBottom: 10,
    },
    ContainerFocus: {
        borderBottomWidth: 1,
        borderColor: '#0d6efd',
        marginBottom: 10,
    },
    LabelView: {
        zIndex: 0,
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    LabelText: {
        color: 'rgb(40, 40, 40)',
        fontSize: 20,
    },
    InputView: {
    },
    Input: {
        fontSize: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 2,
    },
})