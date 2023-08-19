// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ActivityIndicator, StatusBar, Pressable, Button, StyleSheet, Text, View, Image, ScrollView, Modal } from 'react-native';
const logoImg = require('./assets/salim.png');

export default function App() {

  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [bar, setBar] = useState(false);
  const [indicator, setIndicator] = useState(false);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="lightgreen" barStyle="light-content" hidden={bar} />
      <ScrollView>
        <Text style={styles.heading}>Dad GPT</Text>
        <Pressable onPress={() => console.log('you pressed Salim')}>
          <Image source={logoImg} style={{ width: 150, height: 150 }} />
        </Pressable>
        <ActivityIndicator size="large" color="green" animating={indicator} />
        <Button style={styles.btn} title="🎙️ Start" onPress={() => console.log('pressed')} color="pink" />
        <Button style={styles.btn} title="🛑 Stop" color="pink" disabled />
        <Button style={styles.btn} title="Open Form" color="pink" onPress={() => setFormModalVisible(true)} />
        <Button style={styles.btn} title="Open Page" color="lightblue" onPress={() => setPageModalVisible(true)} />
        <Button style={styles.btn} title="Bar Toggle" color="red" onPress={() => setBar(!bar)} />
        <Button style={styles.btn} title="Indicator Toggle" color="orange" onPress={() => setIndicator(!indicator)} />
        <Button style={styles.btn} title="Alert" color="green" onPress={() => Alert.alert("testing...", "Date.now()", [{ 'text': 'Cancel', onPress: () => console.log('cancelled') }, { 'text': 'Ok', onPress: () => console.log('ok') }])} />
        <Text style={styles.question}>Press start to begin</Text>
        <Modal visible={formModalVisible} onRequestClose={() => setFormModalVisible(false)} animationType="fade" presentationStyle="formSheet" >
          <View style={{ flex: 1, backgroundColor: "lightblue", padding: 60 }}>
            <Text>Form Sheet</Text></View>
          <Button title="Close" color="pink" onPress={() => setFormModalVisible(false)} />
        </Modal>
        <Modal visible={pageModalVisible} onRequestClose={() => setPageModalVisible(false)} animationType="slide" presentationStyle="pageSheet" >
          <View style={{ flex: 1, backgroundColor: "lightblue", padding: 60 }}>
            <Text>Page Sheet</Text></View>
          <Button title="Close" color="pink" onPress={() => setPageModalVisible(false)} />
        </Modal>

      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  heading: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 50
  },
  question: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    padding: 20
  },
  btn: {
    color: 'black',
    fontSize: 10,
    textAlign: 'center',
    margin: 50
  }
});
