import { FlatList, ScrollView, StyleSheet, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import OrderCard from '@/components/order/OrderCard';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import {API_URL} from '@env';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation();

  const loadOrders = async() => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/order/list?userId=${authState.userId}&page=${currentPage}&pageSize=10`);
      if (response.data.length > 0) {
        setOrders((items) => items.concat(response.data));
        setCurrentPage(currentPage + 1);
      }
      setIsLoading(false);
    }
    catch(error) {
      console.log(error);
    } 
  }

  const onEndReached = async() => {
    if (!isLoading) {
      await loadOrders();
    }
  }

  const listFooterComponent = () => {
    return (
      <Text style={styles.footer}>You've reached the end</Text>
    );
  }
  
  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Order History' });
  }, []);
  
  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <FlatList data={orders} 
                    renderItem={({item, index})=>(
                      <OrderCard order={item} key={index} />
                    )}
                    keyExtractor={(item, index) => String(index)}
                    showsVerticalScrollIndicator={false}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={            
                      <View style={styles.titleContainer}>
                        <Text style={styles.title}>Past Orders</Text>
                      </View>
                    }
                    ListFooterComponent={listFooterComponent}
          />
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical:10
  },
  title: {
    fontSize:20,
    fontFamily: 'outfit-bold'
  },
  footer: {
    fontFamily: 'nunito-medium', 
    color: Colors.LightGrey, 
    textAlign: "center",
    marginBottom:20
  }
})