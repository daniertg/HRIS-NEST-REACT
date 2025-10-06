import { useState } from 'react';
import Sidebar from './Sidebar';
import '../assets/css/sidebar.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen && window.innerWidth <= 768 ? 'show' : ''}`} onClick={toggleSidebar}></div>
      
      {/* Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={toggleSidebar}
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>
      
      <div className={`main-content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <div className="container-fluid p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;