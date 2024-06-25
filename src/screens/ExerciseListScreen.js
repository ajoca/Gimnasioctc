import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { ListItem, Button, Icon, Text, Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getData, storeData } from '../services/storage';
import { Video } from 'expo-av';

const ExerciseListScreen = ({ navigation }) => {
  // estados para manejar los ejercicios y tipos de maquinas
  const [exercises, setExercises] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);

  // funcion para obtener los ejercicios y tipos de maquinas almacenados
  const fetchExercises = async () => {
    const storedExercises = await getData('exercises');
    const storedMachineTypes = await getData('machineTypes');
    if (storedExercises) setExercises(storedExercises);
    if (storedMachineTypes) setMachineTypes(storedMachineTypes);
  };

  // usar efecto para cargar los datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [])
  );

  // confirmar eliminacion de un ejercicio
  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar este ejercicio?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar",
          onPress: () => handleDelete(id)
        }
      ],
      { cancelable: true }
    );
  };

  // manejar la eliminacion de un ejercicio
  const handleDelete = async (id) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== id);
    setExercises(updatedExercises);
    await storeData('exercises', updatedExercises);
    Alert.alert('Éxito', 'Ejercicio eliminado correctamente.');
  };

  // manejar la edicion de un ejercicio
  const handleEdit = (exercise) => {
    navigation.navigate('ExerciseForm', { exercise });
  };

  // obtener el tipo de maquina por el id
  const getMachineTypeById = (id) => {
    return machineTypes.find(machineType => machineType.id === id);
  };

  // renderizar el media (video o imagen)
  const renderMedia = (media, mediaType) => {
    if (mediaType === 'video') {
      return (
        <Video
          source={{ uri: media }}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.media}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: media }}
          style={styles.media}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Ejercicios', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      {exercises.length === 0 ? (
        <Text style={styles.noDataText}>Aún no se tiene datos</Text>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const machineType = getMachineTypeById(item.type);
            return (
              <ListItem bottomDivider containerStyle={styles.listItem}>
                <ListItem.Content>
                  <ListItem.Title style={styles.listTitle}>{item.name}</ListItem.Title>
                  {machineType && (
                    <>
                      <ListItem.Subtitle style={styles.listSubtitle}>{`Tipo de Máquina: ${machineType.type}`}</ListItem.Subtitle>
                      {machineType.photo && (
                        <Image source={{ uri: machineType.photo }} style={styles.machineImage} />
                      )}
                    </>
                  )}
                  {item.media ? renderMedia(item.media, item.mediaType) : <Text>No hay media</Text>}
                </ListItem.Content>
                <Button
                  icon={<Icon name="edit" size={20} color="white" />}
                  buttonStyle={styles.editButton}
                  onPress={() => handleEdit(item)}
                />
                <Button
                  icon={<Icon name="delete" size={20} color="white" />}
                  buttonStyle={styles.deleteButton}
                  onPress={() => confirmDelete(item.id)}
                />
              </ListItem>
            );
          }}
        />
      )}
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
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  media: {
    width: '100%',
    height: 150,
  },
  machineImage: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#C70039',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
});

export default ExerciseListScreen;
