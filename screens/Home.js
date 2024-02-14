
import {StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import CheckBox from 'expo-checkbox'
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Home({  navigation }) {

  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const [tableHead, setTableHead] = useState(['done', 'name', 'desc', '' , '']);
  const [tableData, setTableData] = useState([]);


  useEffect( async () => {
    await getTasks()
  }, [])


  useEffect( () => {
  getTasks()
  }, [selectedLanguage])

  const deleteTask = async (index) => {

    await axios.delete(process.env.EXPO_SERVER_URL+'/'+index)
    .then(async function (response) {
  
 
  
      if(response.data.status == 'success') {
       await getTasks()
      }
    

      if(response.data.status == 'error') {
        Alert.alert('Ошибка')
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const getTasks = async () =>{




    await axios.get(process.env.EXPO_SERVER_URL+'/tasks/'+selectedLanguage)
  .then(function (response) {

  

    let arr = [];

    response.data.map((task, index) => {
      let subarr = [];
      subarr.push(task.done)
      subarr.push(task.name)
      subarr.push(task.description)
      subarr.push(task._id)
      subarr.push(task._id)
      subarr.push(task.important)
      arr.push(subarr)
    })

    setTableData(arr)
  })
  .catch(function (error) {
    console.log(error);
  })

 
  }

  const elementEdit = (index, value) => (
    <TouchableOpacity onPress={() => navigation.navigate('Edit', {
      id: index
    })}>
      <View style={styles.btn}  >
        <Text style={styles.btnText}>{value}</Text>
      </View>
    </TouchableOpacity>
  );


   const elementDelete = (index, value) => (
    <TouchableOpacity onPress={() => deleteTask(index)}>
      <View style={styles.btn}  >
        <Text style={styles.btnText}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  const changeDone = async (index) =>  {

    let id;
    let done;

     tableData.map((item, indexArr) => {
        let newItem = [...item];

        if(indexArr == index) {
            id = newItem[3]
            done = !newItem[0]
        }

      
    })

    console.log(id)
    console.log(done)

    await axios.put(process.env.EXPO_SERVER_URL+'/edit/' , {
      id,
      done
    })
    .then(function (response) {
      

          if(response.data.status == 'success') {
            getTasks()
          }
        
  
          if(response.data.status == 'error') {
            Alert.alert('Ошибка')
          }
    })
    .catch(function (error) {
      console.log(error);
    })



  }

  const displayInfo = (cellData, index, rowIndex) => {
  
    if(index == 0) {
     
      return <CheckBox
      value={cellData}
      onValueChange={() => changeDone(rowIndex)}
   
    />
    }   else if(index == 3) {
      return elementEdit(cellData, 'edit')
   
 
    } else if(index == 4) {
      return elementDelete(cellData, 'remove')
   

    } 

    else if(index == 5) {
      return cellData ? 'important' : ''
   

    }
    
    else {
      return cellData
    }
  }

  return (

    <SafeAreaView>
    <View style={styles.container}>
 
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Add')}>
      <View style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => getTasks()}>
      <View >
        <Text style={styles.addBtnText}>Refresh</Text>
      </View>
    </TouchableOpacity>

        <View>
          <Picker
            style={{ height: 30, width: 300 }}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            <Picker.Item label="Все" value="all" />
            <Picker.Item label="Важные " value="important" />
          </Picker>
        </View>
      </View>

      <View style={styles.containerTable}>
        <Table borderStyle={{ borderColor: 'transparent' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={displayInfo(cellData, cellIndex, index ) } textStyle={styles.text} />
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 50
  },

  header: {
    marginTop: 100
  },

  containerTable: {
    width: 350,
    marginTop: 20
  },

  pickerStyles: {
    width: '70%',
    backgroundColor: 'gray',
    color: 'white'
  },

  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  addBtn: {
    width: 300,
    backgroundColor: '#ff0000'
  },
  addBtnText: {
    textAlign: 'center',
  },


});
