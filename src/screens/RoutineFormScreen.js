import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Input, Button, Text, Header } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { storeData, getData } from '../services/storage';

const RoutineFormScreen = ({ navigation, route }) => {
  const [day, setDay] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [time, setTime] = useState('');
  const [quantity, setQuantity] = useState('');
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    // funcion para obtener datos de usuarios y ejercicios almacenados
    const fetchData = async () => {
      const storedUsers = await getData('users');
      if (storedUsers) setUsers(storedUsers);
      const storedExercises = await getData('exercises');
      if (storedExercises) setExercises(storedExercises);
    };

    fetchData();

    // si se edita una rutina, establece los valores en los campos correspondientes
    if (route.params?.routine) {
      const { routine } = route.params;
      setDay(routine.day);
      setSelectedUser(routine.user);
      setSelectedExercise(routine.exercise);
      setTime(routine.time);
      setQuantity(routine.quantity);
      setRoutine(routine);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    // verificar que todos los campos esten llenos
    if (!day || !selectedUser || !selectedExercise || !time || !quantity) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const routines = await getData('routines') || [];

    // actualizar una rutina existente
    if (routine) {
      const updatedRoutines = routines.map(r => (r.id === routine.id ? { ...routine, day, user: selectedUser, exercise: selectedExercise, time, quantity } : r));
      await storeData('routines', updatedRoutines);
      Alert.alert('Éxito', 'Rutina actualizada correctamente.');
    } else {
      // crear una nueva rutina
      const newRoutine = { id: Date.now().toString(), day, user: selectedUser, exercise: selectedExercise, time, quantity };
      routines.push(newRoutine);
      await storeData('routines', routines);
      Alert.alert('Éxito', 'Rutina registrada correctamente.');
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: routine ? 'Editar Rutina' : 'Registrar Rutina', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Input
          placeholder="Día de la Rutina"
          value={day}
          onChangeText={setDay}
          inputContainerStyle={styles.inputContainer}
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
        <Text h4 style={styles.text}>Seleccionar Ejercicio</Text>
        <Picker
          selectedValue={selectedExercise}
          onValueChange={(itemValue) => setSelectedExercise(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un ejercicio" value="" />
          {exercises.map((exercise) => (
            <Picker.Item key={exercise.id} label={exercise.name} value={exercise.id} />
          ))}
        </Picker>
        <Input
          placeholder="Tiempo (en minutos)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          inputContainerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Cantidad (repeticiones)"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          inputContainerStyle={styles.inputContainer}
        />
        <Button
          title={routine ? 'Actualizar' : 'Registrar'}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
});

export default RoutineFormScreen;