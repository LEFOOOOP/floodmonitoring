//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ImageBackground, Image, ScrollView, RefreshControl,Button} from 'react-native';
import React, {useState,useEffect,useRef} from 'react';
import EventSource, {EventSourceListener} from "react-native-sse";
import bgImage from '../../../assets/rain.jpg';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
//import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

//import { Text, View, Button, Platform } from 'react-native';
let previousData = "A"
var floodData = ""
var checker = "a"
var counter = 0
var globalFLoodData = ""

// Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Remember to drink water!',
//     body: "Bobo mo"
//   },
//   trigger: {
//     seconds: 3600,
//     repeats: true,
//   },
// });

Notifications.setNotificationHandler({ 
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export let historyData = [];
async function sendPushNotification(expoPushToken,bodyData) {
      floodData = bodyData
      console.log(floodData, "ito ay ang bagong flood data")
      console.log("bago: ",previousData )
      if(previousData!=floodData){
       
       previousData = floodData
       //setPreviousData(floodData);
     console.log("pagkatapos",previousData);
    //  
  console.log("pushNotif pabilang")
  let message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Flood Update',
    body: bodyData,
    data: { someData: "asdasd" },
  };
  

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}else{
  console.log("ayaw k o m nag send")
}
}

const Homescreen = () => {
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  const [data, setData] = useState("");
  
  
  const [data2, setData2] = useState("");
  const [data3, setData3] = useState("");
  
  
  
  const handleStream = (e) => {
   // var checker = "a"
    
    let stringData = JSON.parse((e.data.slice(1, -1).replace(/'/g, '"').split(", {"))[0]);
    //setPreviousData(stringData["water level"])
    //console.log(stringData)
    setData (stringData["water level"]);// data = stringData["water level"]
    
    //console.log("Warer levcio",stringData["water level"]);
    //console.log("live:", data)
    setData2 (stringData["other sensor data"]);
    setData3 (stringData["flood warning"]);
    //console.log("bago",previousData);
    //floodData = stringData["water level"]


    fetch('https://iotproject-sample.herokuapp.com/streams/ESP32V1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtpbWZvbGxvc29AZ21haWwuY29tIiwidXNlcl9pZCI6ImtpbWZmIiwiaWF0IjoxNjQ3MjM0NjYwfQ.jGfiA8toi4v_8AYP6ohu9qWExEaxmLsQ3sLFtSBZTeU',
      },
    }).then(async response => {
      try {
          historyData = await response.json();
          console.log(historyData[0]);
          console.log(historyData.length);
          
          
      } catch (err){
        console.log(err.message);

      }})
      
    
  }
  const options = {
    method: 'GET', // Request method. Default: GET
    timeout: 0, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
    headers: {}, // Your request headers. Default: {}
    body: undefined, // Your request body sent on connection: Default: undefined
    debug: false, // Show console.debug messages for debugging purpose. Default: false
    pollingInterval: 1000000000000, // Time (ms) between reconnections. Default: 5000
  }
  let sse = new EventSource('https://iotproject-sample.herokuapp.com/streams/live/ESP32V1',options);
  sse.addEventListener("message", async (e) => {
    
    handleStream(e)
    globalFLoodData = data;
    
  });





  useEffect(()=>{

    sendPushNotification(expoPushToken,data);
    console.log('useEffect pabilang');
    console.log(data)
    console.log("new var: ",globalFLoodData)

  },[globalFLoodData])
  


  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  

// useEffect(()=>{
//     fetch('https://iotproject-sample.herokuapp.com/streams/ESP32V1/', {
//         method: 'GET',
//         headers: {
//           'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtpbWZvbGxvc29AZ21haWwuY29tIiwidXNlcl9pZCI6ImtpbWZmIiwiaWF0IjoxNjQ3MjM0NjYwfQ.jGfiA8toi4v_8AYP6ohu9qWExEaxmLsQ3sLFtSBZTeU',
//         },
//       }).then(async response => {
//         try {
//             historyData = await response.json();
//             console.log(historyData[0]);
//             console.log(historyData.length);
            
            
//         } catch (err){
//           console.log(err.message);

//         }})
// })
  const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []); 
  
  return (
    <ReactNativeZoomableView
        zoomEnabled={true}
        maxZoom={2}
        minZoom={0.5}
        bindToBorders={true}
      >
    <ImageBackground source={bgImage} style={styles.container}>
      <Text style={styles.text}>Flood Level and Rate Monitoring</Text>
      <Text style={styles.text}>Live Data</Text>
      <Text style={styles.text2}>Flood Level: {data}</Text>
      <Text style={styles.text2}>Flood Rate: {data2} mm/hr</Text>
      <Text style={styles.text2}>Flood Rate Category: {data3}</Text>
      {/* <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */}
      <Image style={{width: 500, height: 100}}
            resizeMode='contain'
            source={require('../../../assets/warning.png')}
      />
      <Image style={{height: 400}}
            resizeMode='contain'
            source={require('../../../assets/levels.png')}
      />
    </ImageBackground>
    </ReactNativeZoomableView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: 'auto',
  },
  text: {
    color: '#33324f',
    fontStyle:"italic",
    fontSize:20,
    fontWeight:"bold",
    marginTop: 30,
  },
  text2: {
    color: 'white',
    fontStyle:"italic",
    fontSize:15,
    fontWeight:"bold",
  },
  
});



export default Homescreen