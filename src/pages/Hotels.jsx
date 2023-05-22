import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './Services.css'

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch services from API and update the state
    fetch(`http://127.0.0.1:8000/api/hotel/show`)
      .then(response => response.json())
      .then(data =>{
        setServices(data)
        
      })
      .catch(error => console.log(error));
  }, []);
  


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  return (
    <div className='services--page'>
      <div className="services--categories">
        <ul>
          <li
            onClick={() => handleCategoryClick('')}
            className={selectedCategory === '' ? 'selected' : ''}
          >
            All
          </li>
          <li
            onClick={() => handleCategoryClick('Room')}
            className={selectedCategory === 'Room' ? 'selected' : ''}
          >
            Room
          </li>
          <li
            onClick={() => handleCategoryClick('Restaurant')}
            className={selectedCategory === 'Restaurant' ? 'selected' : ''}
          >
            Restaurant
          </li>
          <li
            onClick={() => handleCategoryClick('Camping')}
            className={selectedCategory === 'Camping' ? 'selected' : ''}
          >
            Camping
          </li>
          <li
            onClick={() => handleCategoryClick('View Tower')}
            className={selectedCategory === 'View Tower' ? 'selected' : ''}
          >
            View Tower
          </li>
          <li
            onClick={() => handleCategoryClick('Boating')}
            className={selectedCategory === 'Boating' ? 'selected' : ''}
          >
            Boating
          </li>
          <li
            onClick={() => handleCategoryClick('Swimming Pool')}
            className={selectedCategory === 'Swimming Pool' ? 'selected' : ''}
          >
            Swimming Pool
          </li>
          <li
            onClick={() => handleCategoryClick('Bungee')}
            className={selectedCategory === 'Bungee' ? 'selected' : ''}
          >
            Bungee
          </li>
          <li
            onClick={() => handleCategoryClick('Rafting')}
            className={selectedCategory === 'Rafting' ? 'selected' : ''}
          >
            Rafting
          </li>
          <li
            onClick={() => handleCategoryClick('Travel Agency')}
            className={selectedCategory === 'Travel Agency' ? 'selected' : ''}
          >
            Travel Agency
          </li>
          <li
            onClick={() => handleCategoryClick('Tour Operators')}
            className={selectedCategory === 'Tour Operators' ? 'selected' : ''}
          >
            Tour Operators
          </li>
        </ul>
      </div>
      <div className="selected-category">
        {/* <h2>Selected Category: {selectedCategory || 'All'}</h2> */}
        <div className='container-whole'>
        {filteredServices.map(service => (
          <div className='service-container'>
          <div className="service--details" key={service.id}>
            {/* <p className='services--categoryname'>{selectedCategory === '' ? service.category : ''}</p> */}
            <img src={`http://localhost:8000${service.images[0].image}`} alt={service.name} />
            <p className='service---name'>{service.name}</p>
            <p className='service---location'>{service.location}</p>
            
          </div>
          </div>
          
        ))}
      </div>
    </div>
    </div>
  );
};

export default Services;
