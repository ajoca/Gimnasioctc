import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Input, Button, Text, Header } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { storeData, getData } from '../services/storage';

const ExerciseFormScreen = ({ navigation, route }) => {
  // estados para manejar los datos del formulario
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [media, setMedia] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [types, setTypes] = useState([]);
  const [machines, setMachines] = useState([]);
  const [exercise, setExercise] = useState(null);

  // cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      const storedTypes = await getData('machineTypes');
      if (storedTypes) setTypes(storedTypes);

      const storedMachines = await getData('machines');
      if (storedMachines) setMachines(storedMachines);
    };

    fetchData();

    if (route.params?.exercise) {
      const { exercise } = route.params;
      setName(exercise.name);
      setSelectedType(exercise.type || '');
      setSelectedMachine(exercise.machine || '');
      setMedia(exercise.media);
      setMediaType(exercise.mediaType);
      setExercise(exercise);
    }
  }, [route.params]);

  // manejar seleccion de media (imagen o video)
  const handlePickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("permiso denegado", "se necesita permiso para acceder a la galeria.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const pickedMedia = pickerResult.assets[0];
      setMedia(pickedMedia.uri);
      setMediaType(pickedMedia.type);
    }
  };

  // manejar el envio del formulario
  const handleSubmit = async () => {
    if (!name || !media) {
      Alert.alert('error', 'el nombre y el media son obligatorios.');
      return;
    }

    const exercises = await getData('exercises') || [];

    if (exercise) {
      const updatedExercises = exercises.map(e =>
        e.id === exercise.id ? { ...exercise, name, type: selectedType, machine: selectedMachine, media, mediaType } : e
      );
      await storeData('exercises', updatedExercises);
      Alert.alert('exito', 'ejercicio actualizado correctamente.');
    } else {
      const newExercise = { id: Date.now().toString(), name, type: selectedType, machine: selectedMachine, media, mediaType };
      exercises.push(newExercise);
      await storeData('exercises', exercises);
      Alert.alert('exito', 'ejercicio registrado correctamente.');
    }

    navigation.goBack();
  };

  // renderizar media (imagen o video)
  const renderMedia = () => {
    if (mediaType === 'video') {
      return (
        <Video
          source={{ uri: media }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.video}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: media }}
          style={styles.image}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: exercise ? 'editar ejercicio' : 'registrar ejercicio', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Input
          placeholder="nombre del ejercicio"
          value={name}
          onChangeText={setName}
          inputContainerStyle={styles.inputContainer}
        />
        <Text h4 style={styles.label}>seleccionar tipo de maquina (opcional)</Text>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="seleccione un tipo de maquina" value="" />
          {types.map((type) => (
            <Picker.Item key={type.id} label={type.type} value={type.id} />
          ))}
        </Picker>
        <TouchableOpacity onPress={handlePickMedia}>
          <Text style={styles.selectMediaText}>seleccionar media</Text>
        </TouchableOpacity>
        {media ? renderMedia() : <Text>no hay media seleccionada</Text>}
        <Button
          title={exercise ? 'actualizar' : 'registrar'}
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
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#FF5733',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  selectMediaText: {
    color: '#FF5733',
    textAlign: 'center',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  label: {
    color: '#FF5733',
    marginBottom: 10,
  }
});

export default ExerciseFormScreen;
