import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { colors } from "../../theme";
import TitleButton from "../custom/TitleButton";
import Trips from '../../screens/Dashboard/trips';
const Stack = createStackNavigator();

const TripStack = () => {
  return (
    <Stack.Navigator initialRouteName="Trip" headerMode="float">
      <Stack.Screen
        name="Trip"
        options={({navigation: {navigate}}) => ({
          headerLeft: () => (
            <View style={classes.left}>
              <TitleButton label="Trips" />
            </View>
          ),
          title: '',
          headerStyle: {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          },
        })}
        component={Trips}
      />
    </Stack.Navigator>
  );
};

export default TripStack;

const classes = StyleSheet.create({
  label: {
    fontSize: 18,
    lineHeight: 25,
    // color: '#000',
  },
  badge: {
    position: 'absolute',
    left: 25,
    bottom: 18,
    zIndex: 5,
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
  },
});
