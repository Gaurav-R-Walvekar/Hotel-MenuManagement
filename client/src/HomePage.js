import React, { useEffect } from 'react';
import { Hotel } from 'lucide-react';

function HomePage() {
  useEffect(() => {
    // Redirect to portfolio website
    window.location.href = 'https://portfolio-git-main-gaurav-r-walvekars-projects.vercel.app/';
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>
            <Hotel className="header-icon" />
            Hotel Menu Management
          </h1>
          <p>Redirecting to portfolio...</p>
        </div>
      </header>

      <main className="container">
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>Redirecting...</h2>
            <p>You are being redirected to the portfolio website.</p>
            <div className="welcome-actions">
              <a 
                href="https://portfolio-git-main-gaurav-r-walvekars-projects.vercel.app/"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here if not redirected automatically
              </a>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
}

export default HomePage; 