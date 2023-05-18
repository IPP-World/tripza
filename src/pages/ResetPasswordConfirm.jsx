import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default () => {
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });
    const [resetSuccess, setResetSuccess] = useState(false)
    const params = useParams()

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        console.log("Submitting")
        e.preventDefault()
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ password: formData.new_password, password2: formData.re_new_password });

        axios.post(`${process.env.REACT_APP_API_URL}/api/user/reset-password/${params.uid}/${params.token}/`, body, config)
        .then(r=>setResetSuccess(true))
        .catch(r=>alert("Error resetting password"))

    };

    if(resetSuccess)
       return <Navigate to='/login'/>
    return (
        <div>
            <form onSubmit={e => onSubmit(e)}>
                    <input
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                    <input
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                <button type='submit'>Reset Password</button>
            </form>
        </div>
    );
};