import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Divider, Card, Button, Chip, useTheme, Searchbar } from 'react-native-paper';
// Importa el componente de tarjeta de producto (ProductCard)
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { api } from '../../helper/api';

const { width } = Dimensions.get('window');

export default function HomeModernV3() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosRes = await axios.get(`${api}getProductos.php`);
        setProducts(productosRes.data);
        
        const categoriasRes = await axios.get(`${api}getCategorias.php`);
        setCategories(categoriasRes.data);

        const galeriaRes = await axios.get(`${api}getGaleria.php`);
        setGallery(galeriaRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    // Contenedor principal para manejar el Searchbar flotante
    <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>

      {/* 🔍 Header Flotante con Searchbar */}
      <View style={styles.floatingHeader}>
        <Searchbar
          placeholder="Busca gorras, estilos o marcas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }}
          elevation={4}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Contenido Principal Desplazable */}
      <ScrollView style={styles.contentScrollView}>

        {/* 🚀 Banner (Hero Card con CTA) */}
        <Card elevation={5} style={styles.bannerCard}>
          <ImageBackground
            source={{ uri: 'https://via.placeholder.com/600x200/f72585/fff?text=Bienvenido+a+GorraShop' }}
            style={styles.banner}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={[styles.bannerOverlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
              <Text variant="headlineMedium" style={styles.bannerTitle}>
                👋 ¡Bienvenido a **GorraShop**!
              </Text>
              <Text variant="bodyMedium" style={styles.bannerSubtitle}>
                Explora las gorras más **🔥 del momento**.
              </Text>
              <Button
                mode="contained"
                icon="arrow-right-circle"
                labelStyle={{ fontWeight: 'bold' }}
                style={styles.bannerButton}
                onPress={() => console.log('Ver todas las gorras')}
              >
                Ver Colección
              </Button>
            </View>
          </ImageBackground>
        </Card>

        {/* --- */}

        {/* 🎯 Categorías (Chips Interactivos) */}
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          **Explora Categorías**
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              icon={cat.icon}
              mode="outlined"
              onPress={() => console.log(`Categoría: ${cat.name}`)}
              style={styles.categoryChip}
              textStyle={{ fontWeight: '600' }}
            >
              {cat.name}
            </Chip>
          ))}
        </ScrollView>

        {/* --- */}

        {/* 🖼️ Galería Promocional (Cards de Novedades) */}
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          **Novedades y Ofertas**
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
          {gallery.map((item, index) => (
            <Card key={index} style={styles.galleryCard} elevation={3}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.galleryImage}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.galleryOverlay}>
                  <Text variant="titleMedium" style={styles.galleryTitle}>
                    {item.title}
                  </Text>
                  <Button
                    mode="text"
                    textColor='#fff'
                    compact
                    onPress={() => console.log(`Ver ${item.title}`)}
                  >
                    Ver más
                  </Button>
                </View>
              </ImageBackground>
            </Card>
          ))}
        </ScrollView>

        {/* --- */}

        {/* 🧢 Productos Destacados (Lista mejorada) */}
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          **Productos Destacados**
        </Text>
        <Divider style={{ marginHorizontal: 16, marginBottom: 16 }} />
        <View style={styles.productListView}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>

        {/* --- */}

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            © 2025 GorraShop. Todos los derechos reservados.
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            Gracias por visitarnos 💙
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  // --- Header Flotante ---
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Asegura que esté por encima del ScrollView
    paddingHorizontal: 16,
    paddingVertical: 10,
    // Fondo opcional si no se usa BlurView (en este caso, transparente, la sombra hace el efecto flotante)
    backgroundColor: 'transparent',
  },
  searchBar: {
    borderRadius: 12,
  },
  contentScrollView: {
    flex: 1,
    paddingTop: 80, // **Importante:** Agrega espacio superior para que el SearchBar no tape el contenido
  },
  // --- Banner ---
  bannerCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  banner: {
    height: 180,
    justifyContent: 'center',
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#eee',
    textAlign: 'center',
    marginBottom: 10,
  },
  bannerButton: {
    marginTop: 10,
  },
  // --- Secciones Generales ---
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  // --- Categorías (Chips) ---
  categoriesScroll: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
    minHeight: 38,
    justifyContent: 'center',
  },
  // --- Galería (Cards) ---
  galleryScroll: {
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  galleryCard: {
    width: width * 0.7, // Ancho de 70% de la pantalla
    height: 140,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  galleryOverlay: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  galleryTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // --- Productos ---
  productListView: {
    paddingHorizontal: 16,
  },
  // --- Footer ---
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 40,
  },
});