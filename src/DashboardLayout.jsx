import {useEffect,useRef,useState} from 'react';
import { Outlet } from 'react-router';

import './stylesheet/DashboardLayout.css';

export default function DashboardLayout() {
  const [decodedToken, setDecodedToken] = useState({ username: '', role: '' });

  function parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
  }

  const  hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Check if the user is authenticated by verifying the JWT token
    const token = sessionStorage.getItem('jwt');
    if (!token) {
      alert('You are not authenticated. Please log in to access the dashboard.');
      window.location.href = '/'; // Redirect to login page
    }

    const decodedToken = parseJwt(token);
    setDecodedToken(decodedToken);

    if (decodedToken.role == 'manager') {
      document.querySelector(".nav-dashboard").style.display = "none";
      document.querySelector(".nav-persediaan-barang").style.display = "none";
      document.querySelector(".nav-master-data").style.display = "none";

      const allowedEndpoint = [
        'http://localhost:5173/dashboard',
        'http://localhost:5173/persediaan-barang',
        'http://localhost:5173/master-data'
      ]

      if (allowedEndpoint.includes(window.location.href)) {
        alert("Akses di larang untuk akun ini");
        window.location.href = '/laporan';
      }
    }

    const response = fetch("http://localhost:3000/api/auth/verifyJwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }).then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("User JWT is authenticated")
      } else {
        alert('Authentication failed. Please log in again.');
        window.location.href = '/'; // Redirect to login page
      }
    });
  }, []);

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.side-bar');
    sidebar.style.width = sidebar.style.width === '250px' ? '40px' : '250px';
    const sidebarButtons = document.querySelectorAll('.close-sidebar-button > img');
    sidebarButtons[0].style.transform = sidebar.style.width === '250px' ? 'rotate(90deg)' : 'rotate(-90deg)';
  }

  const Logout = () => {
    sessionStorage.removeItem('jwt'); // Clear the JWT token from session storage
    alert('You have been logged out. Redirecting to login page.');
    window.location.href = '/'; // Redirect to login page
  }

  return (
    <div className="dashboard-layout">
      <div className="top-nav">
        <img src="/Logo.svg" alt="Logo" className="logo" />
        <h1>Construction Material Manager</h1>
      </div>
      <div className="side-bar">
        <div className="close-sidebar-button">
          <img onClick={toggleSidebar} src="/Chevron.svg" alt="Close Sidebar" />
        </div>
        <div className="profile-section">
          <img src="/default pfp.svg" alt="Profile" />
          <p className="profile-name">{decodedToken.username}</p>
          <p className="profile-role">{decodedToken.role}</p>
        </div>
        <nav className="navigations">
          <div onClick={() => {console.log(window.location.href = "/dashboard")}} className="nav-dashboard">
            <img src="/Dashboard.svg" alt="Dashboard Icon" className="nav-icon" />
            Dashboard
            <img src="/Chevron.svg" alt="Chevron Icon" className="nav-chevron" />
          </div>
          <div onClick={() => {console.log(window.location.href = "/persediaan-barang")}} className="nav-persediaan-barang">
            <img src="/Persediaan Barang.svg" alt="Persediaan Barang Icon" className="nav-icon" />
            Persediaan Barang
            <img src="/Chevron.svg" alt="Chevron Icon" className="nav-chevron" />
          </div>
          <div onClick={() => {console.log(window.location.href = "/master-data")}} className="nav-master-data" href="/master-data">
            <img src="/Master Data.svg" alt="Master Data Icon" className="nav-icon" />
            Master Data
            <img src="/Chevron.svg" alt="Chevron Icon" className="nav-chevron" />
          </div>
          <div onClick={() => {console.log(window.location.href = "/laporan")}} className="nav-laporan" href="/laporan">
            <img src="/Laporan.svg" alt="Laporan Icon" className="nav-icon" />
            Laporan
            <img src="/Chevron.svg" alt="Chevron Icon" className="nav-chevron" />
          </div>
          <div onClick={Logout} className="nav-logout">
            <img src="/Logout.svg" alt="Logout Icon" className="nav-icon" />
            Logout
          </div>
        </nav>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}