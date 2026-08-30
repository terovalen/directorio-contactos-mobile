import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { COLECCION_CONTACTOS, db } from '../config/firebase';

export default function DetalleScreen({ route, navigation }) {
  const { id } = route.params;
  const [contacto, setContacto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargarDetalle() {
      try {
        const referencia = doc(db, COLECCION_CONTACTOS, id);
        const snapshot = await getDoc(referencia);

        if (!snapshot.exists()) {
          setContacto(null);
          navigation.setOptions({ title: 'Contacto' });
          return;
        }

        const datos = { id: snapshot.id, ...snapshot.data() };
        setContacto(datos);
        navigation.setOptions({ title: datos.nombre });
      } catch {
        Alert.alert('Error', 'No se pudo cargar el contacto.');
      } finally {
        setCargando(false);
      }
    }

    cargarDetalle();
  }, [id, navigation]);

  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar contacto',
      `¿Seguro que quieres eliminar a ${contacto.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: eliminarContacto,
        },
      ]
    );
  };

  const eliminarContacto = async () => {
    try {
      setEliminando(true);
      await deleteDoc(doc(db, COLECCION_CONTACTOS, id));
      navigation.goBack();
    } catch {
      setEliminando(false);
      Alert.alert('Error', 'No se pudo eliminar el contacto.');
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1B4F72" />
      </View>
    );
  }

  if (!contacto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>Este contacto ya no existe.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Nombre</Text>
        <Text style={styles.valor}>{contacto.nombre}</Text>

        <Text style={styles.etiqueta}>Teléfono</Text>
        <Text style={styles.valor}>{contacto.telefono}</Text>

        <Text style={styles.etiqueta}>Ciudad</Text>
        <Text style={styles.valor}>{contacto.ciudad}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.botonEliminar,
          (pressed || eliminando) && styles.botonPresionado,
        ]}
        onPress={confirmarEliminar}
        disabled={eliminando}
      >
        <Text style={styles.botonTexto}>
          {eliminando ? 'Eliminando...' : 'Eliminar contacto'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 16,
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
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  etiqueta: {
    fontSize: 13,
    color: '#5F6B7A',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  valor: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: '600',
    marginTop: 4,
  },
  mensaje: {
    fontSize: 16,
    color: '#5F6B7A',
  },
  botonEliminar: {
    backgroundColor: '#C0392B',
    marginTop: 24,
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
