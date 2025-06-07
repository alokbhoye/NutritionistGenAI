import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/Dashboard/home.png';
import mealPlansIcon from '../assets/Dashboard/mealPlans.png';
import trophyIcon from '../assets/Dashboard/trophy.png';
import connectIcon from '../assets/Dashboard/connect.png';
import settingsIcon from '../assets/Dashboard/settings.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', icon: homeIcon, path: '/dashboard' },
    { label: 'View Meal Plans', icon: mealPlansIcon, path: '/view-meal-plan' },
    { label: 'Achievements', icon: trophyIcon, path: '#' },
    { label: 'Connect with Friends', icon: connectIcon, path: '#' },
  ];

  return (
    <div className="w-[220px] bg-[#faeeda] h-screen flex flex-col justify-between py-6 px-4 shadow-md">
      <div>
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 text-green-800 hover:text-green-900 cursor-pointer px-2"
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <span className="text-md font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        onClick={() => navigate('/settings')}
        className="flex items-center space-x-3 text-green-800 hover:text-green-900 cursor-pointer px-2"
      >
        <img src={settingsIcon} alt="Settings" className="w-5 h-5" />
        <span className="text-md font-medium">Settings</span>
      </div>
    </div>
  );
};

export default Sidebar;
