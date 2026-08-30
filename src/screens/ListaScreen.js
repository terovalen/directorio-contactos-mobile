import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { COLECCION_CONTACTOS, db, firebaseConfigurado } from '../config/firebase';

export default function ListaScreen({ navigation }) {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarContactos = useCallback(async () => {
    if (!firebaseConfigurado()) {
      setError(
        'Falta la configuración de Firebase. Copia .env.example a .env y pega las claves de tu proyecto.'
      );
      setCargando(false);
      return;
    }

    try {
      setError('');
      const snapshot = await getDocs(collection(db, COLECCION_CONTACTOS));
      const lista = snapshot.docs
        .map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }))
        .sort((a, b) =>
          String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es')
        );
      setContactos(lista);
    } catch (e) {
      setError(
        'No se pudieron cargar los contactos. Revisa la conexión y las reglas de Firestore.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  // Al volver de Nuevo o Detalle se vuelve a leer Firestore (sin cerrar la app).
  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarContactos();
    }, [cargarContactos])
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.tarjeta, pressed && styles.tarjetaPresionada]}
      onPress={() => navigation.navigate('Detalle', { id: item.id })}
    >
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.dato}>{item.telefono}</Text>
      <Text style={styles.dato}>{item.ciudad}</Text>
    </Pressable>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1B4F72" />
        <Text style={styles.mensajeEstado}>Cargando contactos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={contactos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          contactos.length === 0 ? styles.listaVacia : styles.lista
        }
        ListEmptyComponent={
          !error ? (
            <Text style={styles.mensajeEstado}>
              No hay contactos todavía. Agrega el primero con el botón de abajo.
            </Text>
          ) : null
        }
      />

      <Pressable
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
        onPress={() => navigation.navigate('Nuevo')}
      >
        <Text style={styles.botonTexto}>Agregar contacto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  lista: {
    padding: 16,
    paddingBottom: 8,
  },
  listaVacia: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tarjetaPresionada: {
    opacity: 0.7,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  dato: {
    fontSize: 14,
    color: '#5F6B7A',
  },
  mensajeEstado: {
    textAlign: 'center',
    color: '#5F6B7A',
    fontSize: 16,
    marginTop: 8,
  },
  error: {
    color: '#C0392B',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  boton: {
    backgroundColor: '#1B4F72',
    margin: 16,
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
