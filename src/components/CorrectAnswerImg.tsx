import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function CorrectAnswerImg({name}: any) {
  return <Image source={require(`../assets/correct.png`)} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 100,
    margin: 20,
    objectFit: 'contain'
  },
})
