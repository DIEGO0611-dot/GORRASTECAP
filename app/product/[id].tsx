import React, { useState, useEffect } from 'react';
import { View, Linking, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Button, useTheme, Surface } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';
import { api } from '../../helper/api';

const MOCK_COLORS = [
    { name: 'Negro', code: '#000000' },
    { name: 'Rojo', code: '#d63031' },
    { name: 'Blanco', code: '#ffffff' },
    { name: 'Rosa', code: '#f72585' },
];

const { height } = Dimensions.get('window');

export default function ProductDetailModern() {
    const params = useLocalSearchParams<{ id: string }>();
    const productId = params.id ? Number(params.id) : 0;

    const router = useRouter();
    const theme = useTheme();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(MOCK_COLORS[0]);
    const [quantity, setQuantity] = useState(1);

    // Fetch producto desde PHP
    useEffect(() => {
        if (!productId) return;

        fetch(`${api}getProduct.php?id=${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    Toast.show({ type: 'error', text1: 'Error', text2: data.error });
                } else {
                    setProduct(data);
                }
            })
            .catch(err => {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo cargar el producto' });
            })
            .finally(() => setLoading(false));
    }, [productId]);

    const handleBuy = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: `${product.nombre} (${selectedColor.name})`,
            price: Number(product.precio),
            image: product.imagen || 'https://placehold.co/600x400/cccccc/333333?text=Sin+Imagen',
            quantity,
        });

        Toast.show({
            type: 'success',
            text1: '¡Producto agregado!',
            text2: `${product.nombre} (x${quantity}) agregado al carrito.`,
        });
    };

    const handleWhatsApp = () => {
        if (!product) return;
        const phone = '573001112233';
        const message = `Hola, estoy interesado en la gorra: ${product.nombre} (Color: ${selectedColor.name}, Cantidad: ${quantity})`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo abrir WhatsApp' });
        });
    };

    if (loading) return <Text style={{ padding: 20 }}>Cargando producto...</Text>;
    if (!product) return <Text style={{ padding: 20 }}>Producto no encontrado</Text>;

    const productPrice = Number(product.precio);

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
            <Surface elevation={2} style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconContainer}>
                    <Ionicons name="arrow-back-outline" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>Detalle de Producto</Text>
                <TouchableOpacity onPress={() => router.push('/CartItem')} style={styles.headerIconContainer}>
                    <Ionicons name="cart-outline" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
            </Surface>

            <ScrollView style={styles.contentScroll} contentContainerStyle={styles.scrollContent}>
                <Image
                    source={{ uri: product.imagen || 'https://placehold.co/600x400/cccccc/333333?text=Sin+Imagen' }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                <View style={styles.detailsContainer}>
                    <Text variant="headlineMedium" style={styles.productName}>{product.nombre}</Text>
                    <Text variant="bodyLarge" style={styles.productDescription}>{product.descripcion}</Text>

                    {/* Selector de Color */}
                    <View style={styles.optionSection}>
                        <Text variant="titleMedium" style={styles.optionTitle}>Color Seleccionado: {selectedColor.name}</Text>
                        <View style={styles.colorSelectorRow}>
                            {MOCK_COLORS.map(c => (
                                <TouchableOpacity 
                                    key={c.code} 
                                    onPress={() => setSelectedColor(c)}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: c.code },
                                        selectedColor.code === c.code && styles.selectedColorBorder
                                    ]}
                                >
                                    {selectedColor.code === c.code && (
                                        <MaterialCommunityIcons 
                                            name="check-circle" 
                                            size={20} 
                                            color={c.code === '#ffffff' ? theme.colors.primary : '#fff'} 
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Cantidad */}
                    <View style={styles.optionSection}>
                        <Text variant="titleMedium" style={styles.optionTitle}>Cantidad</Text>
                        <View style={styles.quantitySelector}>
                            <Button mode="outlined" icon="minus" compact onPress={() => setQuantity(q => Math.max(1, q -1))} disabled={quantity <= 1} />
                            <Text variant="bodyLarge" style={styles.qtyText}>{quantity}</Text>
                            <Button mode="outlined" icon="plus" compact onPress={() => setQuantity(q => q + 1)} />
                        </View>
                    </View>

                    <Button icon="whatsapp" mode="outlined" onPress={handleWhatsApp} textColor="#25D366" labelStyle={{ fontWeight: 'bold' }}>
                        Preguntar por WhatsApp
                    </Button>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <Surface elevation={10} style={[styles.stickyFooter, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.priceContainer}>
                    <Text variant="titleMedium">Precio Total</Text>
                    <Text variant="headlineLarge" style={{ color: theme.colors.primary, fontWeight: '900' }}>
                        ${(productPrice * quantity).toLocaleString('es-CO')}
                    </Text>
                </View>
                <Button mode="contained" onPress={handleBuy} style={styles.cartButton} icon="cart">
                    Añadir al Carrito
                </Button>
            </Surface>
        </View>
    );
}

// --- Estilos --- (puedes usar los tuyos existentes)
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    // --- Header ---
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerIconContainer: {
        padding: 8,
    },
    contentScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 60,
    },
    productImage: {
        width: '100%',
        height: height * 0.4,
        marginBottom: 16,
    },
    carouselIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
    },
    detailsContainer: {
        paddingHorizontal: 24,
    },
    productName: {
        fontWeight: '900',
        marginBottom: 10,
    },
    productDescription: {
        fontSize: 14,
        color: '#777',
        marginBottom: 32,
        lineHeight: 20,
    },
    optionSection: {
        marginBottom: 24,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    colorSelectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    selectedColorBorder: {
        borderColor: '#f72585',
        borderWidth: 4,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    qtyButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    qtyText: {
        paddingHorizontal: 12,
        fontWeight: 'bold',
    },
    whatsappButton: {
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderColor: '#25D366',
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    priceContainer: {
        flex: 1,
        marginRight: 10,
    },
    cartButton: {
        flex: 2,
        borderRadius: 12,
        paddingVertical: 4,
    },
});
