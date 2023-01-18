import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, Dimensions } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import AnimalImg from '../components/AnimalImg'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Logger from '../logger'
import { Canvas, Circle, Rect, Skia, SkImage, useCanvasRef, Image, Path } from '@shopify/react-native-skia'
import { GestureManager } from '../handler'
import { Gesture } from 'react-native-gesture-handler'
import { ICircle, IPath, IStamp } from '../interfaces'
import { getTempURI } from '../storage'

export default function GuessAnimalScreen({ navigation }:any) {

  const animals = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Clam",
    "Cobra",
    "Cockroach",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goldfinch",
    "Goldfish",
    "Goose",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Gull",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ibex",
    "Ibis",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Kingfisher",
    "Koala",
    "Kookabura",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Mandrill",
    "Mantis",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Mongoose",
    "Monkey",
    "Moose",
    "Mosquito",
    "Mouse",
    "Mule",
    "Narwhal",
    "Newt",
    "Nightingale",
    "Octopus",
    "Okapi",
    "Opossum",
    "Oryx",
    "Ostrich",
    "Otter",
    "Owl",
    "Oyster",
    "Panther",
    "Parrot",
    "Partridge",
    "Peafowl",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Pig",
    "Pigeon",
    "Pony",
    "Porcupine",
    "Porpoise",
    "Quail",
    "Quelea",
    "Quetzal",
    "Rabbit",
    "Raccoon",
    "Rail",
    "Ram",
    "Rat",
    "Raven",
    "Reindeer",
    "Rhinoceros",
    "Rook",
    "Salamander",
    "Salmon",
    "Sandpiper",
    "Sardine",
    "Scorpion",
    "Seahorse",
    "Seal",
    "Shark",
    "Sheep",
    "Shrew",
    "Skunk",
    "Snail",
    "Snake",
    "Sparrow",
    "Spider",
    "Spoonbill",
    "Squid",
    "Squirrel",
    "Starling",
    "Stingray",
    "Stinkbug",
    "Stork",
    "Swallow",
    "Swan",
    "Tapir",
    "Tarsier",
    "Termite",
    "Tiger",
    "Toad",
    "Trout",
    "Turkey",
    "Turtle",
    "Viper",
    "Vulture",
    "Wallaby",
    "Walrus",
    "Wasp",
    "Weasel",
    "Whale",
    "Wildcat",
    "Wolf",
    "Wolverine",
    "Wombat",
    "Woodcock",
    "Woodpecker",
    "Worm",
    "Wren",
    "Yak",
    "Zebra"
  ]

  const [answer, setAnswer] = useState({ value: '', error: '' })
  // const [password, setPassword] = useState({ value: '', error: '' })
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [image, setImage] = useState<any>();
  const [paths, setPaths] = useState<IPath[]>([]);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [stamps, setStamps] = useState<IStamp[]>([]);
  const ref = useCanvasRef();

  const checkAnswer = () => {
    if(answer.value != keyword && answer.value != keyword.toLowerCase()) {
      setAnswer({ ...answer, error: 'Wrong answer, please try again!' })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'CorrectAnswerScreen' }],
    })
  }


  const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

  function getStatus() {
    const interval = setInterval(() => setStatus(Logger.getLog()), 500);
    return () => {
      clearInterval(interval);
    };
  }

  const pan = Gesture.Pan()
  .runOnJS(true);

  const tap = Gesture.Tap()
    .runOnJS(true);

  const gm = new GestureManager({ pan, tap }, paths, setPaths, stamps, setStamps, circles, setCircles);

  async function play(keyword: string) {
    await delay(2000)
    // console.log(Skia)
    Logger.setLog('Getting Image')
    setKeyword(keyword)
    gm.playPrompt(ref.current as any, keyword).then(async ({res, prompt}:any) => {
      //gm.canvas?.drawImage(img, 0,0);
      try {

        Logger.setLog('Saving to Temp')
        const S3_URL = await getTempURI(res)
        console.log('S3_URL', S3_URL)
        Logger.setLog('Saved to Temp')

        setImage(S3_URL);

        Logger.setLog('Drawing Image on Canvas')
        Logger.setLog('')
      } catch(e) {
        Logger.setLog('Error: Failed to draw image.')
      }

    });
  }

  async function start() {
    const keyword = animals[Math.floor(Math.random() * animals.length)];
    console.log(keyword)
    setKeyword(keyword)
    await play(keyword)
  }

  useEffect(() => {
    getStatus()
    if(!image && !status && !keyword) {
      console.log(image, status, keyword)
      // setStatus('')
      // Logger.setLog(`Drawing ${keyword}`)
      start()
    }
  });

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('GuessSelectScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      {/* <Logo /> */}
      <Header>What is this Animal?</Header>

      {image ? 
      <ImageVan
        style={styles.animalImg}
        source={{'uri': image}}
      /> :
      <Text style={{paddingTop: 100, paddingBottom: 100}}>Loading ...</Text>
      }

      <Paragraph>Enter your answer below.</Paragraph>
      <TextInput
        label="Answer"
        returnKeyType="next"
        value={answer.value}
        onChangeText={(text:any) => setAnswer({ value: text, error: '' })}
        error={!!answer.error}
        errorText={answer.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="answer"
        keyboardType="text"
      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button mode="contained" onPress={checkAnswer}>
        Submit
      </Button>
      {/* <Button
        mode="outlined"
        onPress={() => navigation.navigate('ModeScreen')}
      >
        Next
      </Button> */}
      {/* <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View> */}
    </Background>
  )
}

const styles = StyleSheet.create({
  animalImg: {
    width: 250,
    height: 250,
    marginBottom: 20,
    margin: 10,
    objectFit: 'contain'
  },
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
