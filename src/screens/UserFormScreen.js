import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Input, Button, Header } from 'react-native-elements';
import { storeData, getData } from '../services/storage';

const UserFormScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // si se edita un usuario, establece los valores en los campos correspondientes
    if (route.params && route.params.user) {
      const { id, name, surname, idNumber, dob } = route.params.user;
      setName(name);
      setSurname(surname);
      setIdNumber(idNumber);
      setDob(dob);
      setIsEdit(true);
      setUserId(id);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    // verificar que todos los campos esten llenos
    if (!name || !surname || !idNumber || !dob) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const users = await getData('users') || [];

    // actualizar un usuario existente
    if (isEdit) {
      const updatedUsers = users.map(user => 
        user.id === userId ? { id: userId, name, surname, idNumber, dob } : user
      );
      await storeData('users', updatedUsers);
      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
    } else {
      // verificar si el usuario ya existe
      const existingUser = users.find(user => user.idNumber === idNumber);
      if (existingUser) {
        Alert.alert('Error', 'El usuario con esta cédula de identidad ya está registrado.');
        return;
      }
      // registrar un nuevo usuario
      const newUser = { id: Date.now().toString(), name, surname, idNumber, dob };
      users.push(newUser);
      await storeData('users', users);
      Alert.alert('Éxito', 'Usuario registrado correctamente.');
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header
        centerComponent={{ text: isEdit ? 'Editar Usuario' : 'Registrar Usuario', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <Input
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#CCCCCC"
      />
      <Input
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#CCCCCC"
      />
      <Input
        placeholder="Cédula de Identidad"
        value={idNumber}
        onChangeText={setIdNumber}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#CCCCCC"
      />
      <Input
        placeholder="Fecha de Nacimiento"
        value={dob}
        onChangeText={setDob}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#CCCCCC"
      />
      <Button
        title={isEdit ? "Actualizar" : "Registrar"}
        buttonStyle={styles.button}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF5733',
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

export default UserFormScreen;