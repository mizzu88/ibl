import React from 'react';
import './TableData.css'; // Import your CSS file

const TableData = ({ data }) => {
  const getColor = (text) => {
    if (!text) return 'inherit'; // Return default color if text is null
    const regex = /(BKN|FEW|SCT)(\d{3})/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const number = parseInt(match[2], 10);
      return number <= 30 ? 'blue' : 'red';
    }
    return 'inherit'; // Default color if no match is found
  };

  const renderTableContent = () => {
    if (data.length === 0) {
      return (
        <div className="table-container">
        <p>NO DATA</p>
      </div>
      );
    }

    return data.map((item, index) => (
      <tr key={index} className={item.grey ? 'greyRow' : ''}>
        <td>{item.queryType}</td>
        <td>{item.reportTime}</td>
        <td>
          {item.text &&
            item.text.split(' ').map((word, idx) => (
              <span key={idx} style={{ color: getColor(word) }}>
                {word}{' '}
              </span>
            ))}
        </td>
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <table className="customTable">
        <tbody>{renderTableContent()}</tbody>
      </table>
    </div>
  );
};

export default TableData;
