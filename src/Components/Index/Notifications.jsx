// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #12345 has been shipped and will arrive in 2-3 business days",
      time: "2 hours ago",
      read: false,
      type: "order"
    },
    {
      id: 2,
      title: "Special Offer",
      message: "20% discount on all fiction books this weekend only",
      time: "1 day ago",
      read: true,
      type: "promotion"
    },
    {
      id: 3,
      title: "Account Update",
      message: "Your profile information has been successfully updated",
      time: "3 days ago",
      read: true,
      type: "account"
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from seller regarding your recent order",
      time: "1 week ago",
      read: true,
      type: "message"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-[#102249]" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="ml-2 bg-[#102249] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-[#102249] hover:text-[#0a1a3a] font-medium"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  {/* Notification Icon */}
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                    ${notification.type === 'order' ? 'bg-green-100 text-green-600' : 
                      notification.type === 'promotion' ? 'bg-purple-100 text-purple-600' :
                      notification.type === 'account' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'}`}>
                    <FontAwesomeIcon 
                      icon={faBell} 
                      className="h-4 w-4" 
                    />
                  </div>

                  {/* Notification Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-[#102249] hover:text-[#0a1a3a] flex items-center"
                        >
                          <FontAwesomeIcon icon={faCheck} className="h-3 w-3 mr-1" />
                          Mark as read
                        </button>
                      )}
                      {notification.type === 'order' && (
                        <NavLink 
                          to="/orders/12345" 
                          className="text-xs text-[#102249] hover:text-[#0a1a3a] flex items-center"
                        >
                          <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 mr-1" />
                          View order
                        </NavLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <FontAwesomeIcon icon={faBell} className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">We'll notify you when something arrives.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
          <NavLink 
            to="/notification-settings" 
            className="text-sm text-[#102249] hover:text-[#0a1a3a] font-medium"
          >
            Notification settings
          </NavLink>
        </div>
      </div>
    </div>
  );
}