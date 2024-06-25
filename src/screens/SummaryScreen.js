import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Icon, Header } from 'react-native-elements';
import { getData } from '../services/storage';

const screenWidth = Dimensions.get('window').width;

const SummaryScreen = () => {
  const [summary, setSummary] = useState({
    newUsers: 0,
    pendingPayments: 0,
    maintenanceAlerts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const users = await getData('users') || [];
      const payments = await getData('payments') || [];
      const machines = await getData('machines') || [];

      const newUsers = users.length;

      const currentDate = new Date();
      const pendingPayments = payments.filter(payment => {
        const dueDate = new Date(payment.dueDate);
        return dueDate < currentDate;
      }).length;

      const maintenanceAlerts = machines.filter(machine => machine.lastMaintenance).length;

      setSummary({ newUsers, pendingPayments, maintenanceAlerts });
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Resumen de Actividades', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        containerStyle={styles.header}
      />
      <ScrollView style={styles.scrollContainer}>
        <Text h3 style={styles.headerText}>Resumen de Actividades</Text>
        <View style={styles.cardContainer}>
          <Card containerStyle={styles.card}>
            <Icon name="user-plus" type="font-awesome" color="#FF5733" size={40} />
            <Text h4>{summary.newUsers}</Text>
            <Text>Nuevos Usuarios</Text>
          </Card>
          <Card containerStyle={styles.card}>
            <Icon name="money" type="font-awesome" color="#FF5733" size={40} />
            <Text h4>{summary.pendingPayments}</Text>
            <Text>Pagos Pendientes</Text>
          </Card>
        </View>
        <View style={styles.cardContainer}>
          <Card containerStyle={styles.card}>
            <Icon name="wrench" type="font-awesome" color="#FF5733" size={40} />
            <Text h4>{summary.maintenanceAlerts}</Text>
            <Text>Alertas de Mantenimiento</Text>
          </Card>
        </View>
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
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF5733',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    width: screenWidth / 2.2,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default SummaryScreen;