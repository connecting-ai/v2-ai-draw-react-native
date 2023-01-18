import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function ColorObjSelectScreen({ navigation, route }:any) {
  const [keywords, setKeywords] = useState({ value: route.params.prompt, error: '' })
  const [strength, setStrength] = useState({ value: '0.85', error: '' })
  const [guidance_scale, setGuidanceScale] = useState({ value: '7.5', error: '' })

  const submit = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawScreen', params: {keywords: keywords.value, strength: strength.value, guidance_scale: guidance_scale.value, firstImage: route.params.firstImage} }],
    })
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
      <Header>Settings</Header>
      {/* <AnimalImg name="horse"/> */}
      <Paragraph>Edit fields given below as per your need.</Paragraph>
      <TextInput
        label="Prompt (Keywords)"
        returnKeyType="next"
        value={keywords.value}
        onChangeText={(text:any) => setKeywords({ value: text, error: '' })}
        error={!!keywords.error}
        errorText={keywords.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="prompt"
        keyboardType="text"
      />
      <TextInput
        label="Strength (0 - 1)"
        returnKeyType="next"
        value={strength.value}
        onChangeText={(text:any) => setStrength({ value: text, error: '' })}
        error={!!strength.error}
        errorText={strength.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="strength"
        keyboardType="number"
      />
      <TextInput
        label="Guidance Scale (0 - 10)"
        returnKeyType="next"
        value={guidance_scale.value}
        onChangeText={(text:any) => setGuidanceScale({ value: text, error: '' })}
        error={!!guidance_scale.error}
        errorText={guidance_scale.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="guidance_scale"
        keyboardType="text"
      />
      <Button mode="contained" onPress={submit}>
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
