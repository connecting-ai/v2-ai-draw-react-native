import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, ScrollView } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
// import TextInput from '../components/TextInput'
import TextInput from '../components/TextInputForm'
import { theme } from '../core/theme'
import Paragraph from '../components/Paragraph'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { PaperSelect } from 'react-native-paper-select';

export default function ColorObjSelectScreen({ navigation, route }:any) {
  const [keywords, setKeywords] = useState({ value: route.params.prompt, error: '' })
  const [strength, setStrength] = useState({ value: '0.85', error: '' })
  const [guidance_scale, setGuidanceScale] = useState({ value: '7.5', error: '' })
  const [req_type, setReqType] = useState({ value: 'asset', error: '', 
  list: [
    { _id: '1', value: 'asset' },
    { _id: '2', value: 'tile' },
    { _id: '3', value: 'none' },
  ],
  selectedList: [] })
  const [negative_prompt, setNegativePrompt] = useState({ value: 'ugly, contrast, 3D', error: '' })
  const [num_inference_steps, setNumInterfaceSteps] = useState({ value: '20', error: '' })
  const [cut_inner_tol, setCutInnerTol] = useState({ value: '7', error: '' })
  const [cut_outer_tol, setCutOuterTol] = useState({ value: '35', error: '' })
  const [cut_radius, setCutRadius] = useState({ value: '70', error: '' })
  const [sd_seed, setSdSeed] = useState({ value: '1024', error: '' })

  const submit = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'DrawScreen',
          params: {
            keywords: keywords.value, 
            strength: strength.value, 
            guidance_scale: guidance_scale.value, 
            req_type: req_type.value, 
            negative_prompt: negative_prompt.value, 
            num_inference_steps: num_inference_steps.value, 
            cut_inner_tol: cut_inner_tol.value, 
            cut_outer_tol: cut_outer_tol.value, 
            cut_radius: cut_radius.value, 
            sd_seed: sd_seed.value, 
            firstImage: route.params.firstImage
          } 
        }],
    })
  }

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.navigate('ModeScreen')}
          style={styles.container}>
          <ImageVan
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
      </TouchableOpacity>
      <Logo />
      <Header>Settings</Header>
      {/* <AnimalImg name="horse"/> */}
      <Paragraph>Edit fields given below as per your need.</Paragraph>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
      <PaperSelect
        label="Select Request Type"
        value={req_type.value}
        onSelection={(value: any) => {
          setReqType({
            ...req_type,
            value: value.text,
            selectedList: value.selectedList,
            error: '',
          });
        }}
        arrayList={[...req_type.list]}
        selectedArrayList={[...req_type.selectedList]}
        errorText={req_type.error}
        multiEnable={false}
      />
      <TextInput
        label="Prompt (Keywords)"
        returnKeyType="next"
        value={keywords.value}
        onChangeText={(text:any) => setKeywords({ value: text, error: '' })}
        error={!!keywords.error}
        errorText={keywords.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="prompt"
        keyboardType="text"
      />
      <TextInput
        label="Strength (0 - 1)"
        returnKeyType="next"
        value={strength.value}
        onChangeText={(text:any) => setStrength({ value: text, error: '' })}
        error={!!strength.error}
        errorText={strength.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="strength"
        keyboardType="number"
      />
      <TextInput
        label="Guidance Scale"
        returnKeyType="next"
        value={guidance_scale.value}
        onChangeText={(text:any) => setGuidanceScale({ value: text, error: '' })}
        error={!!guidance_scale.error}
        errorText={guidance_scale.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="guidance_scale"
        keyboardType="text"
      />
      <TextInput
        label="Negative Prompt"
        returnKeyType="next"
        value={negative_prompt.value}
        onChangeText={(text:any) => setNegativePrompt({ value: text, error: '' })}
        error={!!negative_prompt.error}
        errorText={negative_prompt.error}
        autoCapitalize="none"
        autoCompleteType="text"
        textContentType="negative_prompt"
        keyboardType="text"
      />
      <TextInput
        label="Num Interface Steps"
        returnKeyType="next"
        value={num_inference_steps.value}
        onChangeText={(text:any) => setNumInterfaceSteps({ value: text, error: '' })}
        error={!!num_inference_steps.error}
        errorText={num_inference_steps.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="num_inference_steps"
        keyboardType="number"
        type="number"
      />
      <TextInput
        label="Cut Inner Tol"
        returnKeyType="next"
        value={cut_inner_tol.value}
        onChangeText={(text:any) => setCutInnerTol({ value: text, error: '' })}
        error={!!cut_inner_tol.error}
        errorText={cut_inner_tol.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="cut_inner_tol"
        keyboardType="number"
      />
      <TextInput
        label="Cut Outer Tol"
        returnKeyType="next"
        value={cut_outer_tol.value}
        onChangeText={(text:any) => setCutOuterTol({ value: text, error: '' })}
        error={!!cut_outer_tol.error}
        errorText={cut_outer_tol.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="cut_outer_tol"
        keyboardType="number"
      />
      <TextInput
        label="Cut Radius"
        returnKeyType="next"
        value={cut_radius.value}
        onChangeText={(text:any) => setCutRadius({ value: text, error: '' })}
        error={!!cut_radius.error}
        errorText={cut_radius.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="cut_radius"
        keyboardType="number"
      />
      <TextInput
        label="SD Seed"
        returnKeyType="next"
        value={sd_seed.value}
        onChangeText={(text:any) => setSdSeed({ value: text, error: '' })}
        error={!!sd_seed.error}
        errorText={sd_seed.error}
        autoCapitalize="none"
        autoCompleteType="number"
        textContentType="sd_seed"
        keyboardType="number"
      />
      </ScrollView>
      <Button mode="contained" onPress={submit}>
        Submit
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
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
