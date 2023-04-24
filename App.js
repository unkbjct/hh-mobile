import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MainNavigation from './navigation/MainNavigation';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        theme="auto"
      // hidden={true}
      // animated="slide"
      // showHideTransition="fade"
      />
      <MainNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
