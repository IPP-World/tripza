import React,{useState} from 'react';
import './Login.css';

import {FcGoogle} from 'react-icons/fc'
import khalti from '../assets/khaltiLogo.png'
function Login(){
    const[credentials,setCredentials]=useState({
        name:"",
        password:""
    });
    const handleChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    return(
        
        <div className='loginpage'>
            <div className='box'>
                <img src={khalti}>
                </img>
                <h1>Welcome</h1>
                <p>We are glad to see you.</p>
                <form method="#">
                    <input type="text" className='name' name="name" value={credentials.name} placeholder='name' onChange={handleChange}/>
                    <input type="text" className='password' name="password" value={credentials.password} placeholder='password' onChange={handleChange}/>
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

