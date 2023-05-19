import React, { useState } from "react";
import "./Login.css";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import logo from "../assets/logo.png";
import bg from "../assets/signupbg.jpg";
const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login--background">
      <img className="login--bg" src={bg} alt="logo" />
      <div className="loginpage">
        <div className="login--glass"></div>
        <div className="login--right">
          <img className="login--logo" src={logo}></img>
        </div>
        <div className="login--left">
          <div className="box">
            <h1 className="login--welcome">Welcome</h1>
            <p className="login--glad">We are glad to see you.</p>
            <form onSubmit={(e) => onSubmit(e)}>
              <input
                type="email"
                className="name"
                name="email"
                value={email}
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                className="password"
                name="password"
                value={password}
                placeholder="password"
                onChange={handleChange}
                minLength="6"
                required
              />
              <button type="submit" className="login-btn">
                Login
              </button>

              <div className="noacc">
                Don't have an account?
                <span>
                  <a href="./signup">Sign up</a>
                </span>
              </div>
              <div className="reset-signup">
                <p className="forgot-password">
                  Forgot your Password?{" "}
                  <Link className="loginreset-password" to="/reset-password">
                    Reset Password
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
