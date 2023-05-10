import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../styles';
import Checkbox from 'expo-checkbox';
import { Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';

export default class Check extends React.Component {
    constructor(props) {
        super(props)
        this.label = props.label;
        this.help = props.help;
        this.setValue = props.onChange;
        this.key = props.itemKey;
        this.value = props.value;
        // console.log(this.value)
    }

    state = {
        isChecked: this.props.isChecked,
    }

    async chancge() {
        await this.setState({ isChecked: !this.state.isChecked })
        this.setValue(this.value, this.state.isChecked)
    }

    render() {
        return (
            <TouchableOpacity style={styles.Container} onPress={() => this.chancge()}>
                <Checkbox
                    style={styles.Checkbox}
                    value={this.state.isChecked}
                    onValueChange={() => { this.setState({ isChecked: !this.state.isChecked }) }}
                    color={this.state.isChecked ? colors.danger : undefined}
                />
                <Text style={{ fontSize: 20 }}>{this.label}</Text>
            </TouchableOpacity>
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
        marginBottom: 10,
        alignItems: 'center'
    },
    Checkbox: {
        marginRight: 15,
    }
})
