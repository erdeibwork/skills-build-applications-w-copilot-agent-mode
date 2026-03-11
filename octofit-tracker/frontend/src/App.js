import './App.css';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import octofitLogo from './assets/octofitapp-small.png';

function navLinkClassName({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`;
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            <img
              src={octofitLogo}
              alt="OctoFit"
              height="28"
              className="d-inline-block align-text-top me-2"
            />
            OctoFit Tracker
          </NavLink>
          <div className="navbar-nav">
            <NavLink to="/activities" className={navLinkClassName}>
              Activities
            </NavLink>
            <NavLink to="/teams" className={navLinkClassName}>
              Teams
            </NavLink>
            <NavLink to="/workouts" className={navLinkClassName}>
              Workouts
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClassName}>
              Leaderboard
            </NavLink>
            <NavLink to="/users" className={navLinkClassName}>
              Users
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
