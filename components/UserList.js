// UsersList.js
import React from 'react';
import { FlatList } from 'react-native';
import UserItem from './UserItem';

const UsersList = ({ users, onToggleFavorite }) => {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <UserItem user={item} onToggleFavorite={onToggleFavorite} />}
    />
  );
};

export default UsersList;
