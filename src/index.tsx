import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CollectionPage from './components/CollectionPage';
import {login, logout, validateToken, PrivateRoute} from './components/Auth'
import Login from './components/Login'
import CreateProduct from './components/CreateProduct'
import { Router , Redirect } from "@reach/router"



const routes = (
    <Router>
      <PrivateRoute path='/' component={App}/>
      <PrivateRoute path="/:collection" component={CollectionPage}/>
      <PrivateRoute path='/create' component={CreateProduct}/>
      <Login path='/login'/>
    </Router>
)

ReactDOM.render(
  <React.StrictMode>
    {routes}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
