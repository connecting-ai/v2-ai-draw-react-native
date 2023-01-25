import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Image as ImageVan, ScrollView, Dimensions } from 'react-native'
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
  selectedList: [{ _id: '1', value: 'asset' }] })
  const [negative_prompt, setNegativePrompt] = useState({ value: 'ugly, contrast, 3D', error: '' })
  const [num_inference_steps, setNumInterfaceSteps] = useState({ value: '20', error: '' })
  const [cut_inner_tol, setCutInnerTol] = useState({ value: '7', error: '' })
  const [cut_outer_tol, setCutOuterTol] = useState({ value: '35', error: '' })
  const [cut_radius, setCutRadius] = useState({ value: '70', error: '' })
  const [sd_seed, setSdSeed] = useState({ value: '1024', error: '' })

  const submit = () => {

    const isNumber = (x: any) => {
    
      x = parseFloat(x)
  
      // check if the passed value is a number
      if(typeof x == 'number' && !isNaN(x)){
      
          // check if it is integer
          if (Number.isInteger(x)) {
              return true
          }
          else {
              return true
          }
      
      } else {
          return false
      }
    }

    const keywordsValidator = (value: any) => {
      if (!value) return "Keywords can't be empty."
      return ''
    }
    const reqTypeValidator = (value: any) => {
      if (!value) return "Request type can't be empty."
      return ''
    }
    const strengthValidator = (value: any) => {
      if (!value) return "Strength can't be empty."
      else if(!isNumber(value)) return "Strength can't be string, please enter a number."
      return ''
    }
    const guidanceScaleValidator = (value: any) => {
      if (!value) return "Guidance scale can't be empty."
      else if(!isNumber(value)) return "Guidance scale can't be string, please enter a number."
      return ''
    }
    const numInterfaceStepsValidator = (value: any) => {
      if (!value) return "Num Interface steps can't be empty."
      else if(!isNumber(value)) return "Num Interface steps can't be string, please enter a number."
      return ''
    }
    const cutInnerTolValidator = (value: any) => {
      if (!value) return "Cut Inner Tol can't be empty."
      else if(!isNumber(value)) return "Cut Inner Tol can't be string, please enter a number."
      return ''
    }
    const cutOuterTolValidator = (value: any) => {
      if (!value) return "Cut Outer Tol can't be empty."
      else if(!isNumber(value)) return "Cut Outer Tol can't be string, please enter a number."
      return ''
    }
    const cutRadiusValidator = (value: any) => {
      if (!value) return "Cut Radius can't be empty."
      else if(!isNumber(value)) return "Cut Radius can't be string, please enter a number."
      return ''
    }
    const sdSeedValidator = (value: any) => {
      if (!value) return "SD Seed can't be empty."
      else if(!isNumber(value)) return "SD Seed can't be string, please enter a number."
      return ''
    }

    const keywordsError = keywordsValidator(keywords.value)
    const reqTypeError = reqTypeValidator(req_type.value)
    const strengthError = strengthValidator(strength.value)
    const guidanceScaleError = guidanceScaleValidator(guidance_scale.value)
    const numInterfaceStepsError = numInterfaceStepsValidator(num_inference_steps.value)
    const cutInnerTolError = cutInnerTolValidator(cut_inner_tol.value)
    const cutOuterTolError = cutOuterTolValidator(cut_outer_tol.value)
    const cutRadiusError = cutRadiusValidator(cut_radius.value)
    const sdSeedError = sdSeedValidator(sd_seed.value)

    if (keywordsError || reqTypeError || strengthError || 
      guidanceScaleError || numInterfaceStepsError || cutInnerTolError || 
      cutOuterTolError || cutRadiusError || sdSeedError
      ) {
      setKeywords({ ...keywords, error: keywordsError })
      setReqType({ ...req_type, error: reqTypeError })
      setStrength({ ...strength, error: strengthError })
      setGuidanceScale({ ...guidance_scale, error: guidanceScaleError })
      setNumInterfaceSteps({ ...num_inference_steps, error: numInterfaceStepsError })
      setCutInnerTol({ ...cut_inner_tol, error: cutInnerTolError })
      setCutOuterTol({ ...cut_outer_tol, error: cutOuterTolError })
      setCutRadius({ ...cut_radius, error: cutRadiusError })
      setSdSeed({ ...sd_seed, error: sdSeedError })
      return
    } else {
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
      style={{width: Dimensions.get('window').width, paddingLeft: 40, paddingRight: 40}}
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
