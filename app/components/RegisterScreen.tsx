import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button, useTheme, Surface, Avatar, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { AntDesign } from '@expo/vector-icons';

export default function RegisterScreenModern() {
    const theme = useTheme();
    const { register } = useAuth(); // Asumiendo que useAuth es funcional
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const accentColor = '#f72585';
    const googleColor = '#DB4437';

    const handleRegister = async () => {
        setError(null);
        if (!nombre || !email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);
        // Simulación de la respuesta de registro
        const res: { ok: boolean, error?: string } = await register(nombre, email, password);
        setLoading(false);

        if (res.ok) {
            alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            router.replace("/components/LoginScreen"); // Usar replace para evitar volver al registro con el botón de retroceso
        } else {
            setError(res.error || "Error al crear la cuenta. Intenta con otro correo.");
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
            
            <Surface style={[styles.registerCard, { backgroundColor: theme.colors.surface }]} elevation={5}>
                
                {/* Logo / Branding */}
                <View style={styles.logoContainer}>
                    <Avatar.Icon 
                        size={60} 
                        icon="account-plus-outline" 
                        style={{ backgroundColor: accentColor }} 
                        color={theme.colors.onPrimary}
                    />
                    <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                        Únete a **GorraShop**
                    </Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20 }}>
                        Crea tu cuenta en segundos
                    </Text>
                </View>

                {/* Mensaje de Error */}
                {error && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                )}

                {/* Campos del Formulario */}
                <TextInput
                    label="Nombre Completo"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                    mode="outlined"
                    left={<TextInput.Icon icon="account-outline" />}
                    outlineStyle={styles.inputOutline}
                />
                
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email-outline" />}
                    outlineStyle={styles.inputOutline}
                />

                <TextInput
                    label="Contraseña (mín. 6 caracteres)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    outlineStyle={styles.inputOutline}
                />

                {/* Botón Principal de Registro */}
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={loading}
                    style={[styles.button, { backgroundColor: accentColor }]}
                    labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                >
                    Crear Cuenta
                </Button>
                
                <Divider style={styles.divider} />
S

                {/* Enlace a Login */}
                <TouchableOpacity onPress={() => router.push("/components/LoginScreen")} style={styles.loginLink}>
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                        ¿Ya tienes cuenta? 
                        <Text style={[styles.link, { color: theme.colors.primary }]}> Inicia sesión</Text>
                    </Text>
                </TouchableOpacity>

            </Surface>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    registerCard: {
        padding: 25,
        borderRadius: 15,
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center', 
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { 
        textAlign: "center", 
        marginTop: 10,
        fontWeight: "900",
    },
    errorText: {
        textAlign: "center",
        marginBottom: 10,
        fontWeight: '500',
    },
    input: { 
        marginBottom: 15,
    },
    inputOutline: {
        borderRadius: 10,
    },
    button: { 
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 5,
    },
    divider: {
        marginVertical: 15,
        marginHorizontal: 20,
    },
    googleButton: {
        borderRadius: 10,
        borderWidth: 2,
        paddingVertical: 4,
        marginBottom: 25,
    },
    loginLink: {
        marginTop: 10,
        alignItems: 'center',
    },
    link: {
        fontWeight: "700",
    },
});