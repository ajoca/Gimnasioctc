import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, Button, Input, ListItem, Icon, Header } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { getData, storeData } from '../services/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const PaymentScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [plan, setPlan] = useState('monthly');
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    // funcion para obtener los usuarios y pagos almacenados
    const fetchUsersAndPayments = async () => {
      const storedUsers = await getData('users') || [];
      const storedPayments = await getData('payments') || [];
      setUsers(storedUsers);
      setPayments(storedPayments);
    };

    fetchUsersAndPayments();
  }, []);

  // funcion para manejar el registro de pago
  const handlePayment = async () => {
    if (!selectedUser || !paymentDate) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const amount = plan === 'monthly' ? '1200' : '12000';
    const dueDate = new Date(paymentDate);
    dueDate.setMonth(paymentDate.getMonth() + (plan === 'monthly' ? 1 : 12));

    const newPayment = {
      id: editingPayment ? editingPayment.id : Date.now().toString(),
      userId: selectedUser,
      amount,
      paymentDate: paymentDate.toISOString().split('T')[0],
      plan,
      dueDate: dueDate.toISOString().split('T')[0], 
    };

    const updatedPayments = editingPayment
      ? payments.map(payment => payment.id === editingPayment.id ? newPayment : payment)
      : [...payments, newPayment];

    await storeData('payments', updatedPayments);
    setPayments(updatedPayments);
    Alert.alert('Exito', 'Pago registrado correctamente.');
    resetForm();
  };

  // funcion para editar un pago
  const handleEdit = (payment) => {
    Alert.alert(
      "Confirmar Edicion",
      "¿Esta seguro de que desea editar este pago?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar",
          onPress: () => {
            setEditingPayment(payment);
            setSelectedUser(payment.userId);
            setPaymentDate(new Date(payment.paymentDate));
            setPlan(payment.plan);
          }
        }
      ],
      { cancelable: true }
    );
  };

  // funcion para eliminar un pago
  const handleDelete = (paymentId) => {
    Alert.alert(
      "Confirmar Eliminacion",
      "¿Esta seguro de que desea eliminar este pago?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            const updatedPayments = payments.filter(payment => payment.id !== paymentId);
            await storeData('payments', updatedPayments);
            setPayments(updatedPayments);
            Alert.alert('Exito', 'Pago eliminado correctamente.');
          }
        }
      ],
      { cancelable: true }
    );
  };

  // funcion para manejar el cambio de fecha
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || paymentDate;
    setShowDatePicker(false);
    setPaymentDate(currentDate);
  };

  // funcion para resetear el formulario
  const resetForm = () => {
    setEditingPayment(null);
    setSelectedUser(null);
    setPaymentDate(new Date());
    setPlan('monthly');
  };

  // funcion para renderizar cada item de pago
  const renderPaymentItem = ({ item }) => {
    const user = users.find(user => user.id === item.userId);
    return (
      <ListItem bottomDivider containerStyle={styles.listItem}>
        <ListItem.Content>
          <ListItem.Title>{`Usuario: ${user?.name} ${user?.surname}`}</ListItem.Title>
          <ListItem.Subtitle>{`Monto: ${item.amount} UYU`}</ListItem.Subtitle>
          <ListItem.Subtitle>{`Fecha de Pago: ${item.paymentDate}`}</ListItem.Subtitle>
          <ListItem.Subtitle>{`Plan: ${item.plan === 'monthly' ? 'Mensual' : 'Anual'}`}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          icon={<Icon name="edit" size={20} color="white" />}
          buttonStyle={styles.editButton}
          onPress={() => handleEdit(item)}
        />
        <Button
          icon={<Icon name="delete" size={20} color="white" />}
          buttonStyle={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        />
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Gestion de Pagos', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <View style={styles.formContainer}>
        <Picker
          selectedValue={selectedUser}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedUser(itemValue)}
        >
          <Picker.Item label="Seleccione un usuario" value={null} />
          {users.map(user => (
            <Picker.Item key={user.id} label={`${user.name} ${user.surname}`} value={user.id} />
          ))}
        </Picker>
        <Picker
          selectedValue={plan}
          style={styles.picker}
          onValueChange={(itemValue) => setPlan(itemValue)}
        >
          <Picker.Item label="Plan Mensual - 1200 UYU" value="monthly" />
          <Picker.Item label="Plan Anual - 12000 UYU" value="annual" />
        </Picker>
        <Button
          title="Seleccionar Fecha de Pago"
          buttonStyle={styles.button}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={paymentDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button
          title={editingPayment ? "Actualizar Pago" : "Registrar Pago"}
          buttonStyle={styles.button}
          onPress={handlePayment}
        />
      </View>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        ListHeaderComponent={() => <Text h4 style={styles.subHeader}>Pagos</Text>}
      />
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
  formContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 5,
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
  subHeader: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
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
});

export default PaymentScreen;
