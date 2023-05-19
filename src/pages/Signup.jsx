import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../assets/logo.png";
import bg from "../assets/signupbg.jpg";
import "./Signup.css";
import { Navigate } from "react-router";
import axios from "axios";

function Signup() {
  const [credentials, setCredentials] = useState({
    fname: "",
    lname: "",
    password: "",
    dob: "",
    email: "",
    number: "",
  });
  const [signupSuccess, setSignUpSuccess] = useState(false);
  function submit(e) {
    console.log("Submitting");
    e.preventDefault();
     const { fname, lname, password, dob, email, number } = credentials;
  if (!fname || !lname || !password || !dob || !email || !number) {
    toast.error('Please fill in all required fields');
    return;
  } 
    


    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      fname: credentials.fname,
      lname: credentials.lname,
      email: credentials.email,
      number: credentials.number,
      password: credentials.password,
      password2: credentials.password,
      dob: credentials.dob,
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/user/register/`, body, config)
      .then((r) => {
          setSignUpSuccess(true);
          alert('Signup successful! Check your e-mail for activation')
        //   toast.info('Signup successful! Check your e-mail for activation');


      })
      .catch((e) => {
        console.error(e);
        toast.error('Error signing up! Seems like e-mail is already in taken');
      });
      
  }
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  if (signupSuccess) return <Navigate to="/login" />;

  return (
    <div className="signup--background">
        <img className="signup--bg" src={bg} alt="logo" />
    <div className="signup--page">
      <div className="signup--header">
        <img className="signup--logo" src={logo} alt="logo" />
        <h1 className="Createtext">Create your Tripza Account </h1>
      </div>
      <div className="signup--boxes">
        <div className="signup--form">
          <form className="signup--input" method="POST">
            <label htmlFor="fname"> First Name*</label>
            <input
              className="signup--inputbox"
              type="text"
              placeholder=""
              name="fname"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="fname"> Last Name*</label>
            <input
              className="signup--inputbox"
              type="text"
              placeholder=""
              name="lname"
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="number"> Phone number*</label>
            <input
              className="signup--inputbox"
              type="tel"
              placeholder=""
              name="number"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="password"> Password*</label>
            <input
              className="signup--inputbox"
              type="password"
              placeholder=""
              name="password"
              minLength="6"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="dateofbirth"> Date of birth*</label>
            <input
              className="signup--inputbox"
              type="date"
              placeholder=""
              name="dob"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="E-mail*"> E-mail*</label>
            <input
              className="signup--inputbox"
              type="email"
              placeholder=""
              name="email"
              onChange={(e) => handleChange(e)}
            />
          </form>
        </div>
      </div>
      <div className="signup--general">
        <button className="signup-btn" type="submit" onClick={(e) => submit(e)}>
          Sign up
        </button>
      </div>
    </div>
    <div className="signup--glass"></div>
    <ToastContainer />
    </div>
    
  );
}
export default Signup;
