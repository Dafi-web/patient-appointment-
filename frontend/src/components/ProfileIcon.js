import React from 'react';

const ProfileIcon = ({ firstName, lastName, email, size = 40, style = {} }) => {
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const getColor = () => {
    const name = `${firstName || ''}${lastName || ''}${email || ''}`;
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#330867',
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style
      }}
      title={`${firstName || ''} ${lastName || ''}`.trim() || email}
    >
      {getInitials()}
    </div>
  );
};

export default ProfileIcon;
