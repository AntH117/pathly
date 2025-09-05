import { Map, useMap, Marker, useMapsLibrary  } from '@vis.gl/react-google-maps';
import './Maps.css';
import React from 'react';
import Icons from './Icons/Icons';
import { useTravelTimes } from "./TravelTimesContext";

function PathingDirections({origin, destination, num, travelMode, travelTimes, setTravelTimes}) {
    const map = useMap()
    const routesLib = useMapsLibrary("routes");
    const [pathingRender, setPathingRender] = React.useState(null);

    const travelTypes = {
        'Car': 'DRIVING',
        'Transit': 'TRANSIT',
        'Walking': 'WALKING',
        'Biking': 'BICYCLING'
    }

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
        if (!routesLib || !map || !origin || !destination) return;
    
        // Set up DirectionsService + DirectionsRenderer
        const directionsService = new routesLib.DirectionsService();
        //Pathing options
        const renderer = new routesLib.DirectionsRenderer({ 
            map, 
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: pathingColours[num % pathingColours.length],
                strokeOpacity: 0.8, 
                strokeWeight: 6,    
            }
        });
    
        directionsService.route(
          {
            origin,
            destination,
            travelMode: routesLib.TravelMode[travelTypes[travelMode]], // DRIVING | WALKING | BICYCLING | TRANSIT
          },
          (result, status) => {
            if (status === "OK") {
              renderer.setDirections(result);
              setPathingRender(renderer);

              //Get travel time
                const route = result.routes[0];
                const leg = route.legs[0]; 
                const totalTimeText = leg.duration.text;

            const newTravel = {
                origin,
                destination,
                totalTimeText
            }
              setTravelTimes(prev => {
                const exists = prev.find(
                  (t) =>
                    t.origin.placeId === origin.placeId &&
                    t.destination.placeId === destination.placeId
                );
                if (exists) {
                  return prev.map((t) =>
                    t.origin.placeId === origin.placeId &&
                    t.destination.placeId === destination.placeId
                      ? newTravel
                      : t
                  );
                }
                return [...prev, newTravel];
              });
            } else {
              console.error("Directions request failed:", status);
            }
          }
        );
        return () => {
          // clean up old route if origin/destination changes
          renderer.setMap(null);
        };
      }, [routesLib, map, origin, destination]);
}


export default function Maps({startLocation, markers, locations}) {
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

    //set mapeable locations
    React.useEffect(() => {
        const ViableLocations = locations.filter((l) => l?.location)
        setMapableLocations([startLocation, ...ViableLocations.map(l => l.location)])
    }, [startLocation, locations])

    // setting center/zoom locks the movement/zoom
    return (
        <div className='pathly-map-body'>
            <span style={{width: '90%', height: '90%', borderRadius: '20px', overflow: 'hidden'}}>
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
                    {React.useMemo(() => mapableLocations.map((location, i) => {
                        if (i === mapableLocations.length - 1) return null;
                        return (
                            <PathingDirections
                                key={i}
                                num={i}
                                origin={{placeId: location.place_id}}
                                destination={{placeId: mapableLocations[i + 1].place_id}}
                                travelMode={mapableLocations[i + 1].transportType}
                                travelTimes={travelTimes}
                                setTravelTimes={setTravelTimes}
                            />
                        )
                    }), [mapableLocations])}
                </Map>
            </span>
        </div>
    )
}