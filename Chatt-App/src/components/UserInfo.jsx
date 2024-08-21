import React from 'react';

const UserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return null;

  return (
    <div className="user-info">
      <img src={user.avatar} alt={`${user.username}'s avatar`} className="avatar" />
      <span>{user.username}</span>
    </div>
  );
};

export default UserInfo;
