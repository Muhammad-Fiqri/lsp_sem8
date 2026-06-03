import {useEffect,useRef} from 'react';

export default function Dashboard() {

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

    const response = fetch("http://localhost:3000/api/auth/verifyJwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }).then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('You are authenticated! Welcome to the dashboard.');
      } else {
        alert('Authentication failed. Please log in again.');
        window.location.href = '/'; // Redirect to login page
      }
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard! This is where you can manage your application.</p>
    </div>
  );
}