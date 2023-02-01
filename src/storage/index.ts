import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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

export async function saveToAppDir(res: any) {

  const base64Code = res;
  const id = uuid.v4();
  const type = 'png';
  const exportablesDir = 'exportables/'

  const exportablesDirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + exportablesDir);
  const isDir = exportablesDirInfo.isDirectory;
  if (!isDir) {
    console.log('Directory not found!')
    try {
      await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + exportablesDir,
          { intermediates: true }
      );
      console.log('Directory created!')
    } catch (e) {
      console.info("Error: ", e);
    }
  }

  const fileUri = FileSystem.documentDirectory + exportablesDir + `${id}.${type}`;
  await FileSystem.writeAsStringAsync(fileUri, base64Code, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri
}

export async function deleteExportableJSON() {
  const exportablesDir = 'exportables/'
  const fileUri = FileSystem.documentDirectory + exportablesDir + `exportables.json`;

  await FileSystem.deleteAsync(fileUri)
}

export async function saveJSONToAppDir(data: any) {

  const exportablesDir = 'exportables/'

  const exportablesDirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + exportablesDir);
  const isDir = exportablesDirInfo.isDirectory;
  if (!isDir) {
    console.log('Directory not found!')
    try {
      await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + exportablesDir,
          { intermediates: true }
      );
      console.log('Directory created!')
    } catch (e) {
      console.info("Error: ", e);
    }
  }

  const fileUri = FileSystem.documentDirectory + exportablesDir + `exportables.json`;
  const exportablesJSONInfo = await FileSystem.getInfoAsync(fileUri);

  if(exportablesJSONInfo.exists) {
    console.log('exists')
    const response = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    let updated = JSON.parse(response)
    updated.push(data)
    let updatedString = JSON.stringify(updated)
    await FileSystem.writeAsStringAsync(fileUri, updatedString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } else {
    console.log('not exists')
    let updated = []
    updated.push(data)
    let updatedString = JSON.stringify(updated)
    await FileSystem.writeAsStringAsync(fileUri, updatedString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }

  return fileUri
}

export async function readExportableJSON() {
  const exportablesDir = 'exportables/'
  const fileUri = FileSystem.documentDirectory + exportablesDir + `exportables.json`;
  const exportablesJSONInfo = await FileSystem.getInfoAsync(fileUri);

  if(exportablesJSONInfo.exists) {
    const response = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    return response
  } else {
    console.log("Exportables.json doesn't exists.")
  }
}


export async function readExportableDir() {
  const exportablesDir = 'exportables/'
  const fileUri = FileSystem.documentDirectory + exportablesDir;

  const exportablesDirInfo = await FileSystem.getInfoAsync(fileUri);
  const isDir = exportablesDirInfo.isDirectory;

  if(isDir) {
    const response = await FileSystem.readDirectoryAsync(fileUri)
    let allImages = response.map(x => {
      if(x.endsWith(".png")) {
        return `${fileUri}${x}`
      }
    }).filter(notUndefined => notUndefined !== undefined);
    return allImages
  } else {
    console.log("Exportables directory doesn't exists.")
  }
}

export async function downloadExportableJSON() {

  const permissions = Sharing.isAvailableAsync()

  if (!permissions) {
    console.log('No permission granted!')
    return;
  }

  const exportablesDir = 'exportables/'
  const fileUri = FileSystem.documentDirectory + exportablesDir + `exportables.json`;

  await Sharing.shareAsync(fileUri)
}
