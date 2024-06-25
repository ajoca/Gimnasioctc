import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { ListItem, Button, Icon, Text, Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getData, storeData } from '../services/storage';

const MachineListScreen = ({ navigation }) => {
  // estados para almacenar las maquinas y tipos de maquinas
  const [machines, setMachines] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);

  // funcion para obtener las maquinas y tipos de maquinas almacenados
  const fetchMachines = async () => {
    const storedMachines = await getData('machines');
    const storedMachineTypes = await getData('machineTypes');
    if (storedMachines) setMachines(storedMachines);
    if (storedMachineTypes) setMachineTypes(storedMachineTypes);
  };

  // useFocusEffect para actualizar la lista de maquinas al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchMachines();
    }, [])
  );

  // confirmar la eliminacion de una maquina
  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar esta máquina?",
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

  // manejar la eliminacion de una maquina
  const handleDelete = async (id) => {
    const updatedMachines = machines.filter(machine => machine.id !== id);
    setMachines(updatedMachines);
    await storeData('machines', updatedMachines);
    Alert.alert('Éxito', 'Máquina eliminada correctamente.');
  };

  // manejar la edicion de una maquina
  const handleEdit = (machine) => {
    navigation.navigate('MachineForm', { machine });
  };

  // obtener el tipo de maquina por id
  const getMachineType = (typeId) => {
    return machineTypes.find(t => t.id === typeId) || {};
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Lista de Máquinas', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      {machines.length === 0 ? (
        <Text style={styles.noDataText}>Aún no se tiene datos</Text>
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const machineType = getMachineType(item.type);
            return (
              <ListItem bottomDivider containerStyle={styles.listItem}>
                <ListItem.Content>
                  <ListItem.Title style={styles.listTitle}>{item.code}</ListItem.Title>
                  <ListItem.Subtitle style={styles.listSubtitle}>{`Tipo: ${machineType.type || 'Desconocido'}`}</ListItem.Subtitle>
                  {machineType.photo && (
                    <Image source={{ uri: machineType.photo }} style={styles.machineImage} />
                  )}
                  <ListItem.Subtitle style={styles.listSubtitle}>{`Sala: ${item.roomNumber}`}</ListItem.Subtitle>
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
  machineImage: {
    width: 100,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
    resizeMode: 'contain',
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

export default MachineListScreen;
