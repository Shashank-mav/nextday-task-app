// Import necessary modules from React and React Native
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main App Component
const App = () => {
  // State for storing the list of users and favorite users
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://reqres.in/api/users?page=2');
        const data = await response.json();
        // Add 'isFavorite' property to each user
        const usersWithFavorite = data.data.map(user => ({ ...user, isFavorite: false }));
        setUsers(usersWithFavorite);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Load favorites from AsyncStorage on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Toggle the favorite status of a user
  const toggleFavorite = async (user) => {
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, isFavorite: !u.isFavorite } : u));
    setUsers(updatedUsers);

    if (!user.isFavorite) {
      setFavorites((prevFavorites) => [...prevFavorites, user]);
    } else {
      setFavorites((prevFavorites) => prevFavorites.filter((u) => u.id !== user.id));
    }

    try {
      // Save updated favorites to AsyncStorage
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Remove a user from the favorites list
  const removeFromFavorites = (user) => {
    const updatedFavorites = favorites.filter((u) => u.id !== user.id);
    setFavorites(updatedFavorites);

    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, isFavorite: false } : u));
    setUsers(updatedUsers);

    // Save updated favorites to AsyncStorage
    AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Render individual user item
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Image
          source={item.isFavorite ? require('./assets/unfavorite.png') : require('./assets/favorite.png')}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </View>
  );

  // Render individual favorite item
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromFavorites(item)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // Main App UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
      />
      <Text style={styles.title}>Favorite List</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
        />
      ) : (
        <Text style={styles.emptyFavorites}>No favorites yet</Text>
      )}
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#666',
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  removeButton: {
    color: 'red',
  },
  emptyFavorites: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

// Export the App component as the default export
export default App;
