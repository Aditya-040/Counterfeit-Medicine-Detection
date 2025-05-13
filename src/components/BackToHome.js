import React from 'react';
import { Link } from 'react-router-dom';
import './BackToHome.css';

const BackToHome = () => {
  return (
    <div className="back-to-home">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
    </div>
  );
};

export default BackToHome; 