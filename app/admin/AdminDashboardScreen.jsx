import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
    Text,
    Button,
    TextInput,
    Card,
    Divider,
    useTheme,
    IconButton,
    List,
    FAB
} from "react-native-paper";
import axios from "axios";
import { api } from "../../helper/api";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";


export default function AdminDashboardModern() {
    const theme = useTheme();
    const accentColor = "#f72585";

    const { logout } = useAuth(); // 🔥 Cerrar sesión

    const [categorias, setCategorias] = useState([]);

    const [categoriaNombre, setCategoriaNombre] = useState("");
    const [productoNombre, setProductoNombre] = useState("");
    const [productoPrecio, setProductoPrecio] = useState("");
    const [productoDescripcion, setProductoDescripcion] = useState("");
    const [productoImagenUrl, setProductoImagenUrl] = useState("");
    const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(null);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        setLoadingCategories(true);
        try {
            const res = await axios.get(`${api}categorias.php`);
            setCategorias(res.data || []);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const crearCategoria = async () => {
        if (!categoriaNombre) return alert("El nombre de la categoría es obligatorio.");

        setLoadingCreate(true);
        try {
            await axios.post(`${api}crear_categoria.php`, {
                nombre: categoriaNombre,
            });

            alert(`Categoría "${categoriaNombre}" creada con éxito.`);
            setCategoriaNombre("");
            obtenerCategorias();
        } catch (error) {
            alert("Error al crear categoría.");
        } finally {
            setLoadingCreate(false);
        }
    };

    const crearProducto = async () => {
        if (!productoNombre || !productoPrecio || !productoDescripcion || !categoriaSeleccionadaId) {
            return alert("Faltan campos obligatorios o la categoría no ha sido seleccionada.");
        }

        setLoadingCreate(true);
        try {
            await axios.post(`${api}crear_producto.php`, {
                nombre: productoNombre,
                descripcion: productoDescripcion,
                precio: productoPrecio,
                imagen_url: productoImagenUrl,
                categoria_id: categoriaSeleccionadaId,
            });

            alert(`Producto "${productoNombre}" creado con éxito.`);
            setProductoNombre("");
            setProductoDescripcion("");
            setProductoPrecio("");
            setProductoImagenUrl("");
            setCategoriaSeleccionadaId(null);

        } catch (error) {
            alert("Error al crear producto.");
        } finally {
            setLoadingCreate(false);
        }
    };

    const CategorySelector = () => (
        <View style={styles.categorySelectorContainer}>
            <Text variant="titleSmall" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                Asignar a Categoría
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categorias.map((c) => (
                    <Button
                        key={c.id}
                        mode={categoriaSeleccionadaId === c.id ? "contained" : "outlined"}
                        onPress={() => setCategoriaSeleccionadaId(c.id)}
                        style={[
                            styles.categoryButton,
                            categoriaSeleccionadaId === c.id ? { backgroundColor: accentColor } : {}
                        ]}
                        labelStyle={{ fontWeight: "700" }}
                        textColor={categoriaSeleccionadaId === c.id ? theme.colors.onPrimary : theme.colors.primary}
                    >
                        {c.nombre}
                    </Button>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
                    🛠️ Panel de Administración
                </Text>
                <Text variant="titleSmall" style={{ color: theme.colors.onBackground, marginBottom: 20 }}>
                    Gestión de Inventario (GorraShop)
                </Text>

                {/* -------------------------------------------------------------- */}
                {/*                      GESTIÓN DE CATEGORÍAS                     */}
                {/* -------------------------------------------------------------- */}
                <Card style={styles.card} elevation={5}>
                    <Card.Title
                        title="Crear Nueva Categoría"
                        titleVariant="titleLarge"
                        left={(props) => <List.Icon {...props} icon="folder-plus-outline" color={accentColor} />}
                    />
                    <Divider />

                    <Card.Content style={{ paddingTop: 20 }}>
                        <TextInput
                            label="Nombre de la categoría"
                            value={categoriaNombre}
                            onChangeText={setCategoriaNombre}
                            style={styles.input}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            left={<TextInput.Icon icon="label-outline" />}
                        />

                        <Button
                            mode="contained"
                            onPress={crearCategoria}
                            style={[styles.button, { backgroundColor: accentColor }]}
                            labelStyle={{ fontWeight: "bold" }}
                            loading={loadingCreate}
                            disabled={!categoriaNombre || loadingCreate}
                        >
                            Crear Categoría
                        </Button>

                        <Divider style={{ marginVertical: 25 }} />

                        <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                            Categorías Existentes ({categorias.length})
                        </Text>

                        {loadingCategories && <Text style={{ textAlign: "center", marginVertical: 10 }}>Cargando...</Text>}

                        <View style={styles.categoryList}>
                            {categorias.map((c) => (
                                <View key={c.id} style={[styles.categoryPill, { backgroundColor: theme.colors.surfaceVariant }]}>
                                    <Text style={{ color: theme.colors.onSurface }}>{c.nombre}</Text>

                                    <IconButton
                                        icon="delete-outline"
                                        size={16}
                                        iconColor={theme.colors.error}
                                        onPress={() => console.log(`Eliminar ${c.nombre}`)}
                                    />
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>


                {/* -------------------------------------------------------------- */}
                {/*                      GESTIÓN DE PRODUCTOS                      */}
                {/* -------------------------------------------------------------- */}
                <Card style={styles.card} elevation={5}>
                    <Card.Title
                        title="Crear Nuevo Producto"
                        titleVariant="titleLarge"
                        left={(props) => <List.Icon {...props} icon="shopping-outline" color={accentColor} />}
                    />
                    <Divider />

                    <Card.Content style={{ paddingTop: 20 }}>
                        <TextInput
                            label="Nombre del producto"
                            value={productoNombre}
                            onChangeText={setProductoNombre}
                            style={styles.input}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            left={<TextInput.Icon icon="format-title" />}
                        />

                        <TextInput
                            label="Descripción"
                            value={productoDescripcion}
                            onChangeText={setProductoDescripcion}
                            style={styles.input}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            outlineStyle={styles.inputOutline}
                            left={<TextInput.Icon icon="text-box-multiple-outline" />}
                        />

                        <TextInput
                            label="URL de Imagen"
                            value={productoImagenUrl}
                            onChangeText={setProductoImagenUrl}
                            style={styles.input}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            left={<TextInput.Icon icon="image-outline" />}
                        />

                        <TextInput
                            label="Precio"
                            keyboardType="numeric"
                            value={productoPrecio}
                            onChangeText={setProductoPrecio}
                            style={styles.input}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            left={<TextInput.Icon icon="currency-usd" />}
                        />

                        {categorias.length > 0 ? (
                            <CategorySelector />
                        ) : (
                            <Text style={{ textAlign: "center", marginVertical: 10 }}>
                                No hay categorías. Crea una primero.
                            </Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={crearProducto}
                            loading={loadingCreate}
                            disabled={!productoNombre || !productoPrecio || !categoriaSeleccionadaId || loadingCreate}
                            style={[styles.button, styles.createProductButton, { backgroundColor: accentColor }]}
                            labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                        >
                            Crear Producto
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* 🔥 BOTÓN FLOTANTE PARA CERRAR SESIÓN */}
            <FAB

                icon="logout"
                label="Salir"
                mode="flat"
                color="white"
                style={styles.fab}
                onPress={() => router.push({ pathname: '/' })}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        marginBottom: 8,
        fontWeight: "900"
    },
    subtitle: {
        marginVertical: 10,
        fontWeight: "700"
    },
    card: {
        marginBottom: 25,
        borderRadius: 15
    },
    input: {
        marginBottom: 10
    },
    inputOutline: {
        borderRadius: 10,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 4,
    },
    categoryList: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    categoryPill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    categorySelectorContainer: {
        marginVertical: 10,
    },
    categoryScroll: {
        paddingVertical: 5,
    },
    categoryButton: {
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    createProductButton: {
        marginTop: 20,
    },

    // ⭐ BOTÓN FLOTANTE
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#f72585",
        borderRadius: 30,
    },
});
