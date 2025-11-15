import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button, useTheme, Surface, Avatar, Divider } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';

export default function LoginScreenModern() {
    const theme = useTheme();
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const accentColor = "#f72585";

    const handleLogin = async () => {
        setError(null);

        if (!email || !password) {
            setError("Por favor, ingresa tu email y contraseña.");
            return;
        }

        setLoading(true);
        const res = await login(email, password);
        setLoading(false);

        if (res.ok) {
            if (res.user?.id === 1) router.replace("/");
            else router.replace("/admin/AdminDashboardScreen");
        } else {
            setError(res.error || "Error de inicio de sesión.");
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
            <Surface style={[styles.loginCard, { backgroundColor: theme.colors.surface }]} elevation={5}>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Avatar.Icon
                        size={60}
                        icon="account"
                        style={{ backgroundColor: accentColor }}
                        color="#fff"
                    />
                    <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                        Bienvenido a GorraShop
                    </Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20 }}>
                        Accede a tu cuenta para comprar
                    </Text>
                </View>

                {/* Error */}
                {error && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                )}

                {/* Inputs */}
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
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    outlineStyle={styles.inputOutline}
                />

                {/* Olvidaste tu contraseña */}
                <TouchableOpacity onPress={() => console.log("Recuperar contraseña")} style={styles.forgotPassword}>
                    <Text style={[styles.link, { color: theme.colors.primary }]}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                </TouchableOpacity>

                {/* Botón Login */}
                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    style={[styles.button, { backgroundColor: accentColor }]}
                    labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                >
                    Entrar a mi Cuenta
                </Button>

                <Divider style={styles.divider} />

                {/* Registro */}
                <TouchableOpacity onPress={() => router.push("/components/RegisterScreen")} style={styles.registerLink}>
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                        ¿Aún no tienes cuenta?
                        <Text style={[styles.link, { color: theme.colors.primary }]}> Regístrate aquí</Text>
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
    loginCard: {
        padding: 25,
        borderRadius: 15,
        maxWidth: 400,
        width: "100%",
        alignSelf: "center",
    },
    logoContainer: {
        alignItems: "center",
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
        fontWeight: "500",
    },
    input: {
        marginBottom: 15,
    },
    inputOutline: {
        borderRadius: 10,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    button: {
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 15,
    },
    divider: {
        marginVertical: 15,
        marginHorizontal: 20,
    },
    registerLink: {
        marginTop: 10,
        alignItems: "center",
    },
    link: {
        fontWeight: "700",
    },
});
