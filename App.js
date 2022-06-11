import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import Navigation from './src/components/Navigation';


const App = () => {
 
  return (
    
   <SafeAreaView style={styles.root}>
     <Navigation />
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  }
});


export default App;