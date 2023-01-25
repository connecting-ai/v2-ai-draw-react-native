import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, Dimensions, Vibration } from 'react-native'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import { theme } from '../core/theme'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Logger from '../logger'
import { Canvas, Rect, useCanvasRef, Path } from '@shopify/react-native-skia'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IPath } from '../interfaces'
import { Chip } from 'react-native-paper';

export default function GuessAnimalScreen({ navigation }:any) {

  const [answer, setAnswer] = useState({ value: '', error: '' })
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState<string[]>();
  const [paths, setPaths] = useState<IPath[]>([]);
  const ref = useCanvasRef();

  const nextGuess = () => {
    clear()
  }

  function getStatus() {
    const interval = setInterval(() => setStatus(Logger.getLog()), 500);
    return () => {
      clearInterval(interval);
    };
  }

  const clear = () =>{
    setPaths([]);
    Logger.setLog('')
  }

  function setAnswerFn(val: any) {
    setAnswer(val)
    if(val.value != keyword) {
      Vibration.vibrate()
    }
  }

  function getGuess() {
    clear()
    let items = [
      {"word":"apple","countrycode":"US","timestamp":"2017-03-10 22:17:57.57466 UTC","recognized":false,"key_id":"6420579601088512","drawing":[[[255,255],[0,0]],[[255,255],[0,0]],[[255,255],[0,0]],[[255,254],[0,1]],[[131,124,114,69,37,10,0,0,5,16,31,50,68,86,101,115,126,135,137,135,122,106],[50,39,39,59,89,127,172,194,215,233,244,249,249,241,225,203,174,143,114,88,65,45]],[[84,77,81,88,99,122,138,161,180],[97,85,52,34,18,4,1,2,12]]]},
      {"word":"apple","countrycode":"RU","timestamp":"2017-03-08 06:29:44.16282 UTC","recognized":true,"key_id":"4986110117675008","drawing":[[[95,79,68,31,17,9,1,0,4,54,103,130,168,190,204,219,228,222,210,200,194,197,203,192,189,190,209,207,197,179,107,100],[62,50,49,74,91,113,163,220,226,249,255,255,244,231,215,187,152,151,160,160,156,140,137,134,115,109,88,82,71,63,62,65]],[[100,100,104,110,115,115,108,107],[58,17,1,0,12,22,44,64]]]},
      {"word":"apple","countrycode":"GB","timestamp":"2017-03-10 12:41:33.39063 UTC","recognized":true,"key_id":"6489082920173568","drawing":[[[121,107,45,17,1,0,4,21,58,118,173,197,209,224,244,254,254,209,164,124],[47,57,56,75,93,114,123,140,162,187,196,187,177,164,136,115,101,83,71,43]],[[123,126],[43,0]]]},
      {"word":"apple","countrycode":"US","timestamp":"2017-03-16 18:01:54.55904 UTC","recognized":true,"key_id":"4587619411296256","drawing":[[[104,80,54,28,11,0,1,8,20,51,90,111,147,170,198,213,229,248,255,255,243,221,213,161,120,111,110,117,141,115],[54,38,38,53,80,128,164,183,201,228,244,249,250,244,232,220,197,157,126,97,68,45,41,35,54,66,50,32,0,61]]]},
      {"word":"apple","countrycode":"TH","timestamp":"2017-03-29 14:35:17.69472 UTC","recognized":true,"key_id":"5198601426829312","drawing":[[[85,76,61,45,34,10,4,0,4,30,58,87],[112,101,96,96,104,134,148,199,209,227,240,247]],[[89,126,162,213,236,254,254,243,236,218,189,143,123,107],[243,242,226,208,192,172,143,111,99,83,75,72,77,93]],[[69,68,75,77,83,87,109,118,119,113,102,75],[107,91,52,15,1,1,21,37,58,85,103,103]]]},
      {"word":"apple","countrycode":"FI","timestamp":"2017-03-09 11:06:43.60732 UTC","recognized":true,"key_id":"4826235060355072","drawing":[[[184,160,135,100,50,14,4,0,27,50,70,108,156,201,218,221,223,212,196,180],[250,229,224,251,255,234,175,118,77,58,56,68,68,106,131,145,163,203,218,218]],[[111,107,100],[61,55,0]],[[99,76,70,74,83],[42,37,27,25,28]]]},
      {"word":"apple","countrycode":"US","timestamp":"2017-01-23 01:47:21.10639 UTC","recognized":true,"key_id":"5589733180702720","drawing":[[[59,31,4,0,7,43,74,114,144,164,195,207,217,231,231,225,206,187,141,86,43],[59,78,115,156,180,223,245,255,254,249,231,218,199,153,125,110,90,79,63,60,65]],[[89,87,89,96,93,92],[49,13,38,65,42,0]],[[81,52,48,51,85,102],[19,18,24,27,32,30]]]},
      {"word":"apple","countrycode":"AU","timestamp":"2017-03-24 06:05:28.25071 UTC","recognized":true,"key_id":"5546629002166272","drawing":[[[86,48,22,10,4,0,0,4,15,36,69,110,156,196,209,229,240,239,229,217,151,118,103,95,76,54],[91,84,85,90,99,124,153,166,185,211,235,252,255,244,235,199,131,72,62,59,60,70,81,94,63,39]],[[83,103,113,130,130,122,97],[65,22,11,0,44,58,91]]]},
    ]

    let item = items[Math.floor(Math.random()*items.length)];

    let path = item.drawing.map(strokes => {
      return {
        "color": "black",
        "segments": strokes[0].map((path, i) => {
            return `L ${strokes[0][i]} ${strokes[1][i]}`
        })
      }
    })

    let options = [
      'apple', 'mango', 'banana'
    ]

    setAnswer({ value: '', error: '' })
    setKeyword(item.word)
    setPaths(path)
    setOptions(options)
  }

  useEffect(() => {
    getStatus()
    if(!paths.length && !status) {
      getGuess()
    }

  });

  return (
    <Background>
      <TouchableOpacity onPress={() => {navigation.navigate('ModeScreen'); clear()}}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      {/* <Logo /> */}
      <Header>What is this Animal?</Header>

      <GestureHandlerRootView>
      <View style={styles.animalImg}>
        <Canvas ref={ref} style={{ flex: 1 }} >
          <Rect x={0} y={0} width={Dimensions.get('window').width} height={Dimensions.get('window').height} color="white" />
          {paths.map((p, index) => (
            <Path
              key={index}
              path={p.segments.join(" ")}
              strokeWidth={5}
              style="stroke"
              color={p.color}
            />
          ))}
        </Canvas>
        </View>
      </GestureHandlerRootView>

      <Paragraph>Select your answer.</Paragraph>

      <View style={{display: 'flex', flexDirection: 'row', marginTop: 30}}>

        {
          options && options.length?
          options.map((option: string, index) => {
            return (
            <Chip
            key={index}
            style={{marginRight: 10, backgroundColor: option == keyword && answer.value == option ? 'green' : answer.value == option ? theme.colors.error : theme.colors.light}}
            textStyle={{ color: 'white', fontSize: 18, padding: 3 }}
            onPress={() => setAnswerFn({ value: option, error: '' })}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Chip>
          )
          })
          : <></>
        }

      </View>

      {
        keyword == answer.value ?
        <Button mode="contained" onPress={nextGuess} style={{marginTop: 40}}>
          Next
        </Button> : 
        <Button mode="contained" style={{marginTop: 40}}
          disabled={true}>
          Next
        </Button>
      }
    </Background>
  )
}

const styles = StyleSheet.create({
  animalImg: {
    width: 250,
    height: 250,
    marginTop: 20,
    marginBottom: 30,
    margin: 10,
    objectFit: 'contain'
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
