import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';
import axios from 'axios';

const ResetPasswordConfirm = () => {
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });
    const [resetSuccess, setResetSuccess] = useState(false)
    const params = useParams()

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        e.preventDefault();

        const body = JSON.stringify({ uid: params.uid, token: params.token, new_password: formData.new_password, re_new_password: formData.re_new_password });
        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config)
            
            setResetSuccess(true)
        }catch(e){
            alert(e)
    }
    };

    if(resetSuccess)
       return <Navigate to='/login'/>

    return (
        <div>
            <form onSubmit={e => onSubmit(e)}>
            <div>
                    <input
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <button type='submit'>Reset Password</button>
            </form>
        </div>
    );
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);