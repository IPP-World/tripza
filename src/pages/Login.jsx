import React from 'react';
import './Login.css';
import {FcGoogle} from 'react-icons/fc'
import khalti from '../assets/khaltiLogo.png'
function Login(){
    return(
        <div className='loginpage'>
            <div className='box'>
                <img src={khalti}>
                </img>
                <h1>Welcome</h1>
                <p>We are glad to see you.</p>
                <form method="#">
                    <input type="text" className='name' placeholder='name'/>
                    <input type="text" className='password' placeholder='password'/>
                </form>
                <button type="submit" className='login-btn'>Login</button>
                    <div className='or'>or</div>
                    <div className='loginwith'>login with</div>
                    <button type='submit' className='google'><FcGoogle className='googlelogo'/>Google</button>
                <div className='noacc'>Don't have an account?<span><a href='./signup'>Sign up</a></span></div>
            </div>
        </div>
    )
}
export default Login;

