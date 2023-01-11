import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Card from '../components/Card'
import ButtonCard from '../components/ButtonCard'

export default function ModeScreen({ navigation }:any) {
  return (
    <Background>
      <Logo />
      <Header>Select Mode</Header>
      {/* <Paragraph>
        Select Mode.
      </Paragraph> */}
      <ButtonCard
        icon="help"
        style={{backgroundColor: "#4c29bc"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuessSelectScreen' }],
          })
        }
      >
        Guess
      </ButtonCard>
      <ButtonCard
        icon="pencil"
        style={{backgroundColor: "#803eb6"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'DrawScreen' }],
          })
        }
      >
        Draw
      </ButtonCard>
      <ButtonCard
        icon="palette"
        style={{backgroundColor: "#8c0ebb"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'ColorObjSelectScreen' }],
          })
        }
      >
        Color
      </ButtonCard>
      <ButtonCard
        icon="camera-plus"
        style={{backgroundColor: "#bd08a0"}}
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'UploadInputScreen' }],
          })
        }
      >
        Upload
      </ButtonCard>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>


    </Background>
  )
}
