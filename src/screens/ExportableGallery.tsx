import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, FlatList, SafeAreaView } from 'react-native'
import Button from '../components/Button'
import { theme } from '../core/theme'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { downloadExportableJSON, readExportableDir, readExportableJSON } from '../storage'
import ButtonHeader from '../components/ButtonHeader'

export default function ExportableGallery({ navigation }:any) {
  const [allImages, setAllImages] = useState<any>()

  const getImages = async () => {
    const allImgs = await readExportableDir()
    setAllImages(allImgs)
  }

  const exportAll = async () => {
    await downloadExportableJSON()
  }

  useEffect(() => {
    if(!allImages) {
      getImages()
    }
  })

  return (
    <SafeAreaView style={styles.containerGrid}>
      <TouchableOpacity onPress={() => navigation.navigate('DoodleScreen')}
        style={styles.container}>
        <ImageVan
          style={styles.image}
          source={require('../assets/arrow_back.png')}
        />
      </TouchableOpacity>
      <ButtonHeader mode="text" style={styles.header} compact={true}>
        What is this?
      </ButtonHeader>
      <FlatList
        style={styles.flatList}
        data={allImages}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 1
            }}>
            <ImageVan
              style={styles.imageThumbnail}
              source={{ uri: item }}
            />
          </View>
        )}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button mode="contained" style={styles.nextButton}
      onPress={exportAll}>
          Export All
        </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  nextButton: {
    position: 'absolute',
    width: '80%',
    marginBottom: 30,
    bottom: 0,
    left:0,
    right:0,
    marginLeft: 'auto',
    marginRight: 'auto'  
  },
  flatList: {
    marginTop: 50,
    marginBottom: 100,
    backgroundColor: '#efefef',
  },
  header: {
    position: 'absolute',
    width: '80%',
    marginBottom: 30,
    top: 8 + getStatusBarHeight(),
    left:0,
    right:0,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  containerGrid: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    // width: 100,
  },
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 16,
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
