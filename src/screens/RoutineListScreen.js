import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { ListItem, Button, Icon, Text, Header } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getData, storeData } from '../services/storage';
import { Video } from 'expo-av';

const RoutineListScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);

  useEffect(() => {
    // funcion para obtener datos de usuarios, ejercicios, maquinas y tipos de maquinas
    const fetchData = async () => {
      const storedUsers = await getData('users');
      if (storedUsers) setUsers(storedUsers);

      const storedExercises = await getData('exercises');
      if (storedExercises) setExercises(storedExercises);

      const storedMachines = await getData('machines');
      if (storedMachines) setMachines(storedMachines);

      const storedMachineTypes = await getData('machineTypes');
      if (storedMachineTypes) setMachineTypes(storedMachineTypes);
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchRoutines = async () => {
        const storedRoutines = await getData('routines');
        if (storedRoutines) setRoutines(storedRoutines.filter(routine => routine.user === selectedUser));
      };
      if (selectedUser) {
        fetchRoutines();
      }
    }, [selectedUser])
  );

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar esta rutina?",
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

  const handleDelete = async (id) => {
    const updatedRoutines = routines.filter(routine => routine.id !== id);
    setRoutines(updatedRoutines);
    await storeData('routines', updatedRoutines);
    Alert.alert('Éxito', 'Rutina eliminada correctamente.');
  };

  const handleEdit = (routine) => {
    navigation.navigate('RoutineForm', { routine });
  };

  const getExerciseById = (id) => {
    return exercises.find(e => e.id === id);
  };

  const getMachineById = (id) => {
    return machines.find(m => m.id === id);
  };

  const getMachineTypeById = (id) => {
    return machineTypes.find(mt => mt.id === id);
  };

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
        centerComponent={{ text: 'Rutinas', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <Text h4 style={styles.text}>Seleccionar Usuario</Text>
      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue) => setSelectedUser(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un usuario" value="" />
        {users.map((user) => (
          <Picker.Item key={user.id} label={`${user.name} ${user.surname}`} value={user.id} />
        ))}
      </Picker>
      {routines.length === 0 ? (
        <Text style={styles.noDataText}>Aún no se tiene datos</Text>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const exercise = getExerciseById(item.exercise);
            const machine = exercise ? getMachineById(exercise.machine) : null;
            const machineType = machine ? getMachineTypeById(machine.type) : null;
            return (
              <ListItem bottomDivider containerStyle={styles.listItem}>
                <ListItem.Content>
                  <ListItem.Title style={styles.listTitle}>{item.day}</ListItem.Title>
                  <ListItem.Subtitle style={styles.listSubtitle}>{`Ejercicio: ${exercise ? exercise.name : 'Ejercicio no encontrado'}`}</ListItem.Subtitle>
                  <ListItem.Subtitle style={styles.listSubtitle}>{`Tiempo: ${item.time} minutos`}</ListItem.Subtitle>
                  <ListItem.Subtitle style={styles.listSubtitle}>{`Cantidad: ${item.quantity} repeticiones`}</ListItem.Subtitle>
                  {machineType && <ListItem.Subtitle style={styles.listSubtitle}>{`Tipo de Máquina: ${machineType.type}`}</ListItem.Subtitle>}
                  {exercise && exercise.media ? renderMedia(exercise.media, exercise.mediaType) : <Text style={styles.noMediaText}>No hay media</Text>}
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
  text: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
  picker: {
    height: 50,
    width: '100%',
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
  noMediaText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  media: {
    width: '100%',
    height: 150,
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

export default RoutineListScreen;