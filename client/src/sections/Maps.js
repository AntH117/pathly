import { Map, useMap, Marker, useMapsLibrary  } from '@vis.gl/react-google-maps';
import '../styles/Maps.css';
import React from 'react';
import Icons from '../icons/Icons';
import { useTravelTimes } from '../context/TravelTimesContext';
import dayjs from 'dayjs';

function PathingDirections({setTravelTimes, mapableLocations, tripLeaveTime, depArrTime}) {
    const map = useMap()
    const routesLib = useMapsLibrary("routes");
    const [pathingRender, setPathingRender] = React.useState(null);
    const travelTypes = {
        'Car': 'DRIVING',
        'Transit': 'TRANSIT',
        'Walking': 'WALKING',
        'Biking': 'BICYCLING' 
    }
    const renderersRef = React.useRef([]);

    //Pathing option libary
    const pathingColours = [
        "#1F77B4", // vivid blue
        "#FF7F0E", // bright orange
        "#2CA02C", // green
        "#D62728", // red
        "#9467BD", // purple
        "#8C564B", // brown
        "#E377C2", // pink
        "#7F7F7F", // grey
        "#BCBD22", // lime/yellow-green
        "#17BECF", // cyan
    ];

    //Pathing between locations
    React.useEffect(() => {
        if (!routesLib || !map) return;
    
        // Set up DirectionsService + DirectionsRenderer
        const directionsService = new routesLib.DirectionsService();
        //Pathing options

        if (!mapableLocations.length) return;
        const newTravelTimes = [];
        
        const caclulateForward = async () => {
          let lastArrival = tripLeaveTime || new Date(); 
      
          for (let i = 0; i < mapableLocations.length - 1; i++) {
            const origin = mapableLocations[i];
            const destination = mapableLocations[i + 1];
      
            const travelMode = routesLib.TravelMode[travelTypes[destination.transportType]];

            const renderer = new routesLib.DirectionsRenderer({ 
              map, 
              suppressMarkers: true,
              polylineOptions: {
                  strokeColor: pathingColours[i % pathingColours.length],
                  strokeOpacity: 0.8, 
                  strokeWeight: 6,    
              }
          });
          
          renderersRef.current.push(renderer);
          
            const result = await new Promise((resolve, reject) => {
              directionsService.route(
                {
                  origin: {placeId: origin.place_id},
                  destination: {placeId: destination.place_id},
                  travelMode, // DRIVING | WALKING | BICYCLING | TRANSIT
                  transitOptions: {
                    departureTime:
                      destination.departureTime &&
                      dayjs(destination.departureTime).isAfter(dayjs(lastArrival))
                        ? destination.departureTime
                        : lastArrival
                  }
                },
                (res, status) => {
                  if (status === "OK") {
                    renderer.setDirections(res);
                    resolve(res)
                  } else {
                    reject(status)
                  }
                }
              );
            });
            
            const route = result.routes[0];
            const leg = route.legs[0]; 
            const duration = leg.duration;
            const distance = leg.distance;
            const instructions = leg?.steps;
            const departureTime = dayjs(destination.departureTime).isAfter(dayjs(lastArrival)) ? destination.departureTime : lastArrival
            const tripDuration = leg.duration.value;
            const arrivalTime = travelMode === 'TRANSIT' ? leg?.arrival_time?.value : new Date(departureTime.getTime() + tripDuration * 1000);
      
            newTravelTimes.push({
              locationId: destination.locationId,
              origin,
              destination,
              duration,
              distance,
              instructions,
              departureTime,
              arrivalTime,
            });
      
            lastArrival = arrivalTime;
          }
      
          setTravelTimes(newTravelTimes);
        };

        const calculateBackwards = async () => {
          let lastDeparture = tripLeaveTime || new Date(); 
          for (let i = mapableLocations.length - 1; i > 0; i--) {
            const origin = mapableLocations[i];
            const destination = mapableLocations[i - 1];
      
            const travelMode = routesLib.TravelMode[travelTypes[origin.transportType]];

            const renderer = new routesLib.DirectionsRenderer({ 
              map, 
              suppressMarkers: true,
              polylineOptions: {
                  strokeColor: pathingColours[i % pathingColours.length],
                  strokeOpacity: 0.8, 
                  strokeWeight: 6,    
              }
          });
          
          renderersRef.current.push(renderer);
          
            const result = await new Promise((resolve, reject) => {
              directionsService.route(
                {
                  origin: {placeId: origin.place_id},
                  destination: {placeId: destination.place_id},
                  travelMode, // DRIVING | WALKING | BICYCLING | TRANSIT
                  transitOptions: {
                    arrivalTime: destination.arrivalTime|| lastDeparture,
                  }
                },
                (res, status) => {
                  if (status === "OK") {
                    renderer.setDirections(res);
                    resolve(res)
                  } else {
                    reject(status)
                  }
                }
              );
            });
            
            const route = result.routes[0];
            const leg = route.legs[0]; 
            const duration = leg.duration;
            const distance = leg.distance;
            const instructions = leg?.steps;
            const tripDuration = leg.duration.value;
            const arrivalTime = destination.arrivalTime|| lastDeparture
            const departureTime = travelMode === 'TRANSIT' ? leg?.departure_time?.value : new Date(arrivalTime.getTime() - tripDuration * 1000);
      
            newTravelTimes.push({
              locationId: origin.locationId,
              origin,
              destination,
              duration,
              distance,
              instructions,
              departureTime,
              arrivalTime,
            });
      
            lastDeparture = departureTime;
          }
      
          setTravelTimes(newTravelTimes);
        };


        if (depArrTime !== 'Arrive By') {
          caclulateForward()
        } else if (depArrTime === 'Arrive By') {
          calculateBackwards()
        }

        return () => {
          // clean up old route if origin/destination changes
          renderersRef.current.forEach(r => r.setMap(null));
        };

      }, [
        routesLib, 
        map, 
        mapableLocations, 
        tripLeaveTime
      ]);
}


