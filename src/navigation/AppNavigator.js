import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import UserFormScreen from '../screens/UserFormScreen';
import UserListScreen from '../screens/UserListScreen';
import MachineFormScreen from '../screens/MachineFormScreen';
import MachineListScreen from '../screens/MachineListScreen';
import ExerciseFormScreen from '../screens/ExerciseFormScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import RoutineFormScreen from '../screens/RoutineFormScreen';
import RoutineListScreen from '../screens/RoutineListScreen';
import MachineTypeFormScreen from '../screens/MachineTypeFormScreen';
import MachineTypeListScreen from '../screens/MachineTypeListScreen';
import SummaryScreen from '../screens/SummaryScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerTitle: '',
  headerBackTitleVisible: false,
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={screenOptions} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserForm" component={UserFormScreen} options={screenOptions} />
      <Stack.Screen name="UserList" component={UserListScreen} options={screenOptions} />
      <Stack.Screen name="MachineForm" component={MachineFormScreen} options={screenOptions} />
      <Stack.Screen name="MachineList" component={MachineListScreen} options={screenOptions} />
      <Stack.Screen name="ExerciseForm" component={ExerciseFormScreen} options={screenOptions} />
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen} options={screenOptions} />
      <Stack.Screen name="RoutineForm" component={RoutineFormScreen} options={screenOptions} />
      <Stack.Screen name="RoutineList" component={RoutineListScreen} options={screenOptions} />
      <Stack.Screen name="MachineTypeForm" component={MachineTypeFormScreen} options={screenOptions} />
      <Stack.Screen name="MachineTypeList" component={MachineTypeListScreen} options={screenOptions} />
      <Stack.Screen name="Summary" component={SummaryScreen} options={screenOptions} />
      <Stack.Screen name="Maintenance" component={MaintenanceScreen} options={screenOptions} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={screenOptions} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
