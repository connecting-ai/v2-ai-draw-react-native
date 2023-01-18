import { SkCanvas, SkImage, SkiaView, SkPaint , useImage, Image} from "@shopify/react-native-skia";
import { Tools } from "./interfaces";
import axios from "axios";
import { CLIP_URL, STABLE_DIFFUSION_URL } from "./constants";
import { b64toBlob } from "./helpers";
// import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';
import Logger from './logger'
  
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

    async play(ref: SkiaView){
      console.log('Play clicked');
      Logger.setLog('Loading...')
      Logger.setLog('Getting Prompt')
      try {
        const prompt = await this.getPrompt(ref) as any;
        console.log('prompt', prompt)
        Logger.setLog(`Seems like ${prompt[0]}`)
        return {res: null, prompt};
      } catch(e) {
        Logger.setLog('Error: Prompt Request Failed')
      }
    }

    async playPrompt(ref: SkiaView, keyword: string){
      console.log('Play clicked');
      Logger.setLog('Loading...')
      // const prompt = await this.getPrompt(ref) as any;
      // console.log('prompt', prompt)
      // const image = ref?.makeImageSnapshot();
      // const image = true
      // if (image) {     
        // Logger.setLog('Getting dataURL')     
        // const dataUrl = image.encodeToBase64();
        Logger.setLog('Fetched dataURL')
        Logger.setLog(`Seems like ${keyword}`)
        try {
          const response = await axios.post(
            STABLE_DIFFUSION_URL,
            {
              input: {
                input: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`,
                prompts: keyword,
                strength: .85,
                guidance_scale: 7.5,
                split: 'none',
                req_type: 'asset',
              },
            },
            {
              headers: { "Access-Control-Allow-Origin": "*" },
              responseType: 'json',
            }
          );
  
          const res = response.data.output.file[0][0]
          return {res, prompt:['', '']};
        } catch (e) {
          Logger.setLog('Error: Diffusion Request Failed')
        }
        // return {res, prompt};
      // }
  }

  async uploadPrompt(ref: SkiaView, uploadedImage: string){
    console.log('Play clicked');
    Logger.setLog('Running Play function')
    // const prompt = await this.getPrompt(ref) as any;
    // console.log('prompt', prompt)
    const image = uploadedImage

    // RNFS.readFile(uploadedImage, 'base64')
    // .then(res =>{
    //   console.log('res', res);
    // });
    // const base64 = await FileSystem.readAsStringAsync(uploadedImage, { encoding: 'base64' });
    // console.log(base64)

    // const image = ref?.makeImageSnapshot();

    if (image) {      
      Logger.setLog('Getting dataURL')
      try {
        const dataUrl = await FileSystem.readAsStringAsync(uploadedImage, { encoding: 'base64' });
        Logger.setLog('Fetched dataURL')
        Logger.setLog('Getting Prompt')
  
        let response1: any;
        try {
  
        response1 = await axios.post(
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
  
        console.log(response1.data.output);
        const prompt = [response1.data.output.prompt.split(',')[0], response1.data.output.prompt];
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
                req_type: 'asset',
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
        return {res, prompt:['', '']};

      } catch(e) {
        Logger.setLog('Error: dataURL conversion Failed')
      }
      // return {res, prompt};
    }

    Logger.setLog('Error: Image Not Found')
}
}



