import React, { useState, useEffect } from 'react';
import './Services.css'

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch services from API and update the state
    fetch('your-api-endpoint')
      .then(response => response.json())
      .then(data => setServices(data))
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
            onClick={() => handleCategoryClick('category1')}
            className={selectedCategory === 'category1' ? 'selected' : ''}
          >
            Category 1
          </li>
          <li
            onClick={() => handleCategoryClick('category2')}
            className={selectedCategory === 'category2' ? 'selected' : ''}
          >
            Category 2
          </li>
          <li
            onClick={() => handleCategoryClick('category3')}
            className={selectedCategory === 'category3' ? 'selected' : ''}
          >
            Category 3
          </li>
          <li
            onClick={() => handleCategoryClick('category4')}
            className={selectedCategory === 'category4' ? 'selected' : ''}
          >
            Category 4
          </li>
          <li
            onClick={() => handleCategoryClick('category5')}
            className={selectedCategory === 'category5' ? 'selected' : ''}
          >
            Category 5
          </li>
          <li
            onClick={() => handleCategoryClick('category6')}
            className={selectedCategory === 'category6' ? 'selected' : ''}
          >
            Category 6
          </li>
          <li
            onClick={() => handleCategoryClick('category7')}
            className={selectedCategory === 'category7' ? 'selected' : ''}
          >
            Category 7
          </li>
          <li
            onClick={() => handleCategoryClick('category8')}
            className={selectedCategory === 'category8' ? 'selected' : ''}
          >
            Category 8
          </li>
          <li
            onClick={() => handleCategoryClick('category9')}
            className={selectedCategory === 'category9' ? 'selected' : ''}
          >
            Category 9
          </li>
        </ul>
      </div>
      <div className="selected-category">
        <h2>Selected Category: {selectedCategory || 'All'}</h2>
        {filteredServices.map(service => (
          <div className="service" key={service.id}>
            <img src={service.image} alt={service.name} />
            <p>{service.name}</p>
            <p>{service.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
