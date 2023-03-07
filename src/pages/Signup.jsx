import React,{useState} from "react";
import khaltiLogo from "../assets/khaltiLogo.png";
import { FcGoogle } from "react-icons/fc";
import "./Signup.css";
//import ReactCountryInput from "react-country-input";
function Signup() {
   const[credentials,setCredentials]=useState({
     name:"",
     password:"",
     number:"",
     dob:"",
     email:""
});
 const handleChange=(e)=>{
     setCredentials({...credentials,[e.target.name]:e.target.value});
 }
  return (
    <div className="signup--page">
      <div className="signup--header">
        <img src={khaltiLogo} alt="logo" />
        <h1 className="Createtext">Create your Tripza Account </h1>
      </div>
      <div className="signup--boxes">
        <div className="signup--form">
          <form className="signup--input" method="#">
            <label for="fname"> Full name*</label>
            <input
              className="signup--inputbox"
              type="text"
              placeholder=""
              id="fname"
            />
            <label for="phone"> Phone number*</label>
            <input
              className="signup--inputbox"
              type="tel"
              placeholder=""
              id="phone"
            />
            <label for="password"> Password*</label>
            <input
              className="signup--inputbox"
              type="password"
              placeholder=""
              id="password"
            />
            <label for="dateofbirth"> Date of birth*</label>
            <input
              className="signup--inputbox"
              type="date"
              placeholder=""
              id="dateofbirth"
            />
            <label for="E-mail*"> E-mail*</label>
            <input
              className="signup--inputbox"
              type="email"
              placeholder=""
              id="E-mail"
            />
          
            {/* Date of birth<span>(YYYY-MM-DD)AD</span> */}
          </form>
        </div>
        <div className="signup--as">
          <h1 className="signup--signupas">Sign-up as</h1>
          <div className="signup--general">
            <h1 className="signup--generaluser">General User</h1>
            <button className="signup-btn" type="submit">
              Sign up
            </button>
            <h4 className="signup--generaltext">or</h4>
            <h4 className="signup--generaltext">login with</h4> <br />
            <button className="signup--submitgoogle" type="submit">
              <FcGoogle className="signup--googlelogo" /> Google
            </button>
          </div>
          <div className="signup--subscribeduser">
            <h1 className="signup--hotel">Hotel/Agency</h1>
            <div className="signup--subscribe">
              <button className="signup--khalti">
                <h1 className="subscribe-via">
                  Subscribe via{" "}
                  <img
                    className="signup--khaltilogo"
                    src={khaltiLogo}
                    alt=""
                  ></img>
                </h1>
              </button>{" "}
            </div>
            <div>
              <h1 className="signup--price">Rs.999/Month</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
