import {Buffer} from 'buffer'
import * as AWS from 'aws-sdk';
import uuid from 'react-native-uuid';
import { AWS_ACCESS_ID, AWS_SECRET_KEY, AWS_BUCKET, AWS_REGION } from "../constants";

export async function uploadToS3(res: any) {

    AWS.config.update({ accessKeyId: AWS_ACCESS_ID, secretAccessKey: AWS_SECRET_KEY, region: AWS_REGION });
    const s3 = new AWS.S3();
    const base64Data = Buffer.from(res.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = res.split(';')[0].split('/')[1];
  
    const id = uuid.v4();
  
    const params = {
      Bucket: AWS_BUCKET,
      Key: `${id}.${type}`, // type is not required
      Body: base64Data,
      ACL: 'public-read',
    //   ContentEncoding: 'base64', // required
      ContentType: `image/${type}` // required. Notice the back ticks
    }
  
    let location = '';
    let key = '';
  
    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
        console.log('AWS error', error)
    }

    return location
}