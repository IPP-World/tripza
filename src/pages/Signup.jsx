import React from "react";
import khaltiLogo from "../assets/khaltiLogo.png"
//import "./Signup.css";
function Signup() {
  return (
    <div>
      <div className="form">
        <img src=""></img>
        <div className="Createtext">Create your Tripza Account</div>
        <form method="#">
          <input  className = "signup--name" type="text" />
          <input  className = "signup--phone" type="text"/>
          <input  className = "signup--password" type="text" />
          <input  className = "signup--birthdate" type="text" />
          {/* Date of birth<span>(YYYY-MM-DD)AD</span> */}
        </form>
      </div>
      <div>
        <h1 className="signup">Sign-up as</h1>
        <div className="general">
          <h1 className="generaluser">General User</h1>
          <button className="signup-btn" type="submit">
            Sign up
          </button>
        </div>
        <div className="signup--subscribed">
          <h1 className="signup--hotel">Hotel Agency</h1>
          <h1 className="subscribe-via">
            Subscribe via 
          </h1>
          <img src={khaltiLogo} alt=""></img>
          <h1 className="signup--price">Rs.999/Month</h1>
        </div>
      </div>
    </div>
  );
}
export default Signup;
