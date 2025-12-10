import './App.css';
import Pathly from './sections/Pathly';
import React from 'react';
import { TravelTimesProvider } from './context/TravelTimesContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from "react-toastify";

function App() {
  
  return (
       <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="app-home">
            <TravelTimesProvider>
                <Pathly />
                <ToastContainer />
            </TravelTimesProvider>
          </div>
       </LocalizationProvider>
  );
}

export default App;
