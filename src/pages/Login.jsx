import React, { useState } from 'react';
import './Login.css';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import axios from 'axios';

import { FcGoogle } from 'react-icons/fc'
import {FaFacebook} from 'react-icons/fa'
import khalti from '../assets/khaltiLogo.png'
const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '' 
    });
    const { email, password } = formData;

    const handleChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value })};

    const onSubmit = e => {
        e.preventDefault();

        login(email, password);
    };

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };

    const continueWithFacebook = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };

    if (isAuthenticated) {
        return <Navigate to='/' />
    }

    return (

        <div className='loginpage'>
            <div className='box'>
                <img src={khalti}></img>
                <h1>Welcome</h1>
                <p>We are glad to see you.</p>
                <form onSubmit={e => onSubmit(e)}>
                    <input
                        type="email"
                        className='name'
                        name="email"
                        value={email}
                        placeholder='Email'
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        className='password'
                        name="password"
                        value={password}
                        placeholder='password'
                        onChange={handleChange}
                        minLength='6'
                        required

                    />
                </form>

                <button type="submit" className='login-btn'>Login</button>
               
                <div className='or'>or</div>

                <div className='loginwith'>login with</div>

                <button type='submit' className='google' onClick={continueWithGoogle} ><FcGoogle className='googlelogo' />Google</button>
                
                <button type='submit' className='facebook' onClick={continueWithFacebook} ><FaFacebook className='facebooklogo' />Facebook</button>

                <div className='noacc'>Don't have an account?<span><a href='./Signup'>Sign up</a></span></div>
                <p className='forgot-password'>
                Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
            </p>
            </div>
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);

