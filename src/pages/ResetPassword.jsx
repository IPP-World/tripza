import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';
import './Resetpassword.css'
import bg from "../assets/signupbg.jpg";

const ResetPassword = ({ reset_password }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        reset_password(email);
        setRequestSent(true);
    };

    if (requestSent) {
        return <Navigate to='/login' />
    }

    return (
        <div className='reset--page'>
<img className="login--bg" src={bg} alt="logo" />
        <div className='reset--container'>
            <div className='reset--glass'></div>
            <h1 className='reset--text'>Request Password Reset</h1>
            <form onSubmit={e => onSubmit(e)}>
                <div>
                    <input
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <button type='submit' className='reset-btn'>Reset Password</button>
            </form>
        </div>
        </div>
    );
};

export default connect(null, { reset_password })(ResetPassword);
