import React from "react";

const TravelTimesContext = React.createContext();

export function TravelTimesProvider({ children }) {
const [travelTimes, setTravelTimes] = React.useState([])


  return (
    <TravelTimesContext.Provider value={{ travelTimes, setTravelTimes }}>
      {children}
    </TravelTimesContext.Provider>
  );
}

export function useTravelTimes() {
  return React.useContext(TravelTimesContext);
}