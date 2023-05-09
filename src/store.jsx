import { applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];


const store = configureStore(
    {reducer:rootReducer},
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;