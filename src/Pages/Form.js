import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, serverTimestamp, storage, ref, query, uploadString, getDownloadURL, where } from "../config";
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import Exif from 'exif-js'; 
import Loading from "./Loading";

function Form({ tgAiName }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [timings, setTimings] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [generatedID, setGeneratedID] = useState(null);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const defaultSpecializationKey = 1;
  const [image, setImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(() => {
  const storedSelectedArea = localStorage.getItem('selectedArea') || '';
  return storedSelectedArea;
  });
  const [leftValue, setLeftValue] = useState('50%');
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateNameError, setDuplicateNameError] = useState(null);
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: leftValue,
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      '@media (max-width: 600px)': {
        left: '20%', // Set a smaller width for screens with a maximum width of 600px
      },
    },
  };

  const navigate = useNavigate();

  const handleResize = () => {
    setLeftValue(window.innerWidth <= 768 ? '10%' : '50%');
  };

  useEffect(() => {
    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchAreaOptions = async () => {
      try {
        // Check if area options are already in localStorage
        const storedAreaOptions = JSON.parse(localStorage.getItem('areaOptions'));
  
        if (storedAreaOptions) {
          setAreaOptions(storedAreaOptions);
          return;
        }
        // If not in localStorage, fetch from Firestore
        const areaSnapshot = await getDocs(collection(db, "TgAiAreas"));
        const areaData = areaSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  
        const selectedAreasCount = JSON.parse(localStorage.getItem('selectedAreasCount')) || {};
  
        // Sort areas based on doc.id in ascending order
        const sortedAreas = areaData.sort((a, b) => Number(a.id) - Number(b.id));
  
        // Sort the sortedAreas based on selection count
        const finalSortedAreas = sortedAreas.sort((a, b) => (selectedAreasCount[b.name] || 0) - (selectedAreasCount[a.name] || 0)).map(area => area.name);
  
        // Store in localStorage for future use
        localStorage.setItem('areaOptions', JSON.stringify(finalSortedAreas));
  
        setAreaOptions(finalSortedAreas);
      } catch (error) {
        console.error("Error fetching area options: ", error);
      }
    };
  
    fetchAreaOptions();
  }, []);
  
  

  useEffect(() => {
    const fetchFieldOptions = async () => {
      try {
        // Check if field options are already in localStorage
        const storedFieldOptions = JSON.parse(localStorage.getItem('fieldOptions'));
  
        if (storedFieldOptions) {
          setFieldOptions(storedFieldOptions);
          return;
        }
  
        // If not in localStorage, fetch from Firestore
        const fieldSnapshot = await getDocs(collection(db, "TgAiFields"));
        const fields = fieldSnapshot.docs.map(doc => doc.data().name);
  
        const selectedFieldsCount = JSON.parse(localStorage.getItem('selectedFieldsCount')) || {};
  
        const sortedFields = fields.sort((a, b) => (selectedFieldsCount[b] || 0) - (selectedFieldsCount[a] || 0));
  
        // Store in localStorage for future use
        localStorage.setItem('fieldOptions', JSON.stringify(sortedFields));
  
        setFieldOptions(sortedFields);
      } catch (error) {
        console.error("Error fetching field options: ", error);
      }
    };
  
    fetchFieldOptions();
  }, []);
  

  useEffect(() => {
    // Fetch current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching current location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  }, []); // Empty dependency array to run once on component mount

  const generateUniqueID = () => {
    const uuid = uuidv4().replace(/[^0-9]/g, '').substr(0, 4);
    return uuid;
  };

  const getDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractGeoLocation = (file) => {
    return new Promise((resolve, reject) => {
      Exif.getData(file, function () {
        const lat = Exif.getTag(this, 'GPSLatitude');
        const lon = Exif.getTag(this, 'GPSLongitude');
  
        if (lat !== null && lon !== null) {
          const latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
          const longitude = lon[0] + lon[1] / 60 + lon[2] / 3600;
  
          resolve({ latitude, longitude });
        } else {
          // Resolve with null if GPS coordinates are not available
          resolve(null);
        }
      });
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const trimmedLowercasedName = name.toLowerCase().trim();
  
      // Check if a document with the given name already exists
      const TgAiFormDataName = query(collection(db, "TgAiFormData"), where("name", "==", trimmedLowercasedName));
      const existingDocsSnapshot = await getDocs(TgAiFormDataName);
  
      if (!existingDocsSnapshot.empty) {
        // If the name already exists, show an error or handle accordingly
        setDuplicateNameError("Name already exists. Duplicate submission not allowed.");
        setIsErrorMessageVisible(true);
  
        // Hide the error message after 5 seconds (adjust the duration as needed)
        setTimeout(() => {
          setIsErrorMessageVisible(false);
        }, 5000);
        return;
      }
  
      const generatedID = generateUniqueID();
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      let formData = {
        id: generatedID,
        name,
        phone,
        address,
        details,
        specialization: specialization ? { [defaultSpecializationKey]: specialization } : {},
        selectedField,
        timings,
        selectedCreatedBy: tgAiName,
        createdAt: formattedDate,
        selectedArea,
      };
      console.log("Before if (image)");

      if (image) {
        console.log("Inside if (image)");
        const imageRef = ref(storage, `images/${generatedID}`);
        const dataUrl = await getDataUrl(image);
        await uploadString(imageRef, dataUrl, 'data_url');
        const imageUrl = await getDownloadURL(imageRef);
        formData = { ...formData, imageURL: imageUrl };
      }

      // If current location is available, include it in formData
      console.log("Before if (currentLocation)");
      if (currentLocation) {
        console.log("Inside if (currentLocation)");
        formData = { ...formData, geoLocation: currentLocation };
      } 
      else  {
        // If current location is not available, try to extract from image
        const geoLocation = await extractGeoLocation(image);
        formData = { ...formData, geoLocation };
      }
      console.log("Before addDoc");

      const docRef = await addDoc(collection(db, "TgAiFormData"), formData);
      console.log("After addDOC");

      setGeneratedID(generatedID);
      setModalOpen(true);

      setName("");
      setPhone("");
      setAddress("");
      setDetails("");
      setSpecialization('');
      setTimings('');
      setSelectedField('');
      setImage(null);
      setSelectedArea('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    finally {
      setIsLoading(false); // Set loading state back to false
      console.log("End of handleSubmit");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate('/');
  };

  const handleAreaSelection = (selectedValue) => {
    setSelectedArea(selectedValue);
    localStorage.setItem('selectedArea', selectedValue);
    const selectedAreasCount = JSON.parse(localStorage.getItem('selectedAreasCount')) || {};
    selectedAreasCount[selectedValue] = (selectedAreasCount[selectedValue] || 0) + 1;
    localStorage.setItem('selectedAreasCount', JSON.stringify(selectedAreasCount));
  };

  const handleFieldSelection = (selectedValue) => {
    setSelectedField(selectedValue);
    const selectedFieldsCount = JSON.parse(localStorage.getItem('selectedFieldsCount')) || {};
    selectedFieldsCount[selectedValue] = (selectedFieldsCount[selectedValue] || 0) + 1;
    localStorage.setItem('selectedFieldsCount', JSON.stringify(selectedFieldsCount));
  };

  return (
    <div className="registration-container" style={{ backgroundColor: "#3A434E", color: "white" }}>
      {isLoading ? (
          <Loading />
      ):(
      <form onSubmit={handleSubmit} className="registration-form">
        <h1>Details Form</h1>
        <div className="form-group">
          <label htmlFor="area">Area:</label>
          <select
            id="area"
            value={selectedArea}
            className="form-control"
            onChange={(e) => handleAreaSelection(e.target.value)}
          >
            {areaOptions.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="field">Field:</label>
          <select
            id="field"
            value={selectedField}
            className="form-control"
            onChange={(e) => handleFieldSelection(e.target.value)}
          >
            {fieldOptions.map((field, index) => (
              <option key={index} value={field}>
                {field}
              </option>
            ))}
          </select>
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
          <label htmlFor="image">Capture Image:</label>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
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
          <label htmlFor="specialization">Speciality</label>
          <textarea
            id="specialization"
            value={specialization}
            className="form-control"
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>

        <button type="submit">Send now</button>      
        {isErrorMessageVisible && duplicateNameError && (
            <div style={{ color: "red", marginBottom: "20px", marginTop: "-15px" }}>
              {duplicateNameError}
            </div>
         )}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          style={customStyles}
          contentLabel="Success Modal"
        >
          <div>Your submission was successful!</div>
          <div>Generated ID: {generatedID}</div>
          <div>Available Timings: {timings}</div>
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      </form>
      )}
    </div>
  );
}

export default Form;
