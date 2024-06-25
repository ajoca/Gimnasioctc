import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ListItem, Button, Icon, Text, Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getData, storeData } from '../services/storage';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    // obtener usuarios almacenados
    const storedUsers = await getData('users');
    if (storedUsers) setUsers(storedUsers);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const confirmDelete = (id) => {
    // confirmar la eliminacion del usuario
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar este usuario?",
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
    // eliminar usuario
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    await storeData('users', updatedUsers);
    Alert.alert('Éxito', 'Usuario eliminado correctamente.');
  };

  const handleEdit = (user) => {
    // navegar a la pantalla de edicion de usuario
    navigation.navigate('UserForm', { user });
  };

  const handleViewPayments = (user) => {
    // navegar a la pantalla de pagos de usuario
    navigation.navigate('Payment', { userId: user.id });
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Usuarios', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      {users.length === 0 ? (
        <Text style={styles.noDataText}>Aún no se tiene datos</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem bottomDivider containerStyle={styles.listItem}>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>{`Nombre: ${item.name} ${item.surname}`}</ListItem.Title>
                <ListItem.Subtitle style={styles.listSubtitle}>{`Cédula: ${item.idNumber}`}</ListItem.Subtitle>
                <ListItem.Subtitle style={styles.listSubtitle}>{`Fecha de Nacimiento: ${item.dob}`}</ListItem.Subtitle>
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
              <Button
                icon={<Icon name="history" size={20} color="white" />}
                buttonStyle={styles.historyButton}
                onPress={() => handleViewPayments(item)}
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
  listSubtitle: {
    fontSize: 14,
    color: '#666',
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
  historyButton: {
    backgroundColor: '#FFC107',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
});

export default UserListScreen;