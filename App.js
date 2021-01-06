import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Image, Button, TouchableOpacity, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert('Permission to access to the camera is required');
    }
    
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
  
    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({ uri: pickerResult.uri, remoteUri: remoteUri })
    } else {
      setSelectedImage({ uri: pickerResult.uri })
    }
  
  };

  const openShareDialog = async () => {
    if (!await Sharing.isAvailableAsync()) {
      alert(`Image is avaliable at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image!</Text>
      <StatusBar style="auto" />
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image source={{ uri: selectedImage !== null ? selectedImage.uri : "https://picsum.photos/200/200", }}
               style={styles.image} />
      </TouchableOpacity>
      {selectedImage ?
      (<Button onPress={openShareDialog} color="deepskyblue" title="Share this image" />)
      : (<View></View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 20,
  }
});

export default App;