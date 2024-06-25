import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, Header, Input, Icon  } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { getData, storeData } from '../services/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const MaintenanceScreen = () => {
  const [machines, setMachines] = useState([]); // estado para almacenar la lista de maquinas
  const [selectedMachine, setSelectedMachine] = useState(null); // estado para la maquina seleccionada
  const [maintenanceDate, setMaintenanceDate] = useState(new Date()); // estado para la fecha de mantenimiento
  const [description, setDescription] = useState(''); // estado para la descripcion del mantenimiento
  const [showDatePicker, setShowDatePicker] = useState(false); // estado para mostrar el selector de fecha
  const [machineTypes, setMachineTypes] = useState([]); // estado para almacenar los tipos de maquinas
  const [maintenances, setMaintenances] = useState([]); // estado para almacenar la lista de mantenimientos
  const [editingMaintenance, setEditingMaintenance] = useState(null); // estado para almacenar el mantenimiento que se esta editando

  // useEffect para obtener las maquinas y los tipos de maquinas almacenadas
  useEffect(() => {
    const fetchMachinesAndTypes = async () => {
      const storedMachines = await getData('machines') || [];
      const storedMachineTypes = await getData('machineTypes') || [];
      const storedMaintenances = await getData('maintenances') || [];
      setMachines(storedMachines);
      setMachineTypes(storedMachineTypes);
      setMaintenances(storedMaintenances);
    };

    fetchMachinesAndTypes();
  }, []);

  // funcion para obtener el nombre del tipo de maquina por su id
  const getMachineTypeName = (typeId) => {
    const type = machineTypes.find(t => t.id === typeId);
    return type ? type.type : 'desconocido';
  };

  // funcion para manejar el registro de mantenimiento
  const handleMaintenance = async () => {
    if (!selectedMachine || !maintenanceDate || !description) {
      Alert.alert('Error', 'todos los campos son obligatorios.');
      return;
    }

    let updatedMaintenances;

    if (editingMaintenance) {
      updatedMaintenances = maintenances.map(m => 
        m.id === editingMaintenance.id 
          ? { ...editingMaintenance, machineId: selectedMachine, date: maintenanceDate.toISOString().split('T')[0], description } 
          : m
      );
      setEditingMaintenance(null);
    } else {
      const newMaintenance = { id: Date.now().toString(), machineId: selectedMachine, date: maintenanceDate.toISOString().split('T')[0], description };
      updatedMaintenances = [...maintenances, newMaintenance];
    }

    await storeData('maintenances', updatedMaintenances);
    setMaintenances(updatedMaintenances);
    Alert.alert('Exito', 'mantenimiento registrado correctamente.');
    setDescription('');
    setSelectedMachine(null);
    setMaintenanceDate(new Date());
  };

  // funcion para manejar el cambio de fecha
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || maintenanceDate;
    setShowDatePicker(false);
    setMaintenanceDate(currentDate);
  };

  // funcion para manejar la edicion de un mantenimiento
  const handleEdit = (maintenance) => {
    setSelectedMachine(maintenance.machineId);
    setMaintenanceDate(new Date(maintenance.date));
    setDescription(maintenance.description);
    setEditingMaintenance(maintenance);
  };

  // funcion para confirmar la eliminacion de un mantenimiento
  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Está seguro de que desea eliminar este mantenimiento?",
      [
        {
          text: "Cancelar",
          style: "Cancel"
        },
        {
          text: "Aceptar",
          onPress: () => handleDelete(id)
        }
      ],
      { cancelable: true }
    );
  };

  // funcion para manejar la eliminacion de un mantenimiento
  const handleDelete = async (id) => {
    const updatedMaintenances = maintenances.filter(m => m.id !== id);
    await storeData('maintenances', updatedMaintenances);
    setMaintenances(updatedMaintenances);
    Alert.alert('Exito', 'mantenimiento eliminado correctamente.');
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Gestión de mantenimiento', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text h4 style={styles.text}>Seleccionar máquina</Text>
        <Picker
          selectedValue={selectedMachine}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMachine(itemValue)}
        >
          <Picker.Item label="Seleccione una máquina" value={null} />
          {machines.map(machine => (
            <Picker.Item key={machine.id} label={`${machine.code} - ${getMachineTypeName(machine.type)}`} value={machine.id} />
          ))}
        </Picker>
        <Button
          title="Seleccionar fecha de mantenimiento"
          buttonStyle={styles.button}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={maintenanceDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Input
          placeholder="Descripción del mantenimiento"
          value={description}
          onChangeText={setDescription}
          inputContainerStyle={styles.inputContainer}
        />
        <Button
          title={editingMaintenance ? 'Actualizar mantenimiento' : 'Registrar mantenimiento'}
          buttonStyle={styles.button}
          onPress={handleMaintenance}
        />
        <Text h4 style={styles.subHeader}>Mantenimientos registrados</Text>
        {maintenances.map(maintenance => (
          <Card key={maintenance.id} containerStyle={styles.card}>
            <Text>{machines.find(machine => machine.id === maintenance.machineId)?.code} - {getMachineTypeName(machines.find(machine => machine.id === maintenance.machineId)?.type)}</Text>
            <Text>fecha: {maintenance.date}</Text>
            <Text>descripción: {maintenance.description}</Text>
            <View style={styles.buttonContainer}>
              <Button
                icon={<Icon name="edit" size={20} color="white" />}
                buttonStyle={styles.editButton}
                onPress={() => handleEdit(maintenance)}
              />
              <Button
                icon={<Icon name="delete" size={20} color="white" />}
                buttonStyle={styles.deleteButton}
                onPress={() => confirmDelete(maintenance.id)}
              />
            </View>
          </Card>
        ))}
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
  text: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 5,
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
  card: {
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  subHeader: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default MaintenanceScreen;
