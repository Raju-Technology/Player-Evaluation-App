import React, { useState, useEffect } from "react";

function UpdateForm({ formData, onUpdate , setEditFormData}) {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [timings, setTimings] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [geoLocation, setGeoLocation] = useState(null);

  // Populate form fields with the data of the selected form item
  useEffect(() => {
    if (formData) {
        console.log(formData.Id)
      setSelectedArea(formData.selectedArea);
      setSelectedField(formData.selectedField);
      setName(formData.name);
      setPhone(formData.phone);
      setTimings(formData.timings);
      setAddress(formData.address);
      setDetails(formData.details);
      setSpecialization(JSON.stringify(formData.specialization || {}));
      setGeoLocation(formData.geoLocation || null);
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get geolocation if enabled
    let locationData = null;
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Extract latitude and longitude
        const { latitude, longitude } = position.coords;

        locationData = { latitude, longitude };
      } catch (error) {
        console.error("Error getting geolocation:", error);
      }
    }

    // Construct the updated form data
    const updatedFormData = {
      Id: formData.Id,
      id: formData.id,
      area: selectedArea,
      field: selectedField,
      name,
      phone,
      timings,
      address,
      details,
      specialization: JSON.parse(specialization),
      geoLocation: locationData, // Include geolocation data
    };

    // Pass the updated data back to the parent component
    onUpdate(updatedFormData);
    setEditFormData(false)
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="registration-form">
        {/* Form fields */}
        <div className="form-group">
          <label htmlFor="area">Area:</label>
          <input
            type="text"
            id="area"
            value={selectedArea}
            className="form-control"
            onChange={(e) => setSelectedArea(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="field">Field:</label>
          <input
            type="text"
            id="field"
            value={selectedField}
            className="form-control"
            onChange={(e) => setSelectedField(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name of the Business/Event</label>
          <input
            type="text"
            id="name"
            value={name}
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Contact Name and Number:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            className="form-control"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="timings">Available Timings:</label>
          <input
            type="text"
            id="timings"
            value={timings}
            className="form-control"
            onChange={(e) => setTimings(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={address}
            className="form-control"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="details">Service Description:</label>
          <textarea
            id="details"
            value={details}
            className="form-control"
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialization">Specialization:</label>
          <input
            type="text"
            id="specialization"
            value={specialization}
            className="form-control"
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="geoLocation">Geolocation:</label>
          <input
            type="text"
            id="geoLocation"
            value={geoLocation ? JSON.stringify(geoLocation) : ""}
            className="form-control"
            readOnly
          />
        </div>
        <button type="submit">Update form</button>
      </form>
    </div>
  );
}

export default UpdateForm;
