import './DepArrTime.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';
import { useTravelTimes } from "./TravelTimesContext";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    DatePicker,
    DatePickerProps,
    DatePickerFieldProps,
  } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

export default  function DepArrTime() {
    const [depArrTime, setDepArrTime] = React.useState('Immediately')
    const [toggleDropdown, setToggleDropdown] = React.useState(false)
    const options = ['Immediately', 'Depart By', 'Arrive By']

    function DepArrDropDown({time}) {
        
        return <div className='dep-arr-dropdown' onClick={() => setToggleDropdown(!toggleDropdown)}>
            <div className='dep-arr-icon'>
                <Icons.Clock />
            </div>
            <div className='dep-arr-text'>
                {time}
            </div>
            <div className='dep-arr-dropdown-icon'>
                <Icons.ArrowDown width={'0.8rem'} color={'gray'}/>
            </div>
        </div>
    }
    
    function handleDropDownClick(x) {
        setDepArrTime(x)
        setToggleDropdown(false)
    }

    function DropDownOption({option}) {

        return (
            <motion.div className='dep-arr-dropdown-option' 
                onClick={() => handleDropDownClick(option)}
                whileHover={{backgroundColor: 'rgb(226, 224, 255)'}}
            >
                {option}
            </motion.div>
        )
    }

    function TimeDisplay() {
        const now = dayjs();
        const [dateTimePicker, setDateTimePicker] = React.useState({
            date: now.format("YYYY-MM-DD"),
            time: now.format("HH:mm")
        })
        console.log(dateTimePicker)

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='time-display-body'>
                    <div className='time-display-time' >
                        <input
                        className='time-display-time-input'
                            type="time"
                            value={dateTimePicker.time}
                            required />
                    </div>
                    <div className='time-display-date' >
                        <input
                            className='time-display-date-input'
                            type="date"
                            value={dateTimePicker.date}
                            min={now.format("YYYY-MM-DD")}/>
                    </div>
                    
                </div>
            </LocalizationProvider>
        )
    }

    return <div className='dep-arr-body'>
        <DepArrDropDown time={depArrTime} />
        {depArrTime !== 'Immediately' && <TimeDisplay />}
        {toggleDropdown && <div className='dep-arr-dropdown-body'>
            {options.filter(i => i !== depArrTime).map((x) => {
                return <DropDownOption option={x}/>
            })}
        </div>}
    </div>
}