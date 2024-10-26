import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { Colors } from '@/constants/Colors';
import RestaurantRecentCard from '@/components/store/RestaurantRecentCard';
import RestaurantNearby from '@/components/store/RestaurantNearby';
import RestaurantRecent from '@/components/store/RestaurantRecent';

export default function store() {  
  const [restaurants, setRestaurants] = useState([]);

  const load = async() => {
    try {
      const response = await axios.get(`https://shoppingcart-sandbox.azurewebsites.net/api/restaurant/list`);
      setRestaurants(response.data);
    }
    catch(err) {
      console.log(err)
    } 
  }

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );
  
  return (
    <View>
      <RestaurantRecent restaurants={restaurants} />
      <RestaurantNearby restaurants={restaurants} />
    </View>
  )
}