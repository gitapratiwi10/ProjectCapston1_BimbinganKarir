import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

// Create Context
const PatientContext = createContext();

// Provider Component
export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(null); // Store patient data

  return (
    <PatientContext.Provider value={{ patientData, setPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

// Validate props using PropTypes
PatientProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure 'children' is provided and is valid React node
};

// Hook to use context
export const usePatient = () => useContext(PatientContext);
