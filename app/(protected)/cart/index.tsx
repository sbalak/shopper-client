import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import CartDetails from '@/components/cart/CartDetails'
import { useNavigation } from '@react-navigation/native';

export default function index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Cart' });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <CartDetails />
      </ScrollView>
    </SafeAreaView>   
  )
}