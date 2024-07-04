import React, { useState } from "react";

const LocationModal = ({ isOpen, onRequestClose }) => {
  const handleAllowLocation = () => {

    onRequestClose();
  };

  return (
    <div className={`location-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>We require your location</h2>
        <p>To fully utilize the platform, please allow access to your location.</p>
        <button onClick={handleAllowLocation}>Allow</button>
      </div>
    </div>
  );
};

export default LocationModal;
