import './App.css';
import Pathly from './sections/Pathly';
import React from 'react';
import { TravelTimesProvider } from './context/TravelTimesContext';


function App() {
  
  return (
    <div className="app-home">
      <TravelTimesProvider>
          <Pathly />
      </TravelTimesProvider>
    </div>
  );
}

export default App;
