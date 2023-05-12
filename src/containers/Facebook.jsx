import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { facebookAuthenticate } from '../actions/auth';
import queryString from 'query-string';

const Facebook = ({ facebookAuthenticate }) => {
    let location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            facebookAuthenticate(state, code);
        }
    }, [location]);

    return (
        <div className='fb-login-container'>
            <div>
                <h1>Welcome to Auth System!</h1>
                <hr class='my-4' />
                <p>Click the Log In button</p>
                <Link to='/login' role='button'>Login</Link>
            </div>
        </div>
    );
};

export default connect(null, { facebookAuthenticate })(Facebook);
