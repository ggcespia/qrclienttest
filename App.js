import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

//Get your API key from the QR-Answers app
const apiKey = "api_e138069b91e24cbd81329394de4b5c6506605ad690d340cbbf96931d1ff16b66";
const qranswers = require("qranswers")(apiKey);

export default function App() {
  useEffect(() => {
    async function initQR() {
      const initApiOk = await qranswers.api.initialize();      
      
      const initOk = await qranswers.subscriptions.initialize();
      if (initOk) {
        const sub = qranswers.subscriptions.subscribeToAllResponses((response) => {
          console.log('response', response);
        })
        return sub;
      }
    }

    const sub = initQR();

    return () => {
      qranswers.subscriptions.unsubscribeToAllResponses(sub);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>QR-Answers API Tester</Text>
      <Pressable onPress={async () => {
        qranswers.api.getProjectList().then((projects) => {
          // returns {success: 'success', data: [...]} or {error: 'error message'}
          if (projects.data) {
            console.log(projects.data);
          }
        })
      }}>
        <Text>Get Projects</Text>
      </Pressable>
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
