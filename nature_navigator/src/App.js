//src/App.js
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Import React Router components
import Home from "./components/home"; // Import Home component
import ModelInfo from "./components/modelinfo";

import "./App.css"; // Import CSS file
import 'bootstrap/dist/css/bootstrap.min.css';


// Define container style for the map
const containerStyle = {
  width: "100%",
  height: "400px",
};

// Center the map initially
const center = {
  lat: 28.6139, // Default latitude
  lng: 77.209,  // Default longitude
};

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDOYZvj20isw_zi_d1iuCazAKVoBgssNJY", // Replace with your Google Maps API key
  });

  const [selectedSpecies, setSelectedSpecies] = useState("Hornbill");
  const [futureLocation, setFutureLocation] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [speciesData, setSpeciesData] = useState({}); // State for species information

  // Custom icons for different species
  const speciesIcons = {
    Hornbill: "/hornbill.png",
    Albatros: "/albatross.png",
    Flying_Fox: "/bat.png",
    African_Lion: "/animal.png",
  };

  // Fetch species data from JSON file
  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const response = await fetch("/speciesData.json");
        const data = await response.json();
        setSpeciesData(data);
      } catch (error) {
        console.error("Error fetching species data:", error);
      }
    };
    fetchSpeciesData();
  }, []);

  // Handle form submission for prediction
  const handlePrediction = async () => {
    setLoading(true);
    setError(""); // Reset error state

    const dateInput = document.getElementById("dateInput").value;
    const species = document.getElementById("speciesSelect").value;

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        species: species,
        date: dateInput,
      });

      // Update future location with the predicted latitude and longitude
      const { latitude, longitude } = response.data; // Ensure your response includes these fields
      setFutureLocation({ lat: latitude, lng: longitude });
      setSelectedSpecies(species); // Save the selected species for icon
    } catch (error) {
      setError("Error fetching prediction. Please try again.");
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return isLoaded ? (
    <Router>
     
     <div className="container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-left">
            <h1 className="project-name">Nature_Navigator</h1><img src="/logo1.png" alt="Logo" className="logo" />
            
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/prediction">Prediction App</Link>
            </li>
            <li>
              <Link to="/model-info">Model Info</Link>
            </li>
           
          </ul>
        </nav>
      
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prediction" element={
            <div>
              <div className="header">
                
                <p><span className="heading">
                    Predict Future Location
                   </span>
                </p>
                
              </div>

              {/* Form for selecting species and date */}
              <div className="form-container">
                <label>Select Species:</label>
                <select
                  id="speciesSelect"
                  className="dropdown"
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                >
                  <option value="Hornbill">Hornbill</option>
                  <option value="Albatros">Albatros</option>
                  <option value="Flying_Fox">Flying Fox</option>
                  <option value="African_Lion">African Lion</option>
                </select>

                <label>Select Date and Time:</label>
                <input type="datetime-local" id="dateInput" className="datetime-input" />

                <button
                  onClick={handlePrediction}
                  className="submit-button"
                >
                  {loading ? "Loading..." : "Check Prediction"}
                </button>

                {error && <div className="error-message">{error}</div>}
              </div>

              {/* Output Latitude and Longitude */}
              {futureLocation.lat !== null && futureLocation.lng !== null && (
                <div className="coordinates-container">
                  <p><strong>Predicted Latitude:</strong> {futureLocation.lat}</p>
                  <p><strong>Predicted Longitude:</strong> {futureLocation.lng}</p>
                </div>
              )}

              {/* Google Map */}
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={futureLocation.lat ? futureLocation : center}
                  zoom={10}
                  onLoad={(map) => setMap(map)}
                >
                  {futureLocation.lat && futureLocation.lng && (
                    <Marker
                      position={futureLocation}
                      icon={{
                        url: speciesIcons[selectedSpecies],
                        scaledSize: new window.google.maps.Size(50, 50),
                      }}
                      animation={window.google.maps.Animation.DROP}
                    />
                  )}
                </GoogleMap>
              </div>

              {/* Species Information Panel */}
              <div className="info-panel">
                <h3>Species Information</h3>
                {speciesData[selectedSpecies] ? (
                  <div className="species-info">
                    <div className="species-img">
                      <img src={speciesData[selectedSpecies].image} alt={selectedSpecies} />
                    </div>
                    <div className="species-details">
                      <p><strong>Scientific Name:</strong> {speciesData[selectedSpecies].scientific_name}</p>
                      <p><strong>Description:</strong> {speciesData[selectedSpecies].description}</p>
                      <p><strong>Habitat:</strong> {speciesData[selectedSpecies].habitat}</p>
                      <p><strong>Behavior:</strong> {speciesData[selectedSpecies].behavior}</p>
                      <p><strong>Diet:</strong> {speciesData[selectedSpecies].diet}</p>
                      <p><strong>Conservation Status:</strong> {speciesData[selectedSpecies].conservation_status}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading species information...</p>
                )}
              </div>
            </div>
          } />
          <Route path="/model-info" element={<ModelInfo />} />
        </Routes>
      </div>
    </Router>
  ) : (
    <div className="loading">Loading...</div>
  );
}

export default App;