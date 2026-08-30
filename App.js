import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaScreen from './src/screens/ListaScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import NuevoScreen from './src/screens/NuevoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          headerStyle: { backgroundColor: '#1B4F72' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={{ title: 'Contactos' }}
        />
        <Stack.Screen
          name="Detalle"
          component={DetalleScreen}
          options={{ title: 'Detalle' }}
        />
        <Stack.Screen
          name="Nuevo"
          component={NuevoScreen}
          options={{ title: 'Nuevo contacto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
