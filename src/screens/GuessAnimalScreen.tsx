import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import AnimalImg from '../components/AnimalImg'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function GuessAnimalScreen({ navigation }:any) {
  const [answer, setAnswer] = useState({ value: '', error: '' })
  // const [password, setPassword] = useState({ value: '', error: '' })

  const checkAnswer = () => {
    // const emailError = emailValidator(email.value)
    // const passwordError = passwordValidator(password.value)
    // if (emailError || passwordError) {
    //   setEmail({ ...email, error: emailError })
    //   setPassword({ ...password, error: passwordError })
    //   return
    // }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'ModeScreen' }],
    // })
    if(answer.value != 'horse' && answer.value != 'Horse') {
      setAnswer({ ...answer, error: 'Wrong answer, please try again!' })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'CorrectAnswerScreen' }],
    })
  }

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('GuessSelectScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      {/* <Logo /> */}
      <Header>What is this Animal?</Header>
      <AnimalImg name="horse"/>
      <Paragraph>Enter your answer below.</Paragraph>
      <TextInput
        label="Answer"
        returnKeyType="next"
        value={answer.value}
        onChangeText={(text:any) => setAnswer({ value: text, error: '' })}
        error={!!answer.error}
        errorText={answer.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="answer"
        keyboardType="text"
      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button mode="contained" onPress={checkAnswer}>
        Submit
      </Button>
      {/* <Button
        mode="outlined"
        onPress={() => navigation.navigate('ModeScreen')}
      >
        Next
      </Button> */}
      {/* <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View> */}
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
    zIndex: 1000
  },
  image: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
