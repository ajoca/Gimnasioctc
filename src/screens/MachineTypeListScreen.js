import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { ListItem, Button, Icon, Text, Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getData, storeData } from '../services/storage';

const MachineTypeListScreen = ({ navigation }) => {
  const [machineTypes, setMachineTypes] = useState([]);

  // funcion para obtener los tipos de maquinas almacenadas
  const fetchMachineTypes = async () => {
    const storedMachineTypes = await getData('machineTypes');
    if (storedMachineTypes) setMachineTypes(storedMachineTypes);
  };

  // efecto para cargar los tipos de maquinas cada vez que la pantalla esta en foco
  useFocusEffect(
    useCallback(() => {
      fetchMachineTypes();
    }, [])
  );

  // funcion para confirmar la eliminacion de un tipo de maquina
  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminacion",
      "¿Esta seguro de que desea eliminar este tipo de maquina?",
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

  // funcion para eliminar un tipo de maquina
  const handleDelete = async (id) => {
    const updatedMachineTypes = machineTypes.filter(machineType => machineType.id !== id);
    setMachineTypes(updatedMachineTypes);
    await storeData('machineTypes', updatedMachineTypes);
    Alert.alert('Exito', 'Tipo de maquina eliminado correctamente.');
  };

  // funcion para editar un tipo de maquina
  const handleEdit = (machineType) => {
    navigation.navigate('MachineTypeForm', { machineType });
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Tipos de Maquinas', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      {machineTypes.length === 0 ? (
        <Text style={styles.noDataText}>Aun no se tiene datos</Text>
      ) : (
        <FlatList
          data={machineTypes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem bottomDivider containerStyle={styles.listItem}>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>{item.type}</ListItem.Title>
                {item.photo ? (
                  <Image source={{ uri: item.photo }} style={styles.image} />
                ) : (
                  <Text>No hay imagen</Text>
                )}
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
          )}
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
  image: {
    width: 100,
    height: 100,
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

export default MachineTypeListScreen;
