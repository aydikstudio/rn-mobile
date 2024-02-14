import { StatusBar } from 'expo-status-bar';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, Alert, } from 'react-native';
import CheckBox from 'expo-checkbox'
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import axios from 'axios';


export default function Add({ navigation }) {

  const [important, setImportant] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const push = async () => {
    if(name.length > 0 && description.length > 0) {

   
      await axios.post(process.env.EXPO_SERVER_URL+'/add', {
        name,
        description,
        important
      })
      
      .then(function (response) {
        console.log(response.data)
        if(response.data.status == 'success') {
          navigation.navigate('Home')
        }
      

        if(response.data.status == 'error') {
          Alert.alert('Ошибка')
        }

      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      Alert.alert('Заполните все поля')
    }

  }

  return (

    <View style={styles.container}>
 
      <TextInput 
          placeholder="Name" 
          style={styles.inputText}
          value={name}
          onChangeText={setName}
          />
      

      <TextInput
        multiline
        numberOfLines={10}
        style={styles.inputText}
        placeholder="Description"
        keyboardType="numeric"
        value={description}
        onChangeText={setDescription}

        />

    <CheckBox
      value={important}
      style={styles.inputText}
      onValueChange={() => setImportant(!important)}
/><Text>Важно</Text>
  <TouchableOpacity  style={styles.inputText} onPress={() => push()}>
      <View style={styles.addBtn}  >
        <Text style={styles.addBtnText}>Add</Text>
      </View>
    </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 50
  },

  inputText: {
    marginTop: 20
  }, 

  addBtn: {
    width: 300,
    backgroundColor: '#ff0000'
  },
  addBtnText: {
    textAlign: 'center',
  },



});
