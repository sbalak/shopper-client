import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function CartDetails() {
    const [cart, setCart] = useState([]);

  const load = async() => {
    try {
      const response = await axios.get(`https://shoppingcart-sandbox.azurewebsites.net/api/Cart/Details?userId=1`);
      setCart(response.data);
    }
    catch(error) {
      console.log(error);
    } 
  }
  
  const handleAddItem = async(userId: string, restaurantId: string, foodId: string) => {
    try {
      const response = await axios.get(`https://shoppingcart-sandbox.azurewebsites.net/api/Cart/Add`,
        {
          params: {
            userId: '1',
            restaurantId: restaurantId,
            foodId: foodId
          },
        });
      load();
    }
    catch(error) {
      console.log(error);
    } 
  }
  
  const handleRemoveItem = async(userId: string, restaurantId: string, foodId: string) => {
    try {
      const response = await axios.get(`https://shoppingcart-sandbox.azurewebsites.net/api/Cart/Remove`,
        {
          params: {
            userId: '1',
            restaurantId: restaurantId,
            foodId: foodId
          },
        });
      load();
    }
    catch(error) {
      console.log(error);
    } 
  }

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );
  
  return (
    <View>
        <View style={styles.cartDetailsContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{cart.restaurantName}</Text>
                <Text style={styles.subTitle}>{cart.restaurantLocality}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <FlatList data={cart.foodItems} scrollEnabled={false} renderItem={({item, index})=>( 
                    <View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataName}>{item.foodName}</Text>
                            <Text style={styles.dataValue}>₹{item.totalPrice}</Text>
                        </View>
                        
                        <View style={styles.cartItem}>
                            <Text style={styles.itemPrice}>₹{item.itemPrice}</Text>
                            <View style={styles.cartButtonContainer}>
                                <TouchableOpacity onPress={() => handleRemoveItem('1', cart.restaurantId, item.foodId)}>
                                    <Text style={styles.cartButton}><Ionicons name="remove-sharp" size={24} color="{color}" /></Text>
                                </TouchableOpacity>
                                <Text style={styles.cartButtonText}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => handleAddItem('1', cart.restaurantId, item.foodId)}>
                                    <Text style={styles.cartButton}><Ionicons name="add-sharp" size={24} color="{color}" /></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Bill Details</Text>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.billColumn}>
                    <Text style={styles.billName}>Item Total</Text>
                    <Text style={styles.billName}>CGST @ 2.5%</Text>
                    <Text style={styles.billName}>CGST @ 2.5%</Text>
                    <Text style={styles.billName}>Total</Text>
                    <Text style={styles.billName}>Total (Incl. GST)</Text>
                </View>
                <View style={styles.billColumn}>
                    <Text style={styles.billValue}>₹{cart.totalPrice}</Text>
                    <Text style={styles.billValue}>₹9.29</Text>
                    <Text style={styles.billValue}>₹9.29</Text>
                    <Text style={styles.billValue}>₹18.58</Text>
                    <Text style={styles.billValue}>₹408.58</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    cartDetailsContainer: {
        marginTop: 10
    },
    titleContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom:10,
        marginTop:10
    },
    title: {
        fontSize:20,
        fontFamily: 'outfit-bold'
    },
    subTitle: {
        color: Colors.LightGrey, 
        fontFamily: 'outfit'
    },
    detailsContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        flexDirection: 'row',   
    },
    dataRow: {
        fontFamily: 'outfit-medium',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dataName: {
        fontFamily: 'outfit-medium',
        fontSize: 16
    },
    dataValue: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.LightGrey
    },
    cartItem: {
        fontFamily: 'outfit',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cartButtonContainer: {
        flexDirection: 'row', 
        gap: 15, 
        backgroundColor: Colors.Primary, 
        paddingLeft: 15, 
        paddingRight: 15, 
        marginTop:5, 
        borderRadius: 15
    },
    cartButton: {
        fontFamily: 'outfit',
        fontSize: 20,
        color: Colors.LighterGrey
    },
    cartButtonText: {
        fontFamily: 'outfit',
        marginTop: 4,
        fontSize: 14,
        color: Colors.LighterGrey
    },
    itemPrice: {
        marginTop: 7,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.LightGrey
    },
    billColumn: {
        fontFamily: 'outfit-medium',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width:100,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    billName: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        paddingBottom: 5,
    },
    billValue: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.LightGrey,
        textAlign: 'right'
    }
})