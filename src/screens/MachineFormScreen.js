import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text, Header } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { storeData, getData } from '../services/storage';

const MachineFormScreen = ({ navigation, route }) => {
  // estados para almacenar los valores del formulario y los tipos de maquinas
  const [code, setCode] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [types, setTypes] = useState([]);
  const [machine, setMachine] = useState(null);

  // useEffect para cargar los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      // obtener los tipos de maquinas almacenados
      const storedTypes = await getData('machineTypes');
      if (storedTypes) setTypes(storedTypes);
    };

    fetchData();

    // si se pasa una maquina en los parametros de la ruta, cargar sus datos en el formulario
    if (route.params?.machine) {
      const { machine } = route.params;
      setCode(machine.code);
      setSelectedType(machine.type);
      setRoomNumber(machine.roomNumber);
      setMachine(machine);
    }
  }, [route.params]);

  // manejar el envio del formulario
  const handleSubmit = async () => {
    // verificar que todos los campos esten llenos
    if (!code || !selectedType || !roomNumber) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // obtener las maquinas almacenadas
    const machines = await getData('machines') || [];

    if (machine) {
      // actualizar una maquina existente
      const updatedMachines = machines.map(m => (m.id === machine.id ? { ...machine, code, type: selectedType, roomNumber } : m));
      await storeData('machines', updatedMachines);
      Alert.alert('Éxito', 'Máquina actualizada correctamente.');
    } else {
      // agregar una nueva maquina
      const newMachine = { id: Date.now().toString(), code, type: selectedType, roomNumber };
      machines.push(newMachine);
      await storeData('machines', machines);
      Alert.alert('Éxito', 'Máquina registrada correctamente.');
    }

    // navegar hacia atras despues de guardar los datos
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: machine ? 'Editar Máquina' : 'Registrar Máquina', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <Input 
        placeholder="Código Identificatorio" 
        value={code} 
        onChangeText={setCode}
        inputContainerStyle={styles.inputContainer}
      />
      <Text h4 style={styles.text}>Seleccionar Tipo de Máquina</Text>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un tipo de máquina" value="" />
        {types.map((type) => (
          <Picker.Item key={type.id} label={type.type} value={type.id} />
        ))}
      </Picker>
      <Input 
        placeholder="Número de Sala" 
        value={roomNumber} 
        onChangeText={setRoomNumber}
        inputContainerStyle={styles.inputContainer}
      />
      <Button 
        title={machine ? 'Actualizar' : 'Registrar'} 
        buttonStyle={styles.button} 
        onPress={handleSubmit} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: '#FF5733',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#FF5733',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
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
  text: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
});

export default MachineFormScreen;
