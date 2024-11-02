import { View, Text, Touchable, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function index() {

  const { authState, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      
      <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={80} color={Colors.Primary} style={styles.profileImage}/> 
        <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Sidharth Balakrishnan</Text>
            <Text style={styles.profileSubtitle} onPress={() => router.navigate("/settings/profile")}>Edit Profile</Text>
        </View>        
      </View>      
      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'row',
    marginTop:20
  },
  title: {
    fontSize:20,
    fontFamily: 'outfit-bold'
    },
  profileContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row'
  },
  profileImage: {
      width: 80,
      height: 80,
      borderRadius:15
  },
  profileInfo: {
      marginTop: 7,
      marginLeft: 10
  },
  profileTitle: {
      fontFamily: 'outfit-medium',
      fontSize: 18
  },
  profileSubtitle: {
      fontFamily: 'outfit',
      fontSize: 14,
      color: Colors.LightGrey
  },
  logoutButton: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    padding:10,
    backgroundColor: Colors.Primary,
    justifyContent: "center", 
    alignItems: "center"
  },
  logoutButtonText: {
    fontFamily: 'outfit',
    color: Colors.LighterGrey
  }
})