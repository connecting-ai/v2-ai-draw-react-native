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
import DoodleModule from './DoodleModule'
import { saveToAppDir } from "../storage";

export default function DoodleScreen({ navigation, route }:any) {
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

  function getStatus() {
    const interval = setInterval(() => setStatus(Logger.getLog()), 500);
    return () => {
      clearInterval(interval);
    };
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

    let drawing = []
    for (const item of paths) {
        let stroke = []
        let strokeX = []
        let strokeY = []
        for(const pixel of item.segments) {
            let xyAxis = pixel.split(' ')
            strokeX.push(xyAxis[1])
            strokeY.push(xyAxis[2])
        }
        stroke.push(strokeX)
        stroke.push(strokeY)
        drawing.push(stroke)
    }


    Logger.setLog('Saving...')
    const image = ref?.current?.makeImageSnapshot();
    const dataUrl = image.encodeToBase64();

    const url = await saveToAppDir(dataUrl)
    // Logger.setLog('Doodle Saved!')
    clear()

    navigation.reset({
      index: 0,
      routes: [{ name: 'ExportAnswerScreen', params:{ image: url, drawing: drawing} }],
    })
  }

  useEffect(() => {
    getStatus()
  })

  return (
    <DoodleModule 
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
