import React from 'react';
import './home.css';

//The Homepage includes the background image and introduction headline to the website.
function Home() {
  return (
    <div className="container">
      <div className="background">
        <div className="intro">
          <h1>Welcome to Phantom</h1>
          <div>Find the latest fashion trends for every season</div>
        </div>
      </div>
    </div>
  );
}

/* We export the 'Home' component in order to display this code in App.js. */
export default Home;
