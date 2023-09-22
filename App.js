import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//Get your API key from the QR-Answers app
const apiKey = "api_e138069b91e24cbd81329394de4b5c6506605ad690d340cbbf96931d1ff16b66";
const qranswers = require('qranswers')(apiKey);

export default function App() {
  useEffect(() => {
    async function initQR() {
      const initOk = await qranswers.subscriptions.initialize();
      if (initOk) {
        const sub = qranswers.subscriptions.subscribeToResponse((response) => {
          console.log('response', response);
        })
        return sub;
      }
    }

    const sub = initQR();

    return () => {
      qranswers.subscriptions.unsubscribeToResponse(sub);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
