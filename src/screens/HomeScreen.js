import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ImageBackground, Modal } from 'react-native';
import { Image, Header, Icon } from 'react-native-elements';
import { removeData } from '../services/storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  // estados para manejar la visibilidad del modal y el grupo activo
  const [modalVisible, setModalVisible] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  // grupos de botones para la interfaz
  const buttonGroups = [
    {
      header: 'Actividades',
      buttons: [
        { title: 'Resumen de actividades', icon: 'line-chart', screen: 'Summary', color: '#FF5733' },
      ]
    },
    {
      header: 'Gestion',
      buttons: [
        { title: 'Gestion de mantenimiento', icon: 'wrench', screen: 'Maintenance', color: '#FF5733' },
        { title: 'Gestion de pagos', icon: 'money', screen: 'Payment', color: '#FF5733' },
      ]
    },
    {
      header: 'Usuarios',
      buttons: [
        { title: 'Registrar usuario', icon: 'user-plus', screen: 'UserForm', color: '#FF5733' },
        { title: 'Lista de usuarios', icon: 'users', screen: 'UserList', color: '#C70039' },
      ]
    },
    {
      header: 'Maquinas',
      buttons: [
        { title: 'Registrar tipo de maquina', icon: 'cogs', screen: 'MachineTypeForm', color: '#FF5733' },
        { title: 'Lista de tipos de maquinas', icon: 'list', screen: 'MachineTypeList', color: '#C70039' },
        { title: 'Registrar maquina', icon: 'wrench', screen: 'MachineForm', color: '#FF5733' },
        { title: 'Lista de maquinas', icon: 'cogs', screen: 'MachineList', color: '#C70039' },
      ]
    },
    {
      header: 'Ejercicios y rutinas',
      buttons: [
        { title: 'Registrar ejercicio', icon: 'heartbeat', screen: 'ExerciseForm', color: '#FF5733' },
        { title: 'Lista de ejercicios', icon: 'list-alt', screen: 'ExerciseList', color: '#C70039' },
        { title: 'Registrar rutina', icon: 'calendar-plus-o', screen: 'RoutineForm', color: '#FF5733' },
        { title: 'Lista de rutinas', icon: 'calendar', screen: 'RoutineList', color: '#C70039' },
      ]
    },
  ];

  // manejar cierre de sesion
  const handleLogout = async () => {
    await removeData('currentUser');
    navigation.navigate('Login');
  };

  // valores compartidos para animaciones
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-50);
  const titleScale = useSharedValue(0.5);
  const buttonTranslations = buttonGroups.flatMap(group => group.buttons.map(() => useSharedValue(100)));

  // efecto para inicializar animaciones
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 1000 });
    titleTranslateY.value = withTiming(0, { duration: 1000 });
    titleScale.value = withTiming(1, { duration: 1000 });
    buttonTranslations.forEach((translation, index) => {
      translation.value = withSpring(0, { damping: 5, stiffness: 90, delay: index * 100 });
    });
  }, []);

  // estilos animados para el titulo
  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        { translateY: titleTranslateY.value },
        { scale: titleScale.value },
      ],
    };
  });

  // estilos animados para los botones
  const animatedButtonStyles = buttonTranslations.map(translation => useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translation.value }],
    };
  }));

  return (
    <ImageBackground
      source={require('../../assets/background1.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Header
          rightComponent={<Icon name="sign-out" type="font-awesome" size={30} color="white" onPress={handleLogout} />}
          containerStyle={styles.header}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo-gimnasio2.png.webp')}
              style={styles.logo}
              PlaceholderContent={<Icon name="spinner" type="font-awesome" size={24} color="blue" />}
            />
          </View>
          <Animated.View style={animatedTitleStyle}>
            <Text style={styles.title}>bienvenido</Text>
          </Animated.View>
          {buttonGroups.map((group, groupIndex) => (
            <TouchableOpacity
              key={groupIndex}
              style={styles.groupButton}
              onPress={() => {
                setActiveGroup(groupIndex);
                setModalVisible(true);
              }}
            >
              <Text style={styles.groupHeader}>{group.header}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {activeGroup !== null && buttonGroups[activeGroup].buttons.map((button, buttonIndex) => (
                <Animated.View key={buttonIndex} style={[styles.animatedButtonContainer, animatedButtonStyles[activeGroup * buttonGroups[activeGroup].buttons.length + buttonIndex]]}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: button.color }]}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate(button.screen, button.params);
                    }}
                    activeOpacity={0.8}
                  >
                    <Icon name={button.icon} type="font-awesome" size={24} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{button.title}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  logoContainer: {
    opacity: 1.2,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  groupButton: {
    backgroundColor: 'rgba(255, 87, 51, 0.8)', 
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 15,
    width: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  animatedButtonContainer: {
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#C70039',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
