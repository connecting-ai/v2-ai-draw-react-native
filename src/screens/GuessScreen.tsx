import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, Dimensions, Vibration, Text, KeyboardAvoidingView } from 'react-native'
import Button from '../components/Button'
import ButtonHeader from '../components/ButtonHeader'
import { theme } from '../core/theme'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Logger from '../logger'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Chip } from 'react-native-paper';
import axios from "axios";
import { QUICK_DRAW_URL, WORDS_ASSOCIATION_API } from "../constants";
// @ts-ignore
import { AnimatedSVGPaths } from "react-native-svg-animations";

export default function GuessScreen({ navigation }:any) {

  const [answer, setAnswer] = useState({ value: '', error: '' })
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);

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
    setFetching(false);
    setStatus('');
    setAnswer({ value: '', error: '' });
    setPaths([]);
    setKeyword('');
    setFetching(false);
    setOptions([]);
    Logger.setLog('')
  }

  function setAnswerFn(val: any) {
    setAnswer(val)
    if(val.value != keyword) {
      Vibration.vibrate()
    }
  }

  async function getGuess() {
    clear()
    setFetching(true)

    try {
      Logger.setLog('Loading ...')
      const { data } = await axios.post(QUICK_DRAW_URL)
      Logger.setLog('Drawing Image ...')
      let item = data.output

      let path = []

      for(const strokes of item.drawing) {
        let letter = 'M'
        let stroke = ''
        for(const i in strokes[0]) {
          let str = `${letter}${strokes[0][i]},${strokes[1][i]}`
          letter = 'L'
          stroke += str
        }
        path.push(stroke)
      }


      try {
        Logger.setLog('Fetching options ...')

        const { data } = await axios.get(`${WORDS_ASSOCIATION_API}${item.word}`)
        let res = data.response[0].items.filter((x: { pos: string }) => x.pos == 'noun')
        let options = [
          item.word, res[0].item, res[1].item
        ]
        let shuffledOptions = options
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

        setAnswer({ value: '', error: '' })
        setKeyword(item.word)
        setPaths(path)
        setOptions(shuffledOptions)
        Logger.setLog('')
        setFetching(false)

      } catch (e) {
        console.log('Err', e)
        Logger.setLog('Error: Failed to fetch options.')      
      }

    } catch (e) {
      console.log('Err', e)
      Logger.setLog('Error: Failed to fetch drawing.')
    }
  }

  useEffect(() => {
    getStatus()
    if(!paths.length && !status && !fetching && !keyword) {
      getGuess()
    }

  });

  return (
    <KeyboardAvoidingView style={styles.containerBg} behavior="padding">
      <TouchableOpacity onPress={() => {navigation.navigate('ModeScreen'); clear()}}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <ButtonHeader mode="text" style={styles.header} compact={true}>
        What is this?
      </ButtonHeader>
      {/* <Logo /> */}
      <GestureHandlerRootView>
      { status && !paths.length ?
        <View style={styles.status}>
          <Text style={{textAlign: 'center'}}>{status}</Text>
        </View> 
        :
        <View style={styles.animalImg}>
            <AnimatedSVGPaths
              strokeColor={"black"}
              duration={8000}
              strokeWidth={5}
              scale={.9}
              delay={0}
              ds={paths}
              loop={false}
            />
        </View>
      }
      </GestureHandlerRootView>

      {
        options && options.length?
        <Paragraph>Select your answer.</Paragraph>
        : <Paragraph></Paragraph>
      }

      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center'}}>

        {
          options && options.length?
          options.map((option: string, index) => {
            return (
            <Chip
            key={index}
            style={{
              margin: 4, 
              backgroundColor: option == keyword && answer.value == option ? 'green' : answer.value == option ? theme.colors.error : theme.colors.light
            }}
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
        keyword && keyword == answer.value ?
        <Button mode="contained" onPress={nextGuess} style={styles.nextButton}>
          Next
        </Button> : 
        <Button mode="contained" style={styles.nextButton}
          disabled={true}>
          Next
        </Button>
      }
    </KeyboardAvoidingView>      
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
  containerBg: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  animalImg: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 100,
    height: Dimensions.get('window').width - 100,
    marginTop: 20,
    marginBottom: 30,
    margin: 10,
    objectFit: 'contain'
  },
  status: {
    justifyContent: 'center',
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
