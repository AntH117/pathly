import './ReturnLocation.css';
import React from 'react';
import Icons from '../icons/Icons';
import { motion, setDragLock } from "motion/react"
import { useTravelTimes } from '../context/TravelTimesContext';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Tooltip } from 'react-tooltip'

export default function ReturnLocation({locationInformation, returnTrip, setReturnTrip, returnToggle, startLocation}) {        
        const { travelTimes, setTravelTimes } = useTravelTimes();
        const { locationId } = returnTrip
        const returnTravel = travelTimes?.find(t => t.locationId === locationId)
        const navigate = useNavigate()

        const returnIdRef = React.useRef(
            Date.now().toString() + Math.random().toString(36).substr(2, 9)
          );

        const transportIcons = {
            'Car': <Icons.Car width={'80%'} height={'80%'} color={'gray'}/>,
            'Transit': <Icons.Train width={'80%'} height={'80%'} color={'gray'}/>,
            'Walking': <Icons.Walking width={'80%'} height={'80%'} color={'gray'}/>,
            'Biking': <Icons.Bike width={'80%'} height={'80%'} color={'gray'}/>
        }
        
        //Set selected transport type
        const [selectedTransport, setSelectedTransport] = React.useState(
            returnTrip?.transportType ? {icon: transportIcons[returnTrip.transportType], name: returnTrip.transportType} : { icon: transportIcons['Car'], name: 'Car' }
          );

        React.useEffect(() => {
            if (!returnToggle || !startLocation) return;

            const returnDetails = {
              ...startLocation,
              transportType: selectedTransport?.name || 'Car',
              return: true,
              locationId: returnTrip.locationId,
              id: returnIdRef.current
            };

            setReturnTrip((prev) => {
              if (
                prev?.placeId === returnDetails.placeId &&
                prev?.transportType === returnDetails.transportType
              ) {
                return prev; // no change 
              }
               return {...returnDetails}
            });

          }, [returnToggle, selectedTransport]);

        // Set expanded info
        const [expandInfo, setExpandInfo] = React.useState(false)
        function Rings() {
            const [markerHeight, setMarkerHeight] = React.useState(0);
            const containerRef = React.useRef(null);
          
            React.useEffect(() => {
              if (containerRef.current) {
                setMarkerHeight(containerRef.current.clientHeight);
              }
            }, []);

            return (
            <div className='location-markers' ref={containerRef}>
                <div className='ring-container' style={{top: 0}}>
                    <div className='ring return'></div>
                </div>
                <div className='ring-container' style={{bottom: 0}}>
                    <div className='ring return'></div>
                </div>
                <div className='ring-line-container return' style={{width: (markerHeight - 3 * 16)}}>

                </div>
            </div>
            )
        }
        
        function ExpandedLocationInfo() {

            function IndividualLocationInfo({title, info}) {
                return (
                    <div className='more-location-info'>
                        {title}: <span style={{color: '#3e8abd'}}>{info}</span>
                    </div>
                )
            }
        
            return <div className='more-location-body' style={expandInfo ? {height: 'fit-content'} : {height: '1.5rem'}}>
                <motion.div className='more-location-icon'
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.90 }}
                    onClick={() => setExpandInfo(!expandInfo)}
                >
                    {expandInfo ? <Icons.Minus width={'100%'} height={'100%'} color={'#3e8abd'}/> : <Icons.Plus width={'100%'} height={'100%'} color={'#3e8abd'}/>}
                </motion.div>
                <div className='more-location-info-body'>
                    <IndividualLocationInfo title={'Time taken'} info={returnTravel?.duration.text}/>
                    <IndividualLocationInfo title={'Distance'} info={returnTravel?.distance.text}/>
                </div>
            </div>
        }

        function TransportSelect() {
            const [toggleDropdown, setToggleDropDown] = React.useState(false)

            function TransportDropDown() {
                return (
                    toggleDropdown && <div className='transport-dropdown-body'>
                        {Object.entries(transportIcons).map(([name, icon]) => (
                            <TransportOption
                                key={name}
                                icon={icon}
                                name={name}
                            />
                        ))}
                    </div>
                )
            }
            
            function handleTransportChange({icon, name}) {

                return (
                    setSelectedTransport({icon, name})
                )
            }

            function TransportOption({icon, name}) {
                
                return selectedTransport.name !== name && <motion.div className='transport-option-body' onClick={() => handleTransportChange({icon: icon, name: name})}
                whileHover={{backgroundColor: 'rgb(226, 224, 255)'}}
            >
                <div className='transport-icon'>
                    {icon}
                </div>
                <p className='transport-name'>{name}</p>
            </motion.div>
            }

            return (
            <div className='transport-select-body' onClick={() => setToggleDropDown(!toggleDropdown)}>
                <div className='transport-icon'>
                    {selectedTransport.icon}
                </div>
                <p className='transport-name'>{selectedTransport.name}</p>
                <div className='transport-dropdown-icon'>
                    <Icons.ArrowDown width={'0.8rem'} height={'0.8rem'} color={'gray'}/>
                </div>
                <TransportDropDown />
            </div>
            )
        }

        function LocationInfo() {
            return <motion.div className='location-info-body'
                whileHover={{
                    opacity: 1,
                }}
                data-tooltip-id="my-tooltip" 
                onClick={() => navigate(`/location/${locationId}`)}
            >
                <Icons.Info width={'80%'} height={'80%'} color={'rgb(122, 122, 122)'}/>
                <Tooltip id="my-tooltip" place="top" />
            </motion.div>
        }

        function TransitTimes() {
            if (!travelTimes) return
            const { departureTime, arrivalTime } = travelTimes?.find(t => t.locationId === returnTrip.locationId) || {};
            if (!departureTime || !arrivalTime) return

            const readableDep = departureTime.toLocaleString([], {
                // weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

            const readableArr = arrivalTime.toLocaleString([], {
                // weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

            return <>
                <p style={{paddingTop: '0.4rem'}}>{readableDep}</p>
                <p style={{paddingBottom: '0.4rem'}}>{readableArr}</p>
            </>

        }
  
        return <div className='return-location-outer'>
            <div className='return-location-body'>
            <div className='transit-times-body'>
                <TransitTimes />  
            </div>
            <Rings />
            <div className='individual-location-search'>
                <div className='individual-location-transport'>
                    <TransportSelect />
                </div>
                {locationInformation && <ExpandedLocationInfo />}
                <div className='return-location'>
                    {locationInformation?.formatted_address}
                </div>
            </div>
            <LocationInfo />
        </div>
        </div>
}