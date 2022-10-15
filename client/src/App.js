import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DataProvider } from './GlobalState';
import Header from './components/headers/Header';
import MainPages from './components/mainpages/Pages';
import Footer from './components/footer/Footer';

// The DataProvider will help us to make the data we get from the global state variables to become displayed onto the website.
function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <MainPages />
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

/* The App function here has been exported to display the above components. This is done when the App.js file is imported and used in Index.js. */
export default App;
