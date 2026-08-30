import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { COLECCION_CONTACTOS, db } from '../config/firebase';

export default function NuevoScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    const nombreLimpio = nombre.trim();
    const telefonoLimpio = telefono.trim();
    const ciudadLimpia = ciudad.trim();

    if (!nombreLimpio || !telefonoLimpio || !ciudadLimpia) {
      Alert.alert(
        'Campos incompletos',
        'Debes llenar nombre, teléfono y ciudad antes de guardar.'
      );
      return;
    }

    if (!db) {
      Alert.alert(
        'Firebase no configurado',
        'Copia .env.example a .env y pega las claves de tu proyecto.'
      );
      return;
    }

    try {
      setGuardando(true);
      await addDoc(collection(db, COLECCION_CONTACTOS), {
        nombre: nombreLimpio,
        telefono: telefonoLimpio,
        ciudad: ciudadLimpia,
      });
      navigation.goBack();
    } catch {
      setGuardando(false);
      Alert.alert('Error', 'No se pudo guardar el contacto. Intenta de nuevo.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formulario}>
        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Ana Pérez"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.etiqueta}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Ej. 3001234567"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
        />

        <Text style={styles.etiqueta}>Ciudad</Text>
        <TextInput
          style={styles.input}
          value={ciudad}
          onChangeText={setCiudad}
          placeholder="Ej. Medellín"
          placeholderTextColor="#94A3B8"
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            (pressed || guardando) && styles.botonPresionado,
          ]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  formulario: {
    padding: 16,
  },
  etiqueta: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  boton: {
    backgroundColor: '#1B4F72',
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonPresionado: {
    opacity: 0.85,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
