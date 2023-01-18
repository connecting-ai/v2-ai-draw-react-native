import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, Alert } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';

export default function ColorObjSelectScreen({ navigation }:any) {
  const [image, setImage] = useState<any>();
  const [type, setType] = useState(CameraType.back);
  const [permission, setPermission] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


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
    // if(answer.value != 'horse' && answer.value != 'Horse') {
    //   setAnswer({ ...answer, error: 'Wrong answer, please try again!' })
    //   return
    // }
    navigation.reset({
      index: 0,
      routes: [{ name: 'UploadScreen', params: {image: image} }],
    })
  }

  async function askCameraPermssion() {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setPermission(true)
      navigation.reset({
        index: 0,
        routes: [{ name: 'CameraInputScreen' }],
      })
    } else {
      Alert.alert('Access denied')
    }  
  }

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('ModeScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <Logo />
      <Header>Upload Image.</Header>
      <Paragraph>Browse and Upload Image.</Paragraph>
      {image && <ImageVan source={{ uri: image }} style={{ width: 200, height: 200, margin: 20 }} />}
      <Button
        mode="outlined"
        onPress={pickImage}
      >
        Browse
      </Button>
      <Button
        mode="outlined"
        onPress={askCameraPermssion}
      >
        Capture
      </Button>
      {/* <TextInput
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
      /> */}
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button mode="contained" onPress={checkAnswer}>
        Continue
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
