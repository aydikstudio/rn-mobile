import { StatusBar } from 'expo-status-bar';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import CheckBox from 'expo-checkbox'
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import axios from 'axios';


export default function Edit({ route, navigation }) {


  const { id } = route.params;

  const [important, setImportant] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(async () => {
    await getTask()
  }, [])


  const getTask = async () => {


    await axios.get(process.env.EXPO_SERVER_URL+'/task/'+id)
    .then(function (response) {
      
      setName(response.data.name);
      setImportant(response.data.important);
      setDescription(response.data.description);

    })
    .catch(function (error) {
      console.log(error);
    })
  
  }
  

  const push = async () => {
    await axios.put(process.env.EXPO_SERVER_URL+'/edit/' , {
      id,
      name,
      description,
      important
    })
    .then(function (response) {
      

          if(response.data.status == 'success') {
            navigation.navigate('Home')
          }
        
  
          if(response.data.status == 'error') {
            Alert.alert('Ошибка')
          }
    })
    .catch(function (error) {
      console.log(error);
    })
  
    

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
      onValueChange={() => setImportant(!important)} />

  <TouchableOpacity  style={styles.inputText} onPress={() => push()}>
      <View style={styles.addBtn}  >
        <Text style={styles.addBtnText}>Edit</Text>
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
    marginTop: 1
  }, 

  addBtn: {
    width: 300,
    backgroundColor: '#ff0000'
  },
  addBtnText: {
    textAlign: 'center',
  },

  inputText: {
    marginTop: 20
  }, 


});
