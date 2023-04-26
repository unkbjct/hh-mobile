import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../styles';

export default class Select extends React.Component {
    constructor(props) {
        super(props)
        this.label = props.label;
        this.help = props.help;
        this.setValue = props.onChange;
        this.key = props.itemKey;
        this.items = props.items;
    }


    render() {
        return (
            <View style={styles.Container}>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>{this.label}</Text>
                <RNPickerSelect placeholder={{}}
                    style={pickerSelectStyles}
                    onValueChange={(value) => this.setValue(value)}
                    items={this.items} itemKey={this.key}
                />
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

    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 20,
        color: 'black',
        backgroundColor: 'rgb(245, 245, 245)',
        textAlign: 'center',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        textAlign: 'center',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});