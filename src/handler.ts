import { SkCanvas, SkiaView, SkPaint } from "@shopify/react-native-skia";
import { Tools } from "./interfaces";
import axios from "axios";
import { CLIP_URL, STABLE_DIFFUSION_URL } from "./constants";
import * as FileSystem from 'expo-file-system';
import Logger from './logger'
import { getTempURI } from "./storage";

export class GestureManager {
    activeTool = null
    setPaths:any;
    color:any;
    setCircles: any;
    setStamps: any;
    tap:any;
    pan:any;
    paint: SkPaint | undefined;
    canvas: SkCanvas | undefined;

    constructor({pan, tap}:any, paths:any, setPaths:any, stamps:any, setStamps:any, cricle:any, setCircles:any){
        this.setPaths = setPaths;
        this.setCircles = setCircles;
        this.setStamps = setStamps;

        this.pan = pan
        .onStart((g: any) => {
        if (this.activeTool === Tools.Pencil) {
            const newPaths = [...paths];
            newPaths[paths.length] = {
            segments: [],
            color: this.color,
            };
            newPaths[paths.length].segments.push(`M ${g.x} ${g.y}`);
            setPaths(newPaths);
        }
        })
        .onUpdate((g: any) => {
        if (this.activeTool === Tools.Pencil) {
            const index = paths.length - 1;
            const newPaths = [...paths];
            if (newPaths?.[index]?.segments) {
            newPaths[index].segments.push(`L ${g.x} ${g.y}`);
            setPaths(newPaths);
            }
        }
        })
        .onTouchesUp((g: any) => {
        if (this.activeTool === Tools.Pencil) {
            const newPaths = [...paths];
            setPaths(newPaths);
        }
        })
        .minDistance(1);



        this.tap = tap
        .onStart((g: any) => {
        if (this.activeTool === Tools.Stamp) {
            setStamps([
            ...stamps,
            {
                x: g.x - 25,
                y: g.y - 25,
                color: this.color,
            },
            ]);
        }
        });


    }

    clear(){
        this.setPaths([]);
        this.setCircles([]);
        this.setStamps([]);
    }

    setColor(color:any){
        this.color = color;
    }

    setTool(tool:any){
        this.activeTool = tool;
    }

    async getPrompt(ref: SkiaView){

        const image = ref?.makeImageSnapshot();
        if (image) {          
            const dataUrl = image.encodeToBase64();
        const response = await axios.post(
            CLIP_URL,
            {
              input: {
                input: `data:image/png;base64,${dataUrl}`,
                mode: 'best',
              },
            },
            {
              headers: { "Access-Control-Allow-Origin": "*" },
              responseType: 'json',
            }
          );

          console.log(response.data.output);
          return [response.data.output.prompt.split(',')[0], response.data.output.prompt];
        }
    }

    async getAiGeneratedImage(keyword: string, params: any = null) {

      let input;

      if(params) {
        const { strength, guidance_scale, req_type, negative_prompt, num_inference_steps, cut_inner_tol, cut_outer_tol, cut_radius, sd_seed } = params
        input = {
          input: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==`,
          prompts: keyword,
          strength: strength || .85,
          guidance_scale: guidance_scale || 7.5,
          split: 'none',
          req_type: req_type || 'asset',
          negative_prompt: negative_prompt || "ugly, contrast, 3D",
          num_inference_steps: num_inference_steps || 20, 
          cut_inner_tol: cut_inner_tol || 7, 
          cut_outer_tol: cut_outer_tol || 35, 
          cut_radius: cut_radius || 70, 
          sd_seed: sd_seed || 1024
        }
      } else {
        input = {
          input: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==`,
          prompts: keyword,
          strength: .85,
          guidance_scale: 7.5,
          split: 'none',
          req_type: 'asset',
          negative_prompt: "ugly, contrast, 3D",
          num_inference_steps: 20, 
          cut_inner_tol: 7, 
          cut_outer_tol: 35, 
          cut_radius: 70, 
          sd_seed: 1024
        }
      }

      console.log('Play clicked');
      Logger.setLog('Loading...')
      Logger.setLog('Fetched dataURL')
      Logger.setLog(`Seems like ${keyword}`)

      try {
        const response = await axios.post(
          STABLE_DIFFUSION_URL,
          {
            input: input,
          },
          {
            headers: { "Access-Control-Allow-Origin": "*" },
            responseType: 'json',
          }
        );

        const res = response.data.output.file[0][0]
        const url = await getTempURI(res)
        return url
      } catch (e) {
        Logger.setLog('Error: Diffusion Request Failed')
      }
  }

  async getAiGeneratedImageFromUpload(uploadedImage: string){
    Logger.setLog('Running Play function')

    const image = uploadedImage

    if (image) {      
      Logger.setLog('Getting dataURL')
      try {
        const dataUrl = await FileSystem.readAsStringAsync(uploadedImage, { encoding: 'base64' });
        Logger.setLog('Fetched dataURL')
        Logger.setLog('Getting Prompt')
  
        let prompt_response: any;
        try {
  
          prompt_response = await axios.post(
            CLIP_URL,
            {
              input: {
                input: `data:image/png;base64,${dataUrl}`,
                mode: 'best',
              },
            },
            {
              headers: { "Access-Control-Allow-Origin": "*" },
              responseType: 'json',
            }
          );
  
        } catch(e) {
          Logger.setLog('Error: Prompt Request Failed')
        }
  
        console.log(prompt_response.data.output);
        const prompt = [prompt_response.data.output.prompt.split(',')[0], prompt_response.data.output.prompt];
        Logger.setLog(`Seems like ${prompt[0]}`)
  
        let response: any
        try {
          response = await axios.post(
            STABLE_DIFFUSION_URL,
            {
              input: {
                input: `data:image/png;base64,${dataUrl}`,
                prompts: prompt[0],
                strength: .85,
                guidance_scale: 7.5,
                split: 'none',
                req_type: 'tile',
              },
            },
            {
              headers: { "Access-Control-Allow-Origin": "*" },
              responseType: 'json',
            }
          );
        } catch(e) {
          Logger.setLog('Error: Diffusion Request Failed')
          return
        }

        Logger.setLog(`Image fetched!`)
  
        const res = response.data.output.file[0][0]
        const url = await getTempURI(res)
        return url
      } catch(e) {
        Logger.setLog('Error: dataURL conversion Failed')
      }
    }

    Logger.setLog('Error: Image Not Found')
  }

  async getPromptFromUpload(uploadedImage: string){
    Logger.setLog('Running Play function')

    const image = uploadedImage

    if (image) {      
      Logger.setLog('Getting dataURL')
      try {
        const dataUrl = await FileSystem.readAsStringAsync(uploadedImage, { encoding: 'base64' });
        Logger.setLog('Fetched dataURL')
        Logger.setLog('Getting Prompt')
  
        let prompt_response: any;
        try {
  
          prompt_response = await axios.post(
            CLIP_URL,
            {
              input: {
                input: `data:image/png;base64,${dataUrl}`,
                mode: 'best',
              },
            },
            {
              headers: { "Access-Control-Allow-Origin": "*" },
              responseType: 'json',
            }
          );
  
        } catch(e) {
          Logger.setLog('Error: Prompt Request Failed')
        }
  
        return [prompt_response.data.output.prompt.split(',')[0], prompt_response.data.output.prompt];
      } catch(e) {
        Logger.setLog('Error: dataURL conversion Failed')
      }
    }

    Logger.setLog('Error: Image Not Found')
  }
}



