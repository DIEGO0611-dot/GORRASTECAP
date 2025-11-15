import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Card, Divider, List, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Mock de opciones de menú
const menuOptions = [
    { title: 'Mis Pedidos', icon: 'truck-delivery-outline', target: 'orders' },
    { title: 'Lista de Deseos', icon: 'heart-outline', target: 'wishlist' },
    { title: 'Direcciones de Envío', icon: 'map-marker-outline', target: 'addresses' },
    { title: 'Ajustes de Cuenta', icon: 'cog-outline', target: 'settings' },
];

export default function ProfileModernFinal() {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    const isLoggedIn = !!user;
    const accentColor = '#f72585';

    // Obtener la primera letra del nombre para el Avatar, manejando null
    const avatarLabel = isLoggedIn && user?.nombre ? user.nombre[0].toUpperCase() : "U";
    
    // Función para manejar la navegación o mostrar alerta si no está logueado
    const handleMenuPress = (target: string) => {
        if (isLoggedIn) {
            router.push(target);
        }
        // No es necesario else, el estilo y el `activeOpacity` ya indican que está deshabilitado
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* 1. Header Dinámico */}
            <View style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
                
                {isLoggedIn && (
                    <IconButton
                        icon="pencil-outline"
                        size={24}
                        iconColor={theme.colors.onSurface}
                        style={styles.editButton}
                        onPress={() => router.push('settings')} // Ejemplo de ruta de edición
                    />
                )}

                <TouchableOpacity activeOpacity={0.8}>
                    <Avatar.Text
                        label={avatarLabel}
                        size={isLoggedIn ? 90 : 80} // Avatar más grande si está logueado
                        style={[styles.avatar, { backgroundColor: accentColor }]}
                        labelStyle={{ fontSize: isLoggedIn ? 38 : 32, color: 'white' }}
                    />
                </TouchableOpacity>

                <Text variant="titleLarge" style={[styles.username, { color: theme.colors.onSurface }]}>
                    {isLoggedIn ? `👋 Hola, ${user.nombre}` : '👤 Hola, Invitado'}
                </Text>

                <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                    {isLoggedIn
                        ? user?.email // Usar optional chaining por seguridad
                        : 'Inicia sesión para acceder a pedidos, favoritos y más.'}
                </Text>
            </View>

            {/* 2. Login Card (Solo si no está logueado) */}
            {!isLoggedIn && (
                <Card style={styles.loginCard} elevation={4}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            Accede a tus beneficios
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => router.push('/auth/login')}
                            style={[styles.button, { backgroundColor: accentColor }]}
                            labelStyle={{ fontWeight: 'bold', fontSize: 15 }}
                            icon="lock-open-outline"
                        >
                            Iniciar Sesión / Registrarse
                        </Button>
                    </Card.Content>
                </Card>
            )}

            {/* 3. Menu Options */}
            <Text variant="titleMedium" style={[styles.menuTitle, { color: theme.colors.onSurface }]}>
                Opciones y Servicios
            </Text>

            <Card style={styles.menuCard} elevation={2}>
                {menuOptions.map((item, index) => (
                    <React.Fragment key={item.target}>
                        {/* Usamos el List.Item directamente dentro de TouchableOpacity */}
                        <TouchableOpacity
                            activeOpacity={isLoggedIn ? 0.7 : 1}
                            onPress={() => handleMenuPress(item.target)}
                            style={{ opacity: isLoggedIn ? 1 : 0.6 }} // Opacidad del contenedor táctil
                        >
                            <List.Item
                                title={item.title}
                                description={isLoggedIn ? undefined : 'Inicia sesión para ver'}
                                left={props => (
                                    <List.Icon
                                        {...props}
                                        icon={item.icon}
                                        color={isLoggedIn ? theme.colors.primary : theme.colors.outline}
                                    />
                                )}
                                right={props => (
                                    <List.Icon {...props} icon="chevron-right" color={theme.colors.outline} />
                                )}
                                // Importante: Remover estilos de opacidad o onPress del List.Item para que el TouchableOpacity tome el control
                            />
                        </TouchableOpacity>

                        {index < menuOptions.length - 1 && <Divider inset />}
                    </React.Fragment>
                ))}
            </Card>

            {/* 4. Logout */}
            {isLoggedIn && (
                <Button
                    mode="text"
                    icon="logout"
                    onPress={logout}
                    style={styles.logoutButton}
                    textColor={theme.colors.error}
                >
                    Cerrar Sesión
                </Button>
            )}

            {/* 5. Footer */}
            <View style={styles.footer}>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    © 2025 GorraShop · Todos los derechos reservados
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { paddingBottom: 40 },
    header: {
        paddingTop: 40, // Más espacio arriba para un look más premium
        paddingBottom: 30,
        alignItems: 'center',
        marginBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'relative', // Para posicionar el botón de edición
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    avatar: { marginBottom: 10, elevation: 6 },
    username: { marginBottom: 4, fontWeight: '900' }, // Negrita más marcada
    infoText: { textAlign: 'center', fontSize: 14, paddingHorizontal: 20 },
    loginCard: { marginHorizontal: 16, marginBottom: 30, borderRadius: 15 },
    cardTitle: { marginBottom: 16, textAlign: 'center', fontWeight: '700' },
    button: { borderRadius: 10, marginBottom: 12, paddingVertical: 5 },
    menuTitle: { fontWeight: '700', paddingHorizontal: 16, marginBottom: 10 },
    menuCard: {
        marginHorizontal: 16,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    logoutButton: { marginHorizontal: 16, marginTop: 10 },
    footer: { alignItems: 'center', marginTop: 30, marginBottom: 10 },
});