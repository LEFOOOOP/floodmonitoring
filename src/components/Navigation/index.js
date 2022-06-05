import React, {useState, useEffect} from 'react';
import { Alert, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Homescreen from '../../screens/Homescreen';
import Historyscreen from '../../screens/Historyscreen';

const Tab = createMaterialTopTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator 
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
   
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'list-circle' : 'list-circle-outline';
                    }
                    return <Ionicons name={iconName} size={25} color={color} />;
                    },
                    tabBarActiveTintColor: '#1afffc',
                    tabBarInactiveTintColor: 'white',
                    tabBarShowLabel: true,
                    tabBarStyle: {backgroundColor: '#00403c'},
                    tabBarIndicatorStyle: {top: 0, backgroundColor: '#1afffc', height: 2},
                    tabBarItemStyle: {height: 50},
                    tabBarLabelStyle: {fontSize: 15, marginBottom: -1, marginTop: -1}
                })}
                tabBarPosition ={'bottom'}
            >
                <Tab.Screen name="Home" component={Homescreen} />
                <Tab.Screen name="History" component={Historyscreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;