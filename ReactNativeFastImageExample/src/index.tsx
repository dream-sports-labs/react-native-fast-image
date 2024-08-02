import React from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from './Icon';
import FastImageExamples from './FastImageExamples';
import FastImageGrid from './FastImageGrid';
import DefaultImageGrid from './DefaultImageGrid';

const Tab = createBottomTabNavigator();

LogBox.ignoreLogs([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);
const uiManager = global?.nativeFabricUIManager ? 'Fabric' : 'Paper';

console.log('Running on',uiManager)

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen
          name="FastImage Example"
          component={FastImageExamples}
          options={{
            tabBarIcon: props => (
              <Icon name="information-circle-outline" {...props} />
            ),
          }}
        />
        <Tab.Screen
          name="Image Grid"
          component={DefaultImageGrid}
          options={{
            tabBarIcon: props => <Icon name="image-outline" {...props} />,
          }}
        />
        <Tab.Screen
          name="FastImage Grid"
          component={FastImageGrid}
          options={{
            tabBarIcon: props => <Icon name="images-outline" {...props} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
