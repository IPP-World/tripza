import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    };

    fetch('http://127.0.0.1:8000/api/user/profile', config)
      .then((response) => response.json())
      .then((data) => {
        setFirstName(data.fname);
        setLastName(data.lname);
        setDOB(data.dob);
        setPhoneNumber(data.number);
        setEmail(data.email);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, []);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleDOBChange = (e) => {
    setDOB(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fname', firstName);
    formData.append('lname', lastName);
    formData.append('dob', dob);
    formData.append('number', phoneNumber);
    formData.append('email', email);
    if (photo) {
      formData.append('photo', photo);
    }
    else{
      formData.append('photo');
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    };
    
    axios
      .put(`http://127.0.0.1:8000/api/user/edit-profile/`, formData, config)
      .then((response) => {
        console.log('Profile updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            value={email}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
        <div>
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" value={dob} onChange={handleDOBChange} />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </div>
        <div>
          <label htmlFor="photo">Photo:</label>
          <input type="file" id="photo" onChange={handlePhotoChange} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;

