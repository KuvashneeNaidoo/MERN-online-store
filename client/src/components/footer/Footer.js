import React from 'react';
import './footer.css';

// Used the getFullYear() method to get the current year according to local time
function Footer() {
  return (
    <div className="footer">
      <div>© {new Date().getFullYear()} Phantom</div>
    </div>
  );
}

/* We export the 'Footer' component in order to display this code in App.js. */
export default Footer;
