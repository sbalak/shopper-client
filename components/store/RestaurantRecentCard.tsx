import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { common } from '@/constants/Styles';

export default function RestaurantRecentCard({restaurant}: {restaurant: any}) {
  return (    
    <TouchableOpacity style={styles.restaurantContainer} onPress={() => router.push('/store/'+restaurant.id)}>
        <View style={styles.restaurantInfo}>
            <Text style={common.subHeading}>{restaurant.name}</Text>
            <Text style={[common.text, styles.restaurantSubtitle]}>{restaurant.locality}</Text>
            <Text style={[common.text, styles.restaurantSubtitle]}>{restaurant.cuisine} • {restaurant.distance} kms</Text>
            <Text style={[common.text, styles.restaurantVisit]}>Last ordered on {restaurant.formattedDateOrdered}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    restaurantContainer: {
        backgroundColor: Colors.White,
        marginRight: 10,
        padding: 10,
        borderRadius: 15
    },
    restaurantImage: {
        width: 200,
        height: 200,
        borderRadius:15
    },
    restaurantInfo: {
    },
    restaurantSubtitle: {
        width:200
    },
    restaurantVisit: {
        fontSize: 10,
        width:200
    }
});