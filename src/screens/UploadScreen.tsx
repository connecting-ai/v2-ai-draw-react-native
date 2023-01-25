import React, { useEffect, useState } from "react";
import {
  Gesture,
} from "react-native-gesture-handler";
import {
  Skia,
  SkImage,
} from "@shopify/react-native-skia";
import { ICircle, IPath, IStamp, Tools } from "../interfaces";
import { GestureManager } from "../handler";
import Logger from '../logger'
import DrawModule from './DrawModule'

export default function DrawScreen({ navigation, route }:any) {
  const [status, setStatus] = useState('');

  const [paths, setPaths] = useState<IPath[]>([]);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [stamps, setStamps] = useState<IStamp[]>([]);
  const [image, setImage] = useState<SkImage>();
  const [deleted, setDeleted] = useState(false);
  const [color, setColor] = useState('black');
  const [firstImage, setFirstImage] = useState<any>();
  
  const pan = Gesture.Pan().runOnJS(true);
  const tap = Gesture.Tap().runOnJS(true);

  const gestureManager = new GestureManager({ pan, tap }, paths, setPaths, stamps, setStamps, circles, setCircles);

  gestureManager.setTool(Tools.Pencil);
  gestureManager.setColor(color);

  const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

  function getStatus() {
    const interval = setInterval(() => setStatus(Logger.getLog()), 500);
    return () => {
      clearInterval(interval);
    };
  }

  function setFirstImageFn() {
    if(route && route.params && route.params.firstImage) {
      setFirstImage(route.params.firstImage)
    }
  }

  const clear = () =>{
    setPaths([]);
    setImage(undefined as any);
    setDeleted(true)
    Logger.setLog('')
  }

  const resetImage = async () =>{
    setPaths([]);
    const skdata = await Skia.Data.fromURI(firstImage)
    const image = Skia.Image.MakeImageFromEncoded(skdata) as SkImage;
    setImage(image);
    Logger.setLog('Drawing Image on Canvas')
    Logger.setLog('')
  }

  const play = async (ref: any) => {
    Logger.setLog('Loading...')
    try {
      Logger.setLog('Getting Prompt')
      const prompt = await gestureManager.getPrompt(ref.current);
      if(prompt && prompt.length) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SettingsScreen', params:{ prompt: prompt[0], firstImage: firstImage} }],
        })
      }
      else {
        Logger.setLog('Error: Invalid Prompt')
      }
    } catch(e) {
      Logger.setLog('Error: Prompt Request Failed')
    }
  }

  const drawImage = async () => {

    await delay(2000)
    setFirstImageFn()

    const fromSettingScreen = route && route.params && route.params.keywords && !image
    
    if(fromSettingScreen) {
      Logger.setLog('Getting Image')
      try {
        const fileURI = await gestureManager.getAiGeneratedImage(route.params.keywords, route.params)
        if(fileURI) {
          if(!route.params.firstImage) {
            Logger.setLog('Saving First Image URI')
            setFirstImage(fileURI);
          }
          Logger.setLog('Converting URI to Image')
          const skdata = await Skia.Data.fromURI(fileURI)
          const image = Skia.Image.MakeImageFromEncoded(skdata) as SkImage;
          setImage(image);
          Logger.setLog('Drawing Image on Canvas')
          Logger.setLog('')
        } else {
          Logger.setLog('Error: Invalid Image URI')
        }
      } catch (e) {
        Logger.setLog('Error: Image fetch request failed.')
      }
    }
    else {
      Logger.setLog('')
    }
  }

  async function drawImageFromUpload() {
    Logger.setLog('Loading...')
    await delay(2000)
      let image = route.params.image
      try {
        const fileURI = await gestureManager.getAiGeneratedImageFromUpload(image)
        if(fileURI) {
          if(!route.params.firstImage) {
            Logger.setLog('Saving First Image URI')
            setFirstImage(fileURI);
          }
          Logger.setLog('Drawing Image on Canvas')
          const skdata = await Skia.Data.fromURI(fileURI)
          const image = Skia.Image.MakeImageFromEncoded(skdata) as SkImage;
          setPaths([]);
          setImage(image);
          Logger.setLog('')
        } else {
          Logger.setLog('Error: Invalid Image URI.')
        }
      } catch (e) {
        Logger.setLog('Error: Failed to fetch image.')
      }
  }

  useEffect(() => {
    getStatus()
    const fromSettingScreen = !deleted && !image && !status && route && route.params && route.params.keywords
    const fromUploadInputScreen = !deleted && !image && !status && route && route.params && route.params.image
    if(fromSettingScreen) {
      Logger.setLog('Drawing Image')
      drawImage()
    } else if(fromUploadInputScreen) {
      drawImageFromUpload()
    }
  })

  return (
    <DrawModule 
      gestureManager={gestureManager} 
      navigation={navigation} 
      image={image} 
      paths={paths} 
      color={color} 
      status={status} 
      setColor={setColor} 
      clear={clear} 
      resetImage={resetImage} 
      play={play}
    />
  );
}
