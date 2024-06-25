import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Input, Button, Text, Header } from 'react-native-elements';
import { storeData, getData } from '../services/storage';
import Animated, { Easing } from 'react-native-reanimated';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const admins = await getData('admins') || [];
    const newAdmin = { id: Date.now().toString(), name, email, password };
    admins.push(newAdmin);
    await storeData('admins', admins);
    Alert.alert('Éxito', 'Administrador registrado correctamente.');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Header
            centerComponent={{ text: 'Registrar Administrador', style: styles.headerText }}
            containerStyle={styles.header}
          />
          <Animated.View
            style={[styles.animatedView, { transform: [{ translateY: 0 }] }]}
          >
            <Input
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              inputContainerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputContainerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              inputContainerStyle={styles.inputContainer}
            />
            <Button
              title="Registrar"
              buttonStyle={styles.button}
              onPress={handleRegister}
            />
            <Text style={styles.switchText} onPress={() => navigation.navigate('Login')}>
              o Iniciar Sesión
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#FF5733',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  animatedView: {
    alignItems: 'center',
    justifyContent: 'center',
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
  switchText: {
    textAlign: 'center',
    color: '#FF5733',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
