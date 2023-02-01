import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Image as ImageVan } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { saveJSONToAppDir } from '../storage'

export default function ColorObjSelectScreen({ navigation, route }:any) {
  const [answer, setAnswer] = useState({ value: '', error: '' })

  const checkAnswer = async () => {

    let data = {
      "word": answer.value,
      "drawing": route.params.drawing
    }

    await saveJSONToAppDir(data)

    navigation.reset({
      index: 0,
      routes: [{ name: 'DoodleSavedScreen', params: { image: route.params.image} }],
    })
  }

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('DoodleScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <Logo />
      <Header>Name this doodle?</Header>
      <Paragraph>Enter name below.</Paragraph>
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
      <Button mode="contained" onPress={checkAnswer}>
        Submit
      </Button>
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
