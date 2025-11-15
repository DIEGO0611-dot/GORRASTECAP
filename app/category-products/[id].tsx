import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { api } from '../../helper/api';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const cardSpacing = 12;
const cardWidth = (screenWidth - cardSpacing * 3) / 2;

export default function CategoryProducts() {
    const theme = useTheme();
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            axios.get(`${api}productos_por_categoria.php?id=${id}`)
                .then(res => setProducts(res.data))
                .catch(err => console.log(err));
        }
    }, [id]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={{ width: cardWidth }} activeOpacity={0.85}>
            <Card style={styles.cardContainer} elevation={5}  onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}>
                <Card.Cover source={{ uri: item.imagen }} style={styles.cardCover} resizeMode="cover" />
                <Card.Content style={styles.cardContent}>
                    <Text variant="titleMedium" style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                        {item.nombre}
                    </Text>
                    <Text style={{ fontWeight: '600', color: theme.colors.primary }}>
                        ${item.precio}
                    </Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
                🧢 Productos en "{name}"
            </Text>

            <FlatList
                data={products}
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
    productName: { fontWeight: '700', textAlign: 'center', fontSize: 16 },
});
