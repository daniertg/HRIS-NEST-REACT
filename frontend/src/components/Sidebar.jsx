import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdowns, setDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  const adminMenus = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/dashboard'
    },
    {
      title: 'Employee Management',
      icon: 'bi-people',
      isDropdown: true,
      key: 'employees',
      items: [
        { title: 'All Employees', path: '/admin/employees' },
        { title: 'Add Employee', path: '/admin/employees/add' },
        { title: 'Departments', path: '/admin/departments' }
      ]
    },
    {
      title: 'Attendance',
      icon: 'bi-clock',
      path: '/admin/attendance'
    },
    {
      title: 'Summary',
      icon: 'bi-bar-chart-line',
      isDropdown: true,
      key: 'summary',
      items: [
        { title: 'Monthly Summary', path: '/admin/summary/monthly' },
        { title: 'Employee Summary', path: '/admin/summary/employee' },
        { title: 'Attendance Summary', path: '/admin/summary/attendance' },
        { title: 'Department Summary', path: '/admin/summary/department' }
      ]
    },
    {
      title: 'Reports',
      icon: 'bi-bar-chart',
      isDropdown: true,
      key: 'reports',
      items: [
        { title: 'Monthly Reports', path: '/admin/reports/monthly' },
        { title: 'Employee Reports', path: '/admin/reports/employee' },
        { title: 'Export Data', path: '/admin/reports/export' }
      ]
    },
    {
      title: 'Settings',
      icon: 'bi-gear',
      isDropdown: true,
      key: 'settings',
      items: [
        { title: 'Company Settings', path: '/admin/settings/company' },
        { title: 'User Management', path: '/admin/settings/users' },
        { title: 'System Settings', path: '/admin/settings/system' }
      ]
    }
  ];

  const userMenus = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/dashboard'
    },
    {
      title: 'Attendance',
      icon: 'bi-clock',
      path: '/attendance'
    },
    {
      title: 'Summary',
      icon: 'bi-bar-chart-line',
      path: '/attendance/summary'
    },
    {
      title: 'Profile',
      icon: 'bi-person',
      path: '/profile'
    }
  ];

  const menus = user?.role === 'admin' ? adminMenus : userMenus;

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''} ${isOpen && window.innerWidth <= 768 ? 'show' : ''}`}>
      {/* Close Button - Only show on mobile */}
      <button 
        className="sidebar-close"
        onClick={toggleSidebar}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      {/* Logo */}
      <div className="sidebar-header">
        <div className="d-flex align-items-center">
          <i className="bi bi-building text-white me-2 fs-4"></i>
          <span className="fw-bold text-white">HRIS Portal</span>
        </div>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="d-flex align-items-center">
          <div className="user-avatar">
            <i className="bi bi-person-circle text-white fs-3"></i>
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Employee'}</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          {menus.map((menu, index) => (
            <li key={index} className="nav-item">
              {menu.isDropdown ? (
                <div>
                  <button
                    className={`nav-link dropdown-toggle ${
                      isDropdownActive(menu.items.map(item => item.path)) ? 'active' : ''
                    }`}
                    onClick={() => toggleDropdown(menu.key)}
                  >
                    <i className={`${menu.icon} me-2`}></i>
                    {menu.title}
                    <i className={`bi bi-chevron-${dropdowns[menu.key] ? 'up' : 'down'} ms-auto`}></i>
                  </button>
                  <div className={`dropdown-menu ${dropdowns[menu.key] ? 'show' : ''}`}>
                    {menu.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={menu.path}
                  className={`nav-link ${isActive(menu.path) ? 'active' : ''}`}
                  onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                >
                  <i className={`${menu.icon} me-2`}></i>
                  {menu.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="btn btn-outline-light w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;