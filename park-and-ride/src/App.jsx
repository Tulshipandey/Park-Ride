/**
 * Main application component that handles routing
 * Sets up the application's navigation structure using React Router
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Page/Home';
import Login from './Page/Login'
import Booking from './Page/Booking';

const App = () => {
  return (
    <div>
      {/* Navigation bar visible on all pages */}
      <Navbar />
      
      {/* Route configuration for the application */}
      <Routes>
        {/* Home/landing page route */}
        <Route path="/" element={<Home />} />
        
        {/* User authentication route */}
        <Route path="/login" element={<Login />} />
        
        {/* Parking booking functionality route */}
        <Route path="/book" element={<Booking />} />
      </Routes>
    </div>
    
  );
};

export default App;