export default function Maps({startLocation, markers, locations, returnTrip, returnToggle, tripLeaveTime, depArrTime}) {
    const map = useMap()
    const [mapableLocations, setMapableLocations] = React.useState([])
    const { travelTimes, setTravelTimes } = useTravelTimes();

    function startLocationZoom() {
        const lat = startLocation.geometry.location.lat();
        const lng = startLocation.geometry.location.lng();
        map.setCenter({ lat, lng });
        map.setZoom(15);
    }
    // Starting location zoom
    React.useEffect(() => {
        if (startLocation) {
            startLocationZoom()
        }
    }, [startLocation])
    
    // Reset travel times
    React.useEffect(() => {
      setTravelTimes([])
    }, [mapableLocations])
    //set mapeable locations
    React.useEffect(() => {
        const ViableLocations = locations.filter((l) => l?.location)
        if (returnTrip && returnToggle) {
          setMapableLocations(
          [startLocation,   
            ...ViableLocations.map(l => ({
              ...l.location, 
              locationId: l.id      
          })), 
          returnTrip])
        } else {
          setMapableLocations([startLocation, 
            ...ViableLocations.map(l => ({
            ...l.location, 
            locationId: l.id      
        }))])
        }
    }, [startLocation, 
      JSON.stringify(locations.filter(l => l.location)), // Only updates if locations.location changes
       returnTrip, 
       returnToggle])
    // setting center/zoom locks the movement/zoom
    
    return (
        <div className='pathly-map-body'>
            <span style={{width: '100%', height: '90%', borderRadius: '20px', overflow: 'hidden'}}>
                <Map
                    defaultZoom={12}
                    defaultCenter={{ lat: -33.8688, lng: 151.2093 }}
                    colorScheme='LIGHT' //Implement dark mode
                    streetViewControl={false} //Remove street view
                    mapTypeControl={false} //Remove satelite toggle
                    fullscreenControl={false} //Remove full screen toggle
                >
                    {markers.map((m, i) => (
                        <Marker 
                            key={m.id} 
                            position={m.position} 
                            label={String.fromCharCode(64 + (i + 1))}

                        /> //Show markers on the map
                    ))}
                      <PathingDirections
                        setTravelTimes={setTravelTimes}
                        mapableLocations={mapableLocations}
                        tripLeaveTime={tripLeaveTime}
                        depArrTime={depArrTime}
                    />
                </Map>
            </span>
        </div>
    )
}