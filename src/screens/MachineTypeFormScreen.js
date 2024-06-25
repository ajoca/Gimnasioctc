import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Button, Text, Header } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { storeData, getData } from '../services/storage';

const MachineTypeFormScreen = ({ navigation, route }) => {
  // estado para almacenar el tipo de maquina
  const [type, setType] = useState('');
  // estado para almacenar la foto
  const [photo, setPhoto] = useState(null);
  // estado para almacenar el objeto machineType si se esta editando
  const [machineType, setMachineType] = useState(null);

  useEffect(() => {
    // si se pasa machineType por parametros, establecer los valores en los estados
    if (route.params?.machineType) {
      const { machineType } = route.params;
      setType(machineType.type);
      setPhoto(machineType.photo);
      setMachineType(machineType);
    }
  }, [route.params]);

  // funcion para manejar la seleccion de imagen
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galeria.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setPhoto(pickerResult.assets[0].uri);
    } else {
      console.log('Seleccion de imagen cancelada');
    }
  };

  // funcion para manejar el envio del formulario
  const handleSubmit = async () => {
    if (!type || !photo) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const machineTypes = await getData('machineTypes') || [];

    if (machineType) {
      const updatedMachineTypes = machineTypes.map(mt => (mt.id === machineType.id ? { ...machineType, type, photo } : mt));
      await storeData('machineTypes', updatedMachineTypes);
      Alert.alert('Exito', 'Tipo de maquina actualizado correctamente.');
    } else {
      const newMachineType = { id: Date.now().toString(), type, photo };
      machineTypes.push(newMachineType);
      await storeData('machineTypes', machineTypes);
      Alert.alert('Exito', 'Tipo de maquina registrado correctamente.');
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: machineType ? 'Editar Tipo de Maquina' : 'Registrar Tipo de Maquina', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Input
          placeholder="Tipo de Maquina"
          value={type}
          onChangeText={setType}
          inputContainerStyle={styles.inputContainer}
        />
        <TouchableOpacity onPress={handlePickImage}>
          <Text style={styles.imagePickerText}>Seleccionar Foto</Text>
        </TouchableOpacity>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text>No hay imagen seleccionada</Text>
        )}
        <Button
          title={machineType ? 'Actualizar' : 'Registrar'}
          buttonStyle={styles.button}
          onPress={handleSubmit}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF5733',
  },
  scrollContainer: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    borderColor: '#FF5733',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  imagePickerText: {
    color: '#FF5733',
    textAlign: 'center',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#C70039',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default MachineTypeFormScreen;
