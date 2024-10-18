// src/components/Home.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS file for Home component
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap'; // Import necessary Bootstrap components

const items = [
  { src: 'feature1.png', altText: 'Image 1',  },
  { src: 'feature2.png', altText: 'Image 2',  },
  { src: 'feature3.png', altText: 'Image 3', },
  { src: 'feature4.png', altText: 'Image 4', },
];

function Home() {
  const [activeIndex, setActiveIndex] = useState(0); // State for the active carousel item

  // Function to go to the next image
  const next = () => {
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  // Function to go to the previous image
  const prev = () => {
    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  // Use Effect to handle automatic image change
  useEffect(() => {
    const interval = setInterval(() => {
      next(); // Automatically go to the next image
    }, 3000); // Change image every 3 seconds

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(interval);
  }, [activeIndex]); // Depend on activeIndex so it updates properly

  return (
    <div className="home-container">
      <h1>Welcome to Wildlife Prediction App</h1>
      <p>
        This website helps you predict future locations of various wildlife species using telemetry data.
        Our predictive model is designed to assist researchers, conservationists, and wildlife enthusiasts
        in understanding wildlife movement patterns effectively.
      </p>

      <h2>Features</h2>
      <div className="card-deck">
        {['Predict future locations', 'Access detailed information', 'User-friendly interface', 'Dynamic data fetching'].map(feature => (
          <Card key={feature} className="feature-card">
            <CardBody>
              <CardTitle tag="h5">{feature}</CardTitle>
             
            </CardBody>
          </Card>
        ))}
      </div>

      <h2>Who Can Be Benefited?</h2>
      <div className="benefit-carousel-container">
        <div className="who-can-benefit">
          <p>This platform is ideal for:</p>
          <ul>
            <li>Researchers studying wildlife behavior</li>
            <li>Conservationists working to protect endangered species</li>
            <li>Students and educators in environmental sciences</li>
            <li>Wildlife enthusiasts and birdwatchers</li>
          </ul>
        </div>

        <div className="carousel-container">
          
          <div className="carousel-item-container">
            <h1></h1>
            {items.map((item, index) => (
              <div key={index} className={`carousel-item ${activeIndex === index ? 'active' : ''}`}>
                <img src={item.src} alt={item.altText} className="carousel-image" />
                <h5 className="carousel-caption">{item.caption}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Home;
