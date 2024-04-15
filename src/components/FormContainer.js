import React, { useState } from 'react';
import Form from './Form';
import DataTable from './DataTable';
import './FormContainer.css';

const FormContainer = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupData = (data) => {
    const groupedData = data.reduce((acc, obj) => {
      const { stationId, queryType, reportTime, text } = obj;
      if (!acc[stationId]) {
        acc[stationId] = [{
          queryType: stationId,
          reportTime: null,
          text: null,
          grey: true
        }];
      }
      acc[stationId].push({
        queryType,
        reportTime,
        text,
        grey: false
      });
      return acc;
    }, {});
    return Object.values(groupedData).flatMap(group => group);
  };

  const constructObjectFromFormData = async (formData) => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const reportTypes = [];
      const stations = [];
      const countries = [];
      
      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          if (formData[key][0]) {
            reportTypes.push(formData[key][1]);
          }
        } else if (key === 'countries' && formData[key] !== '') {
          countries.push(...formData[key].split(' ').filter(Boolean));
        } else if (key === 'stations' && formData[key] !== '') {
          stations.push(...formData[key].split(' ').filter(Boolean));
        }
      }
      
      const constructedObject = {
        id: 'test',
        method: 'query',
        params: [
          {
            reportTypes,
            stations,
            countries,
          },
        ],
      };
      console.debug('Constructed body object:', constructedObject);

      const response = await fetch('https://ogcie.iblsoft.com/ria/opmetquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(constructedObject),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    const responseObject = await constructObjectFromFormData(formData);
    if (responseObject && !responseObject.error) {
      const groupedData = groupData(responseObject.result);
      console.debug('Grouped Data:', groupedData);
      setTableData(groupedData);
    } else if (responseObject && responseObject.error) {
      console.error('Response Error:', responseObject.error.message);
      setTableData([]); // Clear table data in case of error
    }
  };

  return (
    <>
      <div>
        <Form onSubmit={handleSubmit} />
      </div>
      <div className="table-container">
        {loading ? (
          <div className="loading-animation">Loading...</div>
        ) : (
          <DataTable data={tableData} />
        )}
      </div>
    </>
  );
};

export default FormContainer;
