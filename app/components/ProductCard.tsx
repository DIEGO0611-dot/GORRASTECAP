import React from 'react';
import { View, Linking, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Card, Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';

type Product = {
    id: number;
    name: string;
    price: string | number;
    image: string;
};

export default function ProductCardModern({ product }: { product: Product }) {
    if (!product) return null;

    const router = useRouter();
    const theme = useTheme();
    const { addToCart, removeFromCart, cartItems } = useCart();
    const isInCart = cartItems.some(item => item.id === product.id);

    const accentColor = '#f72585';
    const whatsAppColor = '#25D366';

    const handleWhatsApp = () => {
        const phone = '573001112233';
        const message = `Hola, estoy interesado en el producto: ${product.name}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada.');
        });
    };

    const handleCartAction = () => {
        if (isInCart) {
            removeFromCart(product.id);
            Toast.show({ type: 'info', text1: 'Quitado del carrito', text2: `${product.name} fue eliminado.`, position: 'bottom' });
        } else {
            addToCart(product);
            Toast.show({ type: 'success', text1: '¡Producto agregado!', text2: `${product.name} fue añadido al carrito.`, position: 'bottom' });
        }
    };

    const price = product.price ? Number(product.price) : 0;

    return (
        <Card style={styles.cardContainer} elevation={4}>
            {isInCart && (
                <View style={[styles.cartBadge, { backgroundColor: theme.colors.primary }]}>
                    <MaterialCommunityIcons name="check-bold" size={16} color="#fff" />
                    <Text style={styles.cartBadgeText}>En Carrito</Text>
                </View>
            )}

            <TouchableOpacity onPress={() => router.push({ pathname: '/product/[id]', params: product })} activeOpacity={0.8}>
                <Card.Cover
                    source={{ uri: product.image || 'https://picsum.photos/300/220' }}
                    style={styles.cardCover}
                    resizeMode="cover"
                />
            </TouchableOpacity>

            <Card.Content style={styles.cardContent}>
                <Text variant="titleMedium" style={styles.titleText}>{product.name}</Text>
                <Text variant="headlineSmall" style={[styles.priceText, { color: accentColor }]}>
                    ${price.toLocaleString('es-CO')}
                </Text>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    icon={({ size, color }) => (
                        <MaterialCommunityIcons name={isInCart ? "minus-circle-outline" : "plus-circle-outline"} size={size} color={color} />
                    )}
                    mode="contained"
                    onPress={handleCartAction}
                    style={[styles.actionButton, { backgroundColor: isInCart ? theme.colors.surfaceVariant : accentColor }]}
                    textColor={isInCart ? theme.colors.onSurfaceVariant : '#fff'}
                >
                    {isInCart ? 'Quitar del Carrito' : 'Agregar al Carrito'}
                </Button>

                <View style={styles.secondaryActions}>
                    <Button
                        icon={({ size, color }) => <Ionicons name="eye-outline" size={size} color={color} />}
                        mode="outlined"
                        onPress={() => router.push({ pathname: '/product/[id]', params: product })}
                        style={styles.halfButton}
                        textColor={theme.colors.secondary}
                        labelStyle={{ fontWeight: '700' }}
                    >
                        Ver Detalle
                    </Button>

                    <TouchableOpacity style={styles.whatsappFab} onPress={handleWhatsApp}>
                        <FontAwesome name="whatsapp" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    cardContainer: { marginBottom: 24, marginHorizontal: 1, borderRadius: 18, backgroundColor: '#fff', overflow: 'visible' },
    cardCover: { borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 220 },
    cardContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    titleText: { fontWeight: '700', fontSize: 20, marginBottom: 4 },
    priceText: { fontWeight: '900', fontSize: 20 },
    cardActions: { flexDirection: 'column', gap: 10, padding: 16, paddingTop: 8 },
    actionButton: { width: '100%', borderRadius: 10, paddingVertical: 4 },
    secondaryActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 4 },
    halfButton: { flex: 1, borderRadius: 10, paddingVertical: 4 },
    cartBadge: { position: 'absolute', top: -10, right: 15, zIndex: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, ...Platform.select({ ios: { shadowOffset: { width: 0, height: 2 } } }) },
    cartBadgeText: { color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
    whatsappFab: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#25D366', shadowOpacity: 0.3, shadowRadius: 6 },
});
