import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import { defStyles } from '../styles';

export default class RadioInput extends React.Component {
    constructor(props) {
        super(props)
        this.animation = React.createRef(new Animated.Value(0))
    }



    state = {
        select: (Boolean)(this.props.selected),
        styleCheckbox: (this.state.select)
            ? styles.CheckedCheckbox : styles.Checkbox,
        label: this.props.label,
        value: this.props.value,
        setValue: this.props.onChange,
        isSelected: this.props.isSelected,
        // select: this.props.onSelect,
    }

    changeCheckbox() {
        // let selected = this.state.select(this.state.value)
        // console.log(selected, this.state.value)
        this.setState({
            styleCheckbox: (this.state.select)
                ? styles.CheckedCheckbox : styles.Checkbox,
            // stylesContainer: styles.Container,
            // stylesValid: defStyles.valid,
        })

    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.changeCheckbox()
                this.state.select = !this.state.select
            }}>
                <View style={styles.Container}>
                    <View style={this.state.styleCheckbox}></View>
                    <Text>{this.state.label}</Text>
                </View>
            </TouchableWithoutFeedback>
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
        flexDirection: 'row',
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
    },
    Checkbox: {
        borderWidth: 1,
        width: 20,
        height: 20,
        marginRight: 10,
    },
    CheckedCheckbox: {
        borderWidth: 1,
        width: 20,
        height: 20,
        marginRight: 10,
        backgroundColor: 'red',
    }
})