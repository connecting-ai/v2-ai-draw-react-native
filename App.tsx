import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  ModeScreen,
  DrawScreen,
  GuessSelectScreen,
  GuessAnimalScreen,
  GuessFruitScreen,
  GuessVegetableScreen,
  CorrectAnswerScreen,
  ColorObjSelectScreen,
  ColorScreen,
  UploadInputScreen,
  UploadScreen,
  CameraInputScreen,
  SettingsScreen
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ModeScreen" component={ModeScreen} />
          <Stack.Screen name="DrawScreen" component={DrawScreen} />
          <Stack.Screen name="GuessSelectScreen" component={GuessSelectScreen} />
          <Stack.Screen name="GuessAnimalScreen" component={GuessAnimalScreen} />
          <Stack.Screen name="GuessFruitScreen" component={GuessFruitScreen} />
          <Stack.Screen name="GuessVegetableScreen" component={GuessVegetableScreen} />
          <Stack.Screen name="CorrectAnswerScreen" component={CorrectAnswerScreen} />
          <Stack.Screen name="ColorObjSelectScreen" component={ColorObjSelectScreen} />
          <Stack.Screen name="ColorScreen" component={ColorScreen} />
          <Stack.Screen name="UploadInputScreen" component={UploadInputScreen} />
          <Stack.Screen name="UploadScreen" component={UploadScreen} />
          <Stack.Screen name="CameraInputScreen" component={CameraInputScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
