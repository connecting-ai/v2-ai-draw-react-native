import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';

export async function getTempURI(res: any) {

  const base64Code = res.split("data:image/png;base64,")[1];
  const id = uuid.v4();
  const type = res.split(';')[0].split('/')[1];

  const fileUri = FileSystem.documentDirectory + `${id}.${type}`;
  await FileSystem.writeAsStringAsync(fileUri, base64Code, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri
}