import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function AnimalImg({name}: any) {
  return <Image source={require(`../assets/horse.png`)} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    margin: 10,
    objectFit: 'contain'
  },
})
