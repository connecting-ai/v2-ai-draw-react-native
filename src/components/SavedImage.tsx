import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function SavedImage({image}: any) {
  return <Image source={{uri: image}} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
    margin: 20,
    objectFit: 'contain'
  },
})
