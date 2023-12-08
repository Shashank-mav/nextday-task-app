// FavoritesList.js
import React from 'react';
import { FlatList } from 'react-native';
import UserItem from './UserItem';

const FavoritesList = ({ favorites, onToggleFavorite }) => {
  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <UserItem user={item} onToggleFavorite={onToggleFavorite} />}
    />
  );
};

export default FavoritesList;
