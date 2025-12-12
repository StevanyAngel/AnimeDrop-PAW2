import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./component/Navbar.tsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home.tsx";
import MyList from "./pages/anime/MyList.tsx";
import AddAnime from "./pages/anime/AddAnime.tsx";
import EditAnime from "./pages/anime/EditAnime.tsx";
import Discovery from "./pages/anime/Discovery.tsx";
import AnimeDetail from "./pages/anime/AnimeDetail.tsx";
import Users from "./pages/users/Users";
import UserProfile from "./pages/users/UserProfile.tsx";
import Notifications from "./pages/notifications/Notifications.tsx";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/home" />} />

        {/* Protected Routes */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/my-list" element={user ? <MyList /> : <Navigate to="/login" />} />
        <Route path="/add-anime" element={user ? <AddAnime /> : <Navigate to="/login" />} />
        <Route path="/edit-anime/:id" element={user ? <EditAnime /> : <Navigate to="/login" />} />
        <Route path="/discovery" element={user ? <Discovery /> : <Navigate to="/login" />} />
        <Route path="/anime/:id" element={user ? <AnimeDetail user={user} /> : <Navigate to="/login" />} />
        <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
        <Route path="/users/:userId" element={user ? <UserProfile currentUser={user} /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
