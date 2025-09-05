import './App.css';
import Pathly from './Pathly';
import React from 'react';
import { TravelTimesProvider } from "./TravelTimesContext";

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
