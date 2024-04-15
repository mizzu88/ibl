import React, { useState, useEffect } from 'react';
import './Form.css';

const Form = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        metar: [false, 'METAR'], 
        sigmet: [false, 'SIGMET'], 
        taf: [false, 'TAF'], 
        countries: '',
        stations: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [stationError, setStationError] = useState(false);
    const [countryError, setCountryError] = useState(false);
    const [messageTypeError, setMessageTypeError] = useState(false); 

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                [name]: [checked, prevData[name][1]]
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            onSubmit(formData);
        } else {
            console.error('Form not valid. Submission prevented.');
            alert('Please make sure to check at least one checkbox and fill in all input fields.');
        }
    };

    useEffect(() => {
        console.debug('Form data changed. Recalculating form validity...');
        const isAnyCheckboxChecked = Object.values(formData).some(value => Array.isArray(value) && value[0] === true);
        const isAnyInputFilled = Object.values(formData).some(value => typeof value === 'string' && value.trim() !== '');
        setIsFormValid(isAnyCheckboxChecked && isAnyInputFilled && !stationError && !countryError);
        setMessageTypeError(!isAnyCheckboxChecked); // Set message type error if no checkbox is checked
    }, [formData, stationError, countryError]);

    const handleStationsChange = (event) => {
        const { value } = event.target;
        const stationsArray = value.trim().split(' ');
        const isValid = stationsArray.every(station => station === '' || /^[A-Z]{4}$/.test(station));
        setStationError(!isValid);
        handleChange(event);
    };

    const handleCountriesChange = (event) => {
        const { value } = event.target;
        const countriesArray = value.trim().split(' ');
        const isValid = countriesArray.every(country => country === '' || /^[a-zA-Z]{2}$/.test(country)); // Check each country individually
        setCountryError(!isValid);
        handleChange(event);
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="row">
                <div className="col-25">
                    <label>Message Types:</label>
                </div>
                <div className="col-75">
                    <label className="check">
                        <input
                            type="checkbox"
                            name="metar"
                            checked={formData.metar[0]}
                            onChange={handleChange}
                        />
                        METAR
                    </label>
                    <label className="check">
                        <input
                            type="checkbox"
                            name="sigmet"
                            checked={formData.sigmet[0]}
                            onChange={handleChange}
                        />
                        SIGMET
                    </label>
                    <label className="check">
                        <input
                            type="checkbox"
                            name="taf"
                            checked={formData.taf[0]}
                            onChange={handleChange}
                        />
                        TAF
                    </label>
                </div>
                {messageTypeError && (
                
                <span className="error-message">Please select at least one message type.</span>
            
        )}
            </div>
            
            <div className="row">
                <div className="col-25">
                    <label htmlFor="airports">Airports:</label>
                </div>
                <div className="col-75">
                    <input
                        type="text"
                        id="airports"
                        name="stations"
                        value={formData.stations}
                        onChange={handleStationsChange}
                    />
                    {stationError && <span className="error-message">Stations must contain list of ICAO/WMO station codes</span>}
                </div>
            </div>
            <div className="row">
                <div className="col-25">
                    <label htmlFor="countries">Countries</label>
                </div>
                <div className="col-75">
                    <input
                        type="text"
                        id="countries"
                        name="countries"
                        value={formData.countries}
                        onChange={handleCountriesChange}
                    />
                    {countryError && <span className="error-message">Countries must be two-letter codes</span>}
                </div>
            </div>
            <br />
            <div className="row">
                <button type="submit" disabled={!isFormValid}>Create Briefing</button>
            </div>
        </form>
    );
};

export default Form;
