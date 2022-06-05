//import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, View, ScrollView, RefreshControl } from 'react-native';
import { Table, TableWrapper, Row} from 'react-native-table-component';
import { historyData } from '../Homescreen/Homescreen';


// const wait = (timeout) => {
//   return new Promise(resolve => setTimeout(resolve, timeout));
// }

// const Refresh = () => {
//   const [refreshing, setRefreshing] = React.useState(false);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     wait(2000).then(() => setRefreshing(false));
//   }, [])};


export default class Historyscreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date & Time', 'Flood Level', 'Flood Rate (mm/hr)', 'Flood Rate Category'],
      widthArr: [160, 140, 100, 140],
      refreshing: false,
    };
    
  }
  
  _onRefresh = () => {
    
    if(this.setState({refreshing: false})){
    this.setState({refreshing: true});
    fetch('https://iotproject-sample.herokuapp.com/streams/ESP32V1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtpbWZvbGxvc29AZ21haWwuY29tIiwidXNlcl9pZCI6ImtpbWZmIiwiaWF0IjoxNjQ3MjM0NjYwfQ.jGfiA8toi4v_8AYP6ohu9qWExEaxmLsQ3sLFtSBZTeU',
      },
    }).then(async response => {
      try {
        let historyData = []
          historyData = await response.json();
          console.log(historyData[0]);
          console.log(historyData.length);
          
          this.setState({refreshing: false});
          
          
      } catch (err){
        console.log(err.message);

      }})
    }
  }

 
  
        // fetchData().then(() => {
        //   this.setState({refreshing: false});
        // });

  render() {
    let history = []
    const timeArray = []
    const floodArray = []
    const warningArray = []
    const floodrateArray = []
    const tableData=[]
    const arrayIndex = [timeArray,floodArray,floodrateArray,warningArray]
    const state = this.state;
    
    const putInArrays = (jsonentry) =>{
      for(let i = 0; i<history.length; i++){
        timeArray.push(new Date(jsonentry[i]["created_at"])[Symbol.toPrimitive]('default'))
        floodArray.push(jsonentry[i]["data"]["water level"])
        floodrateArray.push(jsonentry[i]["data"]["other sensor data"])
        warningArray.push(jsonentry[i]["data"]["flood warning"])
      }
    }
    history = historyData;
    putInArrays(history)
    for(let i = 0; i<history.length; i++){
      const rowData = [];
      for (let j =0; j <4; j++){
        rowData.push(arrayIndex[j][i])
      }
      tableData.push(rowData)
    }
    
    

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }> 
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {
                  tableData.reverse().map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#006c83'},
  header: { height: 50, backgroundColor: '#537791', },
  text: { textAlign: 'center', fontWeight: 'normal' },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: '#E7E6E1' }
});


//export default Historyscreen