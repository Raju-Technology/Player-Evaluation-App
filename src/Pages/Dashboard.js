import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "./Services";
import Settings from "./Settings";
import { Layout, Space, AutoComplete, Input, Tooltip , Modal, } from 'antd';
import { EditOutlined, RightOutlined, DeleteOutlined } from '@ant-design/icons';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import UpdateForm from "./Updateform";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { db, collection, getDocs, query, where, updateDoc, doc, addDoc, getDoc, Firestore,FieldValue,deleteField,orderBy,limit,onSnapshot } from '../config';

const { Header, Sider, Content } = Layout;
const layoutStyle = {
  height: '100vh',
};

const headerStyle = {
  color: '#fff',
  height: 100,
  paddingInline: 50,
  backgroundColor: '#526681',
  paddingLeft: '5%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Use 'space-between' to push items to the ends
};

const paragraphStyle = {
  color: '#fff',
  margin: '0',
  lineHeight: '1',
  marginLeft: 'auto', // Push the paragraph to the right
  marginTop: '10px',
  marginRight: '0'
};

const contentStyle = {
  textAlign: 'left',
  minHeight: '100%',
  color: '#000',
  backgroundColor: '#fff',
  padding: '6px 20px',
};

const siderStyle = {
  textAlign: 'left',
  lineHeight: '20px',
  color: '#fff',
  backgroundColor: '#526681',
  paddingLeft: '25px',
  width: window.innerWidth <= 768 ? '100%' : '150px'
};

