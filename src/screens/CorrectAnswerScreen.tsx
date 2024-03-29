import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Image as ImageVan } from 'react-native'
import Background from '../components/Background'
import CorrectAnswerImg from '../components/CorrectAnswerImg'
import Header from '../components/Header'
import Button from '../components/Button'
import { theme } from '../core/theme'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function CorrectAnswerScreen({ navigation }:any) {

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('GuessSelectScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <Header>Correct Answer!</Header>
      <CorrectAnswerImg/>
      <Button mode="contained" 
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuessSelectScreen' }],
          })
        }
        >
        Continue
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
