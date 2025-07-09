import React from 'react';
import './App.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} AiSoft Hotel Menu Management. All rights reserved.</p>
        <p>
      <a href="https://portfolio.aisoft.it.com/" target="_blank" rel="noopener noreferrer">
        aisoft.it.com
      </a>
    </p>
      </div>
    </footer>
  );
}

export default Footer; 