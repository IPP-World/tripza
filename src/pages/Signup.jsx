import React, { useState } from "react";
import khaltiLogo from "../assets/khaltiLogo.png";
import { FcGoogle } from "react-icons/fc";
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
    const [signupSuccess, setSignUpSuccess] = useState(false)
    function submit(e) {
        console.log("Submitting")
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ 
            fname: credentials.fname, 
            lname: credentials.lname, 
            email: credentials.email, 
            number:credentials.number,
            password: credentials.password,
            password2: credentials.password,
            dob: credentials.dob
        });
        

        axios.post(`${process.env.REACT_APP_API_URL}/api/user/register/`, body, config).then(r=>setSignUpSuccess(true)).catch(e=>{
            console.error(e)
            alert("Error signing up")
        })
    }
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    if(signupSuccess)
        return <Navigate to="/login"/>
    
        return (
        <div className="signup--page">
            <div className="signup--header">
                <img src={khaltiLogo} alt="logo" />
                <h1 className="Createtext">Create your Tripza Account </h1>
            </div>
            <div className="signup--boxes">
                <div className="signup--form">
                    <form
                        className="signup--input"
                        method="POST"
                    >
                        <label htmlFor="fname"> First Name*</label>
                        <input
                            className="signup--inputbox"
                            type="text"
                            placeholder=""
                            name="fname"
                            onChange={(e)=>handleChange(e)}
                        />
                        <label htmlFor="fname"> Last Name*</label>
                        <input
                            className="signup--inputbox"
                            type="text"
                            placeholder=""
                            name="lname"
                            onChange={(e)=>handleChange(e)}
                        />

                        <label htmlFor="number"> Phone number*</label>
                        <input
                            className="signup--inputbox"
                            type="tel"
                            placeholder=""
                            name="number"
                            onChange={(e)=>handleChange(e)}
                        />
                        <label htmlFor="password"> Password*</label>
                        <input
                            className="signup--inputbox"
                            type="password"
                            placeholder=""
                            name="password"
                            minLength="6"
                            onChange={(e)=>handleChange(e)}
                        />
                        <label htmlFor="dateofbirth"> Date of birth*</label>
                        <input
                            className="signup--inputbox"
                            type="date"
                            placeholder=""
                            name="dob"
                            onChange={(e)=>handleChange(e)}
                        />
                        <label htmlFor="E-mail*"> E-mail*</label>
                        <input
                            className="signup--inputbox"
                            type="email"
                            placeholder=""
                            name="email"
                            onChange={(e)=>handleChange(e)}
                        />

                        {/* Date of birth<span>(YYYY-MM-DD)AD</span> */}
                    </form>
                </div>
                <div className="signup--as">
                    <h1 className="signup--signupas">Sign-up as</h1>
                    <div className="signup--general">
                        <h1 className="signup--generaluser">General User</h1>
                        <button className="signup-btn" type="submit" onClick={e=>submit(e)}>
                            Sign up
                        </button>
                        <h4 className="signup--generaltext">or</h4>
                        <h4 className="signup--generaltext">login with</h4>{" "}
                        <br />
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