function Dashboard({tgAiName, access, setTgAiName, setLogin}) {
  console.log(access)
  const sideContent = ['Dashboard', 'Services', 'Settings'];
  const [formData, setFormData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedSideContent, setSelectedSideContent] = useState('Dashboard');
  const [editableSpecialization, setEditableSpecialization] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpecializationIndex, setSelectedSpecializationIndex] = useState(null);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [siderWidth, setSiderWidth] = useState(window.innerWidth > 768 ? 200 : 80);
  const [editableState, setEditableState] = useState([]);
  const [shouldCloseModal, setShouldCloseModal] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [editFormData, setEditFormData] = useState(null);
  const [dataCount, setDataCount] = useState(0);

  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: '#526681',
            width: '125px',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0', // Change color on hover if needed
            },
          },
        },
      },
    },
  });

  console.log("dataCount : " + dataCount )

  useEffect(() => {
    fetchDataCount(); // Fetch data count when component mounts
  }, []);

  const fetchDataCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'TgAiFormData')); // Query to get all documents in the collection
      setDataCount(querySnapshot.size); // Set data count to the number of documents
    } catch (error) {
      console.error('Error fetching data count:', error);
    }
  };

  const navigate = useNavigate()

  const handleEditClick = (index) => {
    // Set the data of the selected form item to be edited
    setEditFormData(formData[index]);
  };

  const handleUpdate = async (updatedFormData) => {
    try {
        const collectionRef = collection(db, 'TgAiFormData');

        const docRef = doc(collectionRef, updatedFormData.Id);

        await updateDoc(docRef, updatedFormData);

        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

  console.log(activeStep)

  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const StepLabelWrapper = ({ children, onClick, active }) => (
    <StepLabel
      StepIconComponent={() => null} // This removes the numbers
      icon={null} // This removes the icon circle
      onClick = {onClick}
      style={{
        cursor: 'pointer',
        backgroundColor: active ? '#526681' : 'inherit', // Change color if selected
        padding: '2px',
      }}
    >
      {children}
    </StepLabel>
  );
  

  const handleDeleteSpecialization = async (index, keyToDelete) => {
    const editedItem = formData[index];
  
    try {
      const docRef = doc(db, 'TgAiFormData', editedItem.Id);
  
      // Remove the specific specialization key from the database
      const updateData = {
        [`specialization.${keyToDelete}`]: deleteField(),
      };
  
      await updateDoc(docRef, updateData);
  
      // Remove the deleted key from the editableSpecialization state
      setEditableSpecialization((prevEditableSpecialization) => {
        const newEditableSpecialization = { ...prevEditableSpecialization };
        delete newEditableSpecialization[index]?.[keyToDelete];
        return newEditableSpecialization;
      });
  
      // Fetch the updated data from the database
      const updatedDoc = await getDoc(docRef);
      const updatedData = { ...updatedDoc.data(), Id: updatedDoc.id, editable: false };
  
      // Update the state with the fetched data
      setFormData((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedData;
        return newData;
      });
  
      console.log('Specialization Successfully Deleted!');
    } catch (error) {
      console.error('Error Deleting Specialization: ', error);
    }
  }; 
  
  useEffect(() => {
    setEditableState(formData.map(() => false));
  }, [formData]);

  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is below a certain threshold (e.g., 768px for mobile view)
      if (window.innerWidth <= 768) {
        // Set the current page to 1 when switching to mobile view
        setCurrentPage(1);
        setWindowWidth(window.innerWidth);
        setSiderWidth(window.innerWidth > 768 ? 200 : 120);
      }
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Call the function once to handle the initial window width
    handleResize();

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getLastSpecializationKey = () => {
    const existingSpecializationKeys = Object.keys(editableSpecialization[selectedSpecializationIndex] || {});
    const lastKey = existingSpecializationKeys.length > 0 ? existingSpecializationKeys[existingSpecializationKeys.length - 1] : 0;
    return parseInt(lastKey, 10);
  };

  const updateEditableSpecialization = (index, newKey, newSpecialization) => {
    const updatedEditableSpecialization = {
      ...editableSpecialization,
      [index]: {
        ...editableSpecialization[index],
        [newKey]: newSpecialization,
      },
    };
    setEditableSpecialization(updatedEditableSpecialization);
  };
  
  const addNewSpecializationToDatabase = async (index, newSpecialization) => {
    const editedItem = formData[index];
    const newKey = getLastSpecializationKey() + 1;
  
    try {
      const docRef = doc(db, 'TgAiFormData', editedItem.Id);
      await updateDoc(docRef, {
        specialization: {
          ...editedItem.specialization,
          [newKey]: newSpecialization,
        },
        // Add other fields you want to update
      });
  
      // Fetch the updated data from the database
      const updatedDoc = await getDoc(docRef);
      const updatedData = { ...updatedDoc.data(), Id: updatedDoc.id, editable: false };
  
      // Update the state with the fetched data
      setFormData((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedData;
        return newData;
      });
  
      console.log("Document Successfully Updated!");
    } catch (error) {
      console.error("Error Updating Document: ", error);
    }
  };
  
  
  const handleAddNewSpecialization = async() => {
    if (!newSpecialization) {
      return;
    }
  
    const lastKey = getLastSpecializationKey();
    const newKey = lastKey + 1;
  
    // Update the state within the modal
    updateEditableSpecialization(selectedSpecializationIndex, newKey, newSpecialization);
  
    // Call the function to add the new specialization to the database
    await addNewSpecializationToDatabase(selectedSpecializationIndex, newSpecialization);
    updateEditableSpecialization(selectedSpecializationIndex, getLastSpecializationKey() + 1, newSpecialization);
    setNewSpecialization('');
  };
  

  const handleModalCancel = (e) => {
  
    setModalVisible(false);
    setSelectedSpecializationIndex(null);
  };

  useEffect(() => {
    fetchOptions(); // Fetch initial options
  }, []);

  const fetchOptions = async () => {
    try {
      // Define a query that orders documents by a field and limits the result set
      const q = query(
        collection(db, 'TgAiFormData'),
        limit(10)// Adjust the limit as needed
      );

      const dataCollection = await getDocs(q);

      if (dataCollection && !dataCollection.empty) {
        const optionsData = dataCollection.docs.map(doc => ({
          value: doc.data().name,
        }));
        setDataSource(optionsData);
      } else {
        setDataSource([]);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleSearch = (value) => {
    console.log('handleSearch:', value);
    if (value === '') {
      fetchOptions(); // Fetch initial options when the search value is empty
    } else {
      const filteredOptions = dataSource.filter(option =>
        option.value.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredOptions);
    }
  };

  const handleSelect = (value) => {
    setSelectedPlace(value || ''); // Set selected place
  };

  const handleSearchChange = async (value) => {
    console.log('handleSearchChange:', value);
  
    setSelectedPlace(value); // Set selected place for fetching data
  
    try {
      if (value) {
        // Adjust the orderBy clause based on your use case
        const q = query(
          collection(db, 'TgAiFormData'),
          where("name", ">=", value),
          where("name", "<", value + "\uf8ff")
        );
  
        const dataCollection = await getDocs(q);
  
        if (dataCollection && !dataCollection.empty) {
          const optionsData = dataCollection.docs.map(doc => ({
            value: doc.data().name,
          }));
          setDataSource(optionsData);
        } else {
          setDataSource([]);
        }
      } else {
        // Fetch initial options when the search value is empty
        fetchOptions();
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    const localStorageKey = 'formData';

    const fetchData = async () => {
        try {
            // Check if data is present in local storage and access is true
            if (access === 'true' && localStorage.getItem(localStorageKey)) {
                const cachedData = JSON.parse(localStorage.getItem(localStorageKey));
                setFormData(cachedData);
            } else {
                let q;
                if (selectedPlace === '' && access === 'true') {
                    q = collection(db, 'TgAiFormData');
                } else if (selectedPlace === '') {
                    q = query(collection(db, 'TgAiFormData'), where('selectedCreatedBy', '==', tgAiName));
                } else {
                    q = query(collection(db, 'TgAiFormData'), where('name', '==', selectedPlace));
                }

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ ...doc.data(), Id: doc.id, editable: false }));
                    setFormData(data);
                    localStorage.setItem(localStorageKey, JSON.stringify(data));
                });

                return () => unsubscribe();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [selectedPlace, access, tgAiName]);

  const handleEditAddress = (index,e) => {
    const updatedData = formData.map((data, i) => ({
      ...data,
      editable: i === index ? !data.editable : false,
    }));
    setFormData(updatedData);

    if (window.innerWidth <= 768 ){
      e.stopPropagation()
    }
  };

  const handleInputChangeAddress = (index, e) => {
    const updatedData = formData.map((data, i) => ({
      ...data,
      address: i === index ? e.target.value : data.address,
    }));
    setFormData(updatedData);
    if (window.innerWidth <= 768) {
      e.stopPropagation();
    }
  };

  const handleSaveAddress = async (index) => {
    const editedItem = formData[index];

    try {
      const docRef = doc(db, 'TgAiFormData', editedItem.Id);
      await updateDoc(docRef, {
        address: editedItem.address,
        // Add other fields you want to update
      });

      const updatedData = formData.map((data, i) => ({
        ...data,
        editable: i === index ? !data.editable : false,
      }));
      setFormData(updatedData);

      console.log("Document Successfully Updated!");
    } catch (error) {
      console.error("Error Updating Document: ", error);
    }
  };

  const handleEditMobile = (index) => {
    const updatedData = formData.map((data, i) => ({
      ...data,
      editable: i === index ? !data.editable : false,
    }));
    setFormData(updatedData);
  };

  const handleInputChangeMobile = (index, e) => {
    console.log('handleInputChangeMobile called');
    const updatedData = formData.map((data, i) => ({
      ...data,
      phone: i === index ? e.target.value : data.phone,
    }));
    setFormData(updatedData);
    if (window.innerWidth <= 768 && !e.target.matches(':focus')) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      console.log('Stopped propagation');
    }
  };

  const handleSaveMobile = async (index) => {
  const editedItem = formData[index];

    try {
      const docRef = doc(db, 'TgAiFormData', editedItem.Id);
      await updateDoc(docRef, {
        phone: editedItem.phone,
        // Add other fields you want to update
      });

      const updatedData = formData.map((data, i) => ({
        ...data,
        editable: i === index ? !data.editable : false,
      }));
      setFormData(updatedData);

      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleEditSpecialization = (index) => {
    const updatedEditableState = editableState.map((value, i) => (i === index ? !value : false));
    setEditableState(updatedEditableState);

    const updatedData = formData.map((data, i) => ({
      ...data,
      editable: i === index ? !data.editable : false,
    }));
    setFormData(updatedData);

    setEditableSpecialization({
      ...editableSpecialization,
      [index]: formData[index].specialization || {},
    });

    setSelectedSpecializationIndex(index);
    setModalVisible(true);
   };

  const handleInputChangeSpecialization = (index, e) => {
    const updatedEditableSpecialization = {
      ...editableSpecialization,
      [index]: {
        ...editableSpecialization[index],
        [e.target.name]: e.target.value,
      },
    };
    setEditableSpecialization(updatedEditableSpecialization);
    if (window.innerWidth <= 768) {
      e.stopPropagation();
    }
  };

  const handleSaveSpecialization = async (index) => {
  const editedItem = formData[index];
  
  try {
    const docRef = doc(db, 'TgAiFormData', editedItem.Id);
    
    // Get the current date in the specified format (YYYY-MM-DD)
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Update the specialization and createdAt fields in Firestore
    await updateDoc(docRef, {
      specialization: editableSpecialization[index],
      modifiedAt: formattedDate, // Update createdAt to current date
      // Add other fields you want to update
    });
    
    // Fetch the updated data from Firestore
    const updatedDoc = await getDoc(docRef);
    const updatedData = { ...updatedDoc.data(), Id: updatedDoc.id, editable: false };
  
    // Update the state with the fetched data
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedData;
      return newData;
    });
    
    // Reset the editableSpecialization for the specific index
    setEditableSpecialization((prevEditableSpecialization) => {
      const newEditableSpecialization = { ...prevEditableSpecialization };
      delete newEditableSpecialization[index];
      return newEditableSpecialization;
    });
  
    const updatedEditableState = editableState.map(() => false);
    setEditableState(updatedEditableState);
  
    setModalVisible(false);
    setSelectedSpecializationIndex(null);
  
    console.log("Document Successfully Updated!");
  } catch (error) {
    console.error("Error Updating Document: ", error);
  }
};


  useEffect(() => {
    const modalElement = document.getElementById("your-unique-modal-id"); // replace with your modal ID
    if (modalElement) {
      // Prevent touch events from propagating within the modal
      modalElement.addEventListener("touchstart", (e) => {
        e.stopPropagation();
      });
    } 
    // Clean up the event listener when the component unmounts
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("touchstart", (e) => {
          e.stopPropagation();
        });
      }
    };
  }, []);

  const handleStepClick = (index) => {
    switch (index) {
      case 0:
        setSelectedSideContent('Dashboard');
        break;
      case 1:
        setSelectedSideContent('Services');
        break;
      case 2:
        setSelectedSideContent('Settings');
        break;
      // Add more cases if needed
      default:
        break;
    }
    setActiveStep(index);
    console.log(`Step ${index + 1} clicked`);
  };

  const handleLogout = () => {
    setLogin(false)
    setTgAiName("")
    navigate('/login');
  };

  return (
    <div>
      {editFormData ? (
        <UpdateForm formData={editFormData} onUpdate={handleUpdate} setEditFormData={setEditFormData} />
      ): (
      <Space  direction="vertical" style={{ width: '100%' }} >
        <Layout>
          <Header style={headerStyle}>
            <AutoComplete
              style={{ width: window.innerWidth <= 768 ? 150 : 600 }}
              options={dataSource}
              onSelect={handleSelect}
              onSearch={handleSearch}
              onChange={handleSearchChange}
            >
              <Input.Search placeholder="Search Places" />
            </AutoComplete>
            <div>
               <p style={paragraphStyle}>Logged in as : {tgAiName}</p>
               <ThemeProvider theme={theme}>
                   <Button variant="contained"  onClick={handleLogout}>Logout</Button>
               </ThemeProvider>
               
            </div>
          </Header>
          {window.innerWidth <= 768 && (
            <Box sx={{ width: '100%', backgroundColor: '#ffffff', paddingTop: '40px',textAlign: 'center' }}>
              <Stepper activeStep={activeStep}>
                {sideContent.map((label,index) => (
                  <Step key={label}>
                    <StepLabelWrapper 
                      onClick={() => handleStepClick(index)}
                      active={index === activeStep}
                    >
                      {label}
                    </StepLabelWrapper>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
          {window.innerWidth <= 768 && (
            <div style={{ backgroundColor: '#fff', paddingTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{ backgroundColor: currentPage === 1 ? '#fff' : '#526681', color: currentPage === 1 ? '#526681' : '#fff', marginLeft: '10px', padding:'10px 15px' }}
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === 2}
                style={{ backgroundColor: currentPage === 2 ? '#fff' : '#526681', color: currentPage === 2 ? '#526681' : '#fff', marginRight: '10px', padding:'10px 15px' }}
              >
                Next
              </button>
               </div>
             )}

          <Layout style={layoutStyle}>
            {window.innerWidth >= 768 && (
              <Sider width={siderWidth} style={siderStyle}>
              {sideContent.map(item => (
                <h4
                  key={item}
                  onClick={() => setSelectedSideContent(item)}
                  style={{ cursor: 'pointer', color: item === selectedSideContent ? '#000' : '#fff', }}
                >
                  {item}
                </h4>
              ))}
            </Sider>
            )}
            {selectedSideContent === 'Dashboard' && (
              <Content style={contentStyle}>
                {window.innerWidth > 768 && (
                  <h3>Storage</h3>
                )}
                <div className="dashboard-content">
                {(currentPage === 1 || window.innerWidth > 768) && ( 
                  <>
                    <div className="organization-container">
                    <h5>Organization</h5>
                    {formData.map((data, index) => (
                      <div key={index} className="data-container">
                        <p>{data.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="details-container">
                    <h5>Description</h5>
                    {formData.map((data, index) => (
                      <div key={index} className="data-container">
                       <ThemeProvider theme={theme}>
                        <Button variant="contained" onClick={() => handleEditClick(index)}>Edit</Button>
                      </ThemeProvider>
                      </div>
                    ))}
                  </div>
                  <div className="speciality-container">
                      <h5>Specialization</h5>
                      {formData.map((data, index) => (
                        <div key={index} className="data-container editable-container">
                          <div className="data-inner-container">
                            <ThemeProvider theme={theme}>
                              <Button
                                variant="contained"
                                onClick={() => handleEditSpecialization(index)}
                              >
                                Click Here
                              </Button>
                            </ThemeProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Modal
                      id="your-unique-modal-id" 
                      title="Edit Specialization"
                      open={modalVisible}
                      onCancel={handleModalCancel}
                      footer={[
                        <Button key="save" type="primary" onClick={() => handleSaveSpecialization(selectedSpecializationIndex)} style={{backgroundColor: '#526681', color: '#fff'}}>
                          Save
                        </Button>,
                      ]}
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={() => setShouldCloseModal(false)}
                      onTouchEnd={() => setShouldCloseModal(true)}
                      onMouseDown={() => setShouldCloseModal(false)}
                      onMouseUp={() => setShouldCloseModal(true)}
                      onTouchMove={(e) => {
                        if (shouldCloseModal) {
                          e.preventDefault();
                        }
                      }}
                      onMouseMove={(e) => {
                        if (shouldCloseModal) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {selectedSpecializationIndex !== null && (
                        <>
                          {Object.keys(formData[selectedSpecializationIndex].specialization || {}).map((key) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                              <Input
                                name={key}
                                style={{ flex: 1, marginBottom: '5px' }}
                                value={editableSpecialization[selectedSpecializationIndex]?.[key] || ''}
                                onChange={(e) => handleInputChangeSpecialization(selectedSpecializationIndex, e)}
                                onClick={(e) => e.stopPropagation()}  // Prevent click events from propagating to the modal
                                onTouchStart={() => setShouldCloseModal(false)}  // Disable modal closing on touch start
                                onTouchEnd={() => setShouldCloseModal(true)}  // Enable modal closing on touch end
                                onMouseDown={() => setShouldCloseModal(false)}  // Disable modal closing on mouse down
                                onMouseUp={() => setShouldCloseModal(true)}  // Enable modal closing on mouse up
                                onTouchMove={(e) => {
                                  if (shouldCloseModal) {
                                    e.preventDefault();
                                  }
                                }}  // Prevent touch move when modal should stay open
                                onMouseMove={(e) => {
                                  if (shouldCloseModal) {
                                    e.preventDefault();
                                  }
                                }}  // Prevent mouse move when modal should stay open
                              />
                              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDeleteSpecialization(selectedSpecializationIndex, key)} style={{ marginLeft: '5px', backgroundColor: '#526681', color:'#fff' }} >
                                Delete
                              </Button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexDirection: 'column' }}>
                            <Input
                              placeholder="New Specialization"
                              style={{ flex: 1, marginBottom: '5px' }}  // Add margin-bottom to the Input
                              value={newSpecialization}
                              onChange={(e) => setNewSpecialization(e.target.value)}
                            />
                            <Button type="primary" onClick={handleAddNewSpecialization} style={{ marginTop: '5px', backgroundColor: '#526681', marginRight:'auto', color:'#fff' }}>  {/* Add margin-top to the Button */}
                              Add New Specialization
                            </Button>
                          </div>
                        </>
                      )}
                    </Modal>
                  </>
                )} 

                {(currentPage === 2 || window.innerWidth > 768) && ( 
                  <>
                  <div className="unique-container">
                    <h5>Unique Id</h5>
                    {formData.map((data, index) => (
                      <div key={index} className="data-container">
                        <p>{data.id}</p>
                      </div>
                    ))}
                  </div>
                  <div className="address-container">
                      <h5>Address</h5>
                      {formData.map((data, index) => (
                        <div key={index} className="data-container editable-container">
                          <div className="data-inner-container">
                            {data.editable ? (
                              <>
                                <Input
                                  style={{ flex: 1 }}
                                  value={data.address}
                                  onChange={(e) => handleInputChangeAddress(index, e)}
                                  onClick={(e) => e.stopPropagation()}
                                  onTouchStart={() => setShouldCloseModal(false)}
                                  onTouchEnd={() => setShouldCloseModal(true)}
                                  onMouseDown={() => setShouldCloseModal(false)}
                                  onMouseUp={() => setShouldCloseModal(true)}
                                  onTouchMove={(e) => {
                                    if (shouldCloseModal) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onMouseMove={(e) => {
                                    if (shouldCloseModal) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                                <Tooltip title="Save">
                                  <EditOutlined
                                    style={{ cursor: 'pointer', marginLeft: '3' }}
                                    onClick={() => handleSaveAddress(index)}
                                  />
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <p>{data.address}</p>
                                <Tooltip title="Edit">
                                  <EditOutlined
                                    style={{ cursor: 'pointer', marginLeft: '3' }}
                                    onClick={(e) => handleEditAddress(index,e)}
                                  />
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  <div className="mobile-container">
                    <h5>Mobile</h5>
                    {formData.map((data, index) => (
                      <div key={index} className="data-container editable-container">
                        {data.editable ? (
                          <>
                            <Input
                              style={{ flex: 1 }}
                              value={data.phone}
                              onChange={(e) => handleInputChangeMobile(index, e)}
                            />
                            <Tooltip title="Save">
                              <EditOutlined
                                style={{ marginLeft: 8, cursor: 'pointer' }}
                                onClick={() => handleSaveMobile(index)}
                              />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <p>{data.phone}</p>
                            <Tooltip title="Edit">
                              <EditOutlined
                                style={{ marginLeft: 8, cursor: 'pointer' }}
                                onClick={() => handleEditMobile(index)}
                              />
                            </Tooltip>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="verification-container">
                      <h5>Verified</h5>
                      {formData.map((data, index) => (
                          <div key={index} className="data-container">
                              <p>{data.verified?.toString() || "false"}</p>
                          </div>
                      ))}
                  </div>
                  </>
                )}
                </div>
              </Content>
            )}
            {selectedSideContent === 'Services'  && (
              <Content style={contentStyle}>
                  <Service tgAiName={tgAiName}/>
              </Content>
            )}{
              selectedSideContent === 'Settings' && (
                <Content style={contentStyle}>
                  <Settings />
                </Content>
              )
            }
          </Layout>
        </Layout>
      </Space>
      )}
    </div>
  );
}

export default Dashboard;
