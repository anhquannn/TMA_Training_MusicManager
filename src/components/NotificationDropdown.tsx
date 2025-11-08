import React from 'react';
import { Bell } from 'lucide-react';

const NotificationDropdown: React.FC = () => {
  return (
    <button className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
      <Bell className="w-6 h-6" />
      {/* Future: badge count */}
    </button>
  );
};

export default NotificationDropdown;
