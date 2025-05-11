import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <div>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;