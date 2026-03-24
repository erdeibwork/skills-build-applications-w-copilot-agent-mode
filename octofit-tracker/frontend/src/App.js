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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={octofitLogo}
              alt="OctoFit"
              height="28"
              className="d-inline-block align-text-top me-2"
            />
            <span className="fw-bold">OctoFit Tracker</span>
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#octofitNavbar" aria-controls="octofitNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="octofitNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/activities" className={navLinkClassName}>
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/teams" className={navLinkClassName}>
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/workouts" className={navLinkClassName}>
                  Workouts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/leaderboard" className={navLinkClassName}>
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/users" className={navLinkClassName}>
                  Users
                </NavLink>
              </li>
            </ul>
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
