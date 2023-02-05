import React from "react";
//import "./Signup.css";
function Signup() {
  return (
    <div>
      <div className="form">
        <img src=""></img>
        <div className="Createtext">Create your Tripza Account</div>
        <form method="#">
          <input type="text" className="name" />
          <input type="text" className="phone" />
          <input type="text" className="password" />
          <input type="text" className="birthdate" />
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
        <div className="Subscribed">
          <h1 className="Hotel">Hotel Agency</h1>
          <h1 className="Subscribe-via">
            Subscribe via <img src="./logos/khalti.png" alt=""></img>{" "}
          </h1>
          <h1 className="Money">Rs.999/Month</h1>
        </div>
      </div>
    </div>
  );
}
export default Signup;
