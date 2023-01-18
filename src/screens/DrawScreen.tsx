import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet, Button, Text, Platform, Alert, Image as ImageVan } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Canvas,
  Circle,
  Path,
  Skia,
  ImageSVG,
  useCanvasRef,
  Drawing,
  Image,
  SkImage,
  useDrawCallback,
  Group,
  SkiaView,
  Rect
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ICircle, IPath, IStamp, Tools } from "../interfaces";
import { GestureManager } from "../handler";
import BackButton from "../components/BackButton";
import Background from "../components/Background";
import Paragraph from "../components/Paragraph";
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Header from "../components/Header";
import Logger from '../logger'
import { getTempURI } from "../storage";


export default function DrawScreen({ navigation, route }:any) {
  const { width, height } = Dimensions.get("window");
  const [status, setStatus] = useState('');

  const paletteColors = ["red", "green", "blue", "yellow"];

  const svgStar =
    '<svg class="star-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" viewBox="0 0 200 200"><polygon id="star" fill="{{fillColor}}" points="100,0,129.38926261462365,59.54915028125263,195.10565162951536,69.09830056250526,147.55282581475768,115.45084971874736,158.77852522924732,180.90169943749473,100,150,41.2214747707527,180.90169943749476,52.447174185242325,115.45084971874738,4.894348370484636,69.09830056250527,70.61073738537632,59.549150281252636"></polygon></svg>';

  const [activePaletteColorIndex, setActivePaletteColorIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<Tools>(Tools.Pencil);
  const [paths, setPaths] = useState<IPath[]>([]);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [stamps, setStamps] = useState<IStamp[]>([]);
  const [image, setImage] = useState<SkImage>();
  const [deleted, setDeleted] = useState(false);
  const ref = useCanvasRef();
  const [prompt, setPrompt] = useState('');



  const pan = Gesture.Pan()
    .runOnJS(true);

  const tap = Gesture.Tap()
    .runOnJS(true);



  const gm = new GestureManager({ pan, tap }, paths, setPaths, stamps, setStamps, circles, setCircles);
  gm.setTool(Tools.Pencil);

  const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

  const play2 = async () => {
    await delay(2000)
    
    if(route && route.params && route.params.keywords && !image) {
      console.log('keywords', route.params.keywords)
      Logger.setLog('Getting Image')
      gm.playPrompt(ref.current as any, route.params.keywords).then(async ({res, prompt}:any) => {
        //gm.canvas?.drawImage(img, 0,0);
        try {
          
          Logger.setLog('Uploading to S3')
          const S3_URL = await getTempURI(res)
          console.log('S3_URL', S3_URL)
          Logger.setLog('Uploaded to S3')

          const skdata = await Skia.Data.fromURI(S3_URL)
          const image = Skia.Image.MakeImageFromEncoded(skdata) as SkImage;
          ref.current?.redraw();
          setImage(image);
          Logger.setLog('Drawing Image on Canvas')
          setPrompt(prompt[1]);
          Logger.setLog('')
        } catch(e) {
          Logger.setLog('Error: Image fetch request failed.')
          console.log(e)
        }
      });
    }
    else {
      Logger.setLog('')
    }
  }

  function getStatus() {
    const interval = setInterval(() => setStatus(Logger.getLog()), 500);
    return () => {
      clearInterval(interval);
    };
  }

  useEffect(() => {
    getStatus()
    if(!deleted && !image && !status && route && route.params && route.params.keywords) {
      setStatus('Drawing Image')
      Logger.setLog('Drawing Image')
      play2()
    }
  })


  const play = () => {
    Logger.setLog('Loading...')
    gm.play(ref.current as any).then(async ({res, prompt}:any) => {
      Logger.setLog('Getting Prompt')
      //gm.canvas?.drawImage(img, 0,0);
      // console.log('res')
      // try {
      //   const skdata = await Skia.Data.fromURI(res)
      //   console.log('skdata')
      // }
      // catch (e) {
      //   console.log('ERR', e)
      // }
      // const skdata = await Skia.Data.fromURI(res)
      // console.log('skdata')

      // const image = Skia.Image.MakeImageFromEncoded(skdata) as SkImage;
      // console.log('image')
      // ref.current?.redraw();
      // console.log('image 2')

      // setImage(image);
      setPrompt(prompt[1]);
      console.log(prompt)

      navigation.reset({
        index: 0,
        routes: [{ name: 'SettingsScreen', params:{ prompt: prompt[0]} }],
      })

      // Alert.prompt(prompt[0], prompt[1], [
      //   {
      //       onPress: str => console.log('Entered string: ' + str),
      //   },
      // ]
      // );
    });
  }

  const clear = () =>{
    setPaths([]);
    setImage(undefined as any);
    setDeleted(true)
  }


  const paletteVisible = useSharedValue(false);
  const animatedPaletteStyle = useAnimatedStyle(() => {
    return {
      top: withSpring(paletteVisible.value ? -275 : -100),
      height: withTiming(paletteVisible.value ? 200 : 50),
      opacity: withTiming(paletteVisible.value ? 100 : 0, { duration: 100 }),
    };
  });

  const animatedSwatchStyle = useAnimatedStyle(() => {
    return {
      top: withSpring(paletteVisible.value ? -50 : 0),
      height: paletteVisible.value ? 0 : 50,
      opacity: withTiming(paletteVisible.value ? 0 : 100, { duration: 100 }),
    };
  });

  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('ModeScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <GestureHandlerRootView>
        <View style={{ height, width }}>
          <GestureDetector gesture={gm.tap}>
            <GestureDetector gesture={gm.pan}>
              <Canvas ref={ref} style={{ flex: 8 }} >
                <Rect x={0} y={0} width={Dimensions.get('window').width} height={Dimensions.get('window').height} color="white" />
                {circles.map((c, index) => (
                  <Circle key={index} cx={c.x} cy={c.y} r={10} />
                ))}
                {paths.map((p, index) => (
                  <Path
                    key={index}
                    path={p.segments.join(" ")}
                    strokeWidth={5}
                    style="stroke"
                    color={p.color}
                  />
                ))}
                  {image && (
                  <Image
                    image={image}
                    fit="contain"
                    x={0}
                    y={0}
                    width={Dimensions.get('window').width}
                    height={Dimensions.get('window').height}
                  />
                )}
                <Group blendMode="multiply">
                  <Drawing
                    drawing={({ canvas, paint, ref }) => {
                      // if(image){
                      //   canvas.clear(Skia.Color('white'));
                      //   setPaths([]);
                      //   // canvas.drawImage(image,0,0);
                      //   //setImage(null as any);
                      // }
                    }}
                  />
                </Group>
              </Canvas>
            </GestureDetector>
          </GestureDetector>
          <View style={{ padding: 10, flex: 1, backgroundColor: "#edede9" }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Animated.View
                style={[
                  { padding: 10, position: "absolute", width: 60 },
                  animatedPaletteStyle,
                ]}
              >
                {paletteColors.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      // setActivePaletteColorIndex(i);
                      gm.setColor(paletteColors[i]);
                      paletteVisible.value = false;
                    }}
                  >
                    <View
                      style={[
                        {
                          backgroundColor: c,
                        },
                        styles.paletteColor,
                      ]}
                    ></View>
                  </TouchableOpacity>
                ))}
              </Animated.View>
              {status ?
                <View style={styles.statusContainer}>
                  <Header>Generating image, please wait ...</Header>
                  <Text>Status: {status}</Text>
                </View>
                :
              <View style={styles.swatchContainer}>
                <TouchableOpacity
                  onPress={() => {
                    paletteVisible.value !== true
                      ? (paletteVisible.value = true)
                      : (paletteVisible.value = false);
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        backgroundColor: paletteColors[activePaletteColorIndex],
                      },
                      styles.swatch,
                      animatedSwatchStyle,
                    ]}
                  />
                </TouchableOpacity>
                <View>
                  {activeTool === Tools.Pencil ? (
                    <TouchableOpacity
                      onPress={() => gm.setTool(Tools.Stamp)}
                    >
                      <FontAwesome5
                        name="pencil-alt"
                        style={styles.icon}
                      ></FontAwesome5>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => gm.setTool(Tools.Pencil)}
                    >
                      <FontAwesome5
                        name="stamp"
                        style={styles.icon}
                      ></FontAwesome5>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={clear}>
                  <Ionicons
                    name="md-trash-outline"
                    style={styles.icon}
                  ></Ionicons>
                </TouchableOpacity>

                <TouchableOpacity >
                  <Ionicons
                    name="md-play"
                    onPress={play}
                    style={styles.icon}
                  ></Ionicons>
                </TouchableOpacity>


              </View>
              }
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 15
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
  icon: {
    fontSize: 40,
    textAlign: "center",
  },
  paletteColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 5,
    zIndex: 2,
  },
  swatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "black",
    marginVertical: 5,
    zIndex: 1,
  },
  swatchContainer: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
