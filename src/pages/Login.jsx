import React from 'react';
import './Login.css';
function Login(){
    return(
        <>
        <div className='box'>
        <img src="">
        </img>
        <div className="welcome">Welcome!</div>
        <div className="glad">We are glad to see you.</div>
        <form method="#">
            <input type="text" className='name'/>
            <input type="text" className='password'/>
        </form>
        <button type="submit" className='login-btn'>Login</button>
        <div className='or'>or</div>
        <div className='loginwith'>login with</div>
        <button type='submit' className='google'><i class="fa-brands fa-google"></i>Google</button>
        <div className='noacc'>Don't have an account?<span><a href='./signup'>Sign up</a></span></div>
        </div>
        </>
    )
}
export default Login;

