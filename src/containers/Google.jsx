import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { googleAuthenticate } from '../actions/auth';
import queryString from 'query-string';

const Google = ({ googleAuthenticate }) => {
    let location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            googleAuthenticate(state, code);
        }
    }, [location]);

    return (
        <div className='google-login-container'>
            <div>
                <h1>Welcome to Auth System!</h1>
                <p>Click the Log In button</p>
                <Link to='/login' role='button'>Login</Link>
            </div>
        </div>
    );
};

export default connect(null, { googleAuthenticate })(Google);