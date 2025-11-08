import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/images/icon_app.png'; 

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onMouseEnterSidebar: () => void;
  onMouseLeaveSidebar: () => void;
  isMobileOverlay?: boolean; // NEW PROP: Để phân biệt Sidebar mobile overlay
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  onToggleSidebar,
  onMouseEnterSidebar, 
  onMouseLeaveSidebar,
  isMobileOverlay = false // Mặc định là false (cho desktop)
}) => {
  const navItems = [
    { name: 'Trang Chủ', icon: '🏠', path: '/dashboard' },
    { name: 'Đơn Hàng', icon: '📦', path: '/dashboard/orders' },
    { name: 'Đơn Trả Hàng', icon: '↩️', path: '/dashboard/return-orders' },
    { name: 'Kho Hàng', icon: '📝', path: '/dashboard/inventory' },
    { name: 'Yêu Cầu Nhập', icon: '➕', path: '/dashboard/transfer-requests' },
    { name: 'Phiếu Nhập', icon: '📥', path: '/dashboard/inbounds' },
    { name: 'Lịch Sử Kiểm Kho', icon: '📊', path: '/dashboard/inventory-checks' },
  ];

  return (
    <div 
      className={`
        h-screen p-4 
        bg-white/80 backdrop-blur-md border-r border-gray-100 shadow-xl 
        transition-all duration-300 ease-in-out z-30
        
        ${isMobileOverlay ? 
          `fixed top-0 left-0 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 
          `static ${isSidebarOpen ? 'w-64' : 'w-20'} md:shadow-none md:rounded-r-3xl md:overflow-hidden`
        }
      `}
      onMouseEnter={!isMobileOverlay ? onMouseEnterSidebar : undefined} 
      onMouseLeave={!isMobileOverlay ? onMouseLeaveSidebar : undefined} 
    >
      <div className="flex items-center justify-between pb-6 mb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {isSidebarOpen ? ( 
            <>
              <img src={logo} alt="App Logo" className="w-10 h-10 rounded-lg" />
              <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">MSA Grocery</h2>
            </>
          ) : ( 
            <img src={logo} alt="App Logo" className="w-10 h-10 rounded-lg mx-auto" /> 
          )}
        </div>
        
        {isMobileOverlay && (
          <button 
            onClick={onToggleSidebar} 
            className="p-2 text-gray-600 text-2xl hover:text-gray-900 focus:outline-none"
            aria-label="Đóng Sidebar"
          >
            &times;
          </button>
        )}
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={() => { if (isMobileOverlay) onToggleSidebar(); }} 
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl 
              hover:bg-green-100 hover:text-green-800 
              transition-all duration-200 ease-in-out transform hover:scale-[1.02]
              ${isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-700'}
              ${!isSidebarOpen ? 'justify-center' : ''}` 
            }
            title={!isSidebarOpen ? item.name : ''} 
          >
            <span className="text-xl">{item.icon}</span>
            {isSidebarOpen && ( 
              <span className="font-medium text-base whitespace-nowrap">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;