import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { api } from '../../helper/api';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const cardSpacing = 12;
const cardWidth = (screenWidth - cardSpacing * 3) / 2;

export default function CategoriesModernGrid() {
    const theme = useTheme();
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`${api}categoria.php`) // Cambia a tu endpoint real
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
    }, []);

    const handlePress = (category: any) => {
        router.push({
            pathname: '/category-products/[id]',
            params: { id: category.id },
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={{ width: cardWidth }} onPress={() => handlePress(item)} activeOpacity={0.85}>
            <Card style={styles.cardContainer} elevation={5}>
                <Card.Cover source={{ uri: item.imagen }} style={styles.cardCover} resizeMode="cover" />
                <Card.Content style={styles.cardContent}>
                    <Text variant="titleMedium" style={[styles.categoryName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                        {item.nombre}
                    </Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
                🧢 Explora Todas las Categorías
            </Text>

            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                columnWrapperStyle={styles.rowSpacing}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontWeight: '700', marginBottom: 14 },
    rowSpacing: { justifyContent: 'space-between', marginBottom: 14 },
    listContainer: { paddingBottom: 20 },
    cardContainer: { borderRadius: 18, backgroundColor: '#fff', overflow: 'visible' },
    cardCover: { height: 180, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
    cardContent: { paddingVertical: 14, alignItems: 'center' },
    categoryName: { fontWeight: '700', textAlign: 'center', fontSize: 17 },
});
