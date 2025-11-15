import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme, StyleSheet, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const accentColor = '#f72585';
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/components/LoginScreen" />;
    }
    const floatingTabBarStyle = {
        position: 'absolute',
        borderTopWidth: 0,
        height: 75,
        paddingBottom: Platform.OS === 'ios' ? 4 : 8,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
    };

    const BlurBackground = ({ style }) => (
        <BlurView
            intensity={Platform.OS === 'ios' ? 30 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, style]}
        />
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: isDark ? '#b0b0b0' : '#888',
                tabBarStyle: floatingTabBarStyle,
                tabBarBackground: () => <BlurBackground />,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: -3,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'home' : 'home-outline'}
                            color={color}
                            size={size + 2}
                            accessibilityLabel="Inicio"
                            accessibilityRole="tab"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categorías',
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'compass' : 'compass-outline'}
                            color={color}
                            size={size + 2}
                            accessibilityLabel="Categorías"
                            accessibilityRole="tab"
                        />
                    ),
                }}
            />

            {/* FAB central */}
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Carrito",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="cart"
                            color={color}
                            size={28}
                            style={styles.cartIcon}
                        />
                    ),
                    tabBarItemStyle: styles.fabItem,
                    tabBarActiveTintColor: "#fff",
                }}
            />


            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Alertas',
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'bell' : 'bell-outline'}
                            color={color}
                            size={size + 2}
                            accessibilityLabel="Alertas"
                            accessibilityRole="tab"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'account-circle' : 'account-circle-outline'}
                            color={color}
                            size={size + 2}
                            accessibilityLabel="Perfil"
                            accessibilityRole="tab"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    fabItem: {
        top: -10,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f72585',
        elevation: 10,
        shadowColor: '#f72585',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        zIndex: 1,
    },
    cartIcon: {
        position: 'absolute',
        bottom: 8,
    },
});
