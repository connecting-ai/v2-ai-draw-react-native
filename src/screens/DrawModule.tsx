import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Image as ImageVan } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Canvas,
  Circle,
  Path,
  Drawing,
  Image,
  Group,
  Rect,
  useCanvasRef,
  SkiaValue,
  Color
} from "@shopify/react-native-skia";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Tools } from "../interfaces";
import Header from "../components/Header";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function DrawModule({ navigation, gestureManager, circles, image, paths, status, color, setColor, clear, resetImage, play, ...props }:any) {

    const { width, height } = Dimensions.get("window");
    const ref = useCanvasRef();
    const paletteVisible = useSharedValue(false);
    const animatedPaletteStyle = useAnimatedStyle(() => {
        return {
          top: withSpring(paletteVisible.value ? -275 : -100),
          height: withTiming(paletteVisible.value ? 200 : 50),
          opacity: withTiming(paletteVisible.value ? 100 : 0, { duration: 100 }),
        };
      });
    const paletteColors = ["red", "green", "blue", "yellow", "black"];
    // const [color, setColor] = useState('black');
    const animatedSwatchStyle = useAnimatedStyle(() => {
        return {
          top: withSpring(paletteVisible.value ? -50 : 0),
          height: paletteVisible.value ? 0 : 50,
          opacity: withTiming(paletteVisible.value ? 0 : 100, { duration: 100 }),
        };
    });
    const [activeTool, setActiveTool] = useState<Tools>(Tools.Pencil);

    async function playFn() {
        await play(ref)
    }

    return (
    <>
        <TouchableOpacity onPress={() => {navigation.navigate('ModeScreen'); clear()}}
        style={styles.container}>
        <ImageVan
        style={styles.image}
        source={require('../assets/arrow_back.png')}
        />
        </TouchableOpacity>
        <GestureHandlerRootView>
        <View style={{ height, width }}>
            <GestureDetector gesture={gestureManager.tap}>
            <GestureDetector gesture={gestureManager.pan}>
                <Canvas ref={ref} style={{ flex: 8 }} >
                <Rect x={0} y={0} width={Dimensions.get('window').width} height={Dimensions.get('window').height} color="white" />
                {circles && circles.map((c: { x: number | SkiaValue<number>; y: number | SkiaValue<number>; }, index: React.Key | null | undefined) => (
                    <Circle key={index} cx={c.x} cy={c.y} r={10} />
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
                {paths.map((p: { segments: any[]; color: Color | SkiaValue<Color | undefined> | undefined; }, index: React.Key | null | undefined) => (
                    <Path
                    key={index}
                    path={p.segments.join(" ")}
                    strokeWidth={5}
                    style="stroke"
                    color={p.color}
                    />
                ))}
                <Group blendMode="multiply">
                    <Drawing
                    drawing={({ canvas, paint }) => {
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
                        gestureManager.setColor(paletteColors[i]);
                        setColor(paletteColors[i]);
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
                        backgroundColor: color,
                        },
                        styles.swatch,
                        animatedSwatchStyle,
                    ]}
                    />
                </TouchableOpacity>
                <View>
                    {activeTool === Tools.Pencil ? (
                    <TouchableOpacity
                        onPress={() => gestureManager.setTool(Tools.Stamp)}
                    >
                        <FontAwesome5
                        name="pencil-alt"
                        style={styles.icon}
                        ></FontAwesome5>
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity
                        onPress={() => gestureManager.setTool(Tools.Pencil)}
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

                <TouchableOpacity onPress={resetImage}>
                    <Ionicons
                    name="md-reload"
                    style={styles.icon}
                    ></Ionicons>
                </TouchableOpacity>

                <TouchableOpacity >
                    <Ionicons
                    name="md-play"
                    onPress={playFn}
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
  )
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
      left: 16,
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