import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Card from '../components/Card'
import ButtonCard from '../components/ButtonCard'
import BackButton from '../components/BackButton'
import { TouchableOpacity, Image as ImageVan, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function GuessSelectScreen({ navigation }:any) {
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
      <Header>Select Category</Header>
      {/* <Paragraph>
        Select Mode.
      </Paragraph> */}
      <ButtonCard
        icon="cow"
        style={{backgroundColor: "#4c29bc"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuessAnimalScreen' }],
          })
        }
      >
        Animals
      </ButtonCard>
      <ButtonCard
        icon="food-apple"
        style={{backgroundColor: "#803eb6"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuessSelectScreen' }],
          })
        }
      >
        Fruits
      </ButtonCard>
      <ButtonCard
        icon="carrot"
        style={{backgroundColor: "#8c0ebb"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuessSelectScreen' }],
          })
        }
      >
        Vegetables
      </ButtonCard>

      {/* <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button> */}


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
})