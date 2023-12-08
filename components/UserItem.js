// UserItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const UserItem = ({ user, onToggleFavorite }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <Image source={{ uri: user.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text>{user.first_name} {user.last_name}</Text>
        <Text>{user.email}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(user)}>
        <Image
          source={user.isFavorite ? require('./assets/favorite.png') : require('./assets/unfavorite.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserItem;
