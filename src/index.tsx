import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CollectionPage from './components/CollectionPage';
import {login, logout, validateToken, PrivateRoute} from './components/Auth'
import Login from './components/Login'
import CreateProduct from './components/CreateProduct'
import { Router , Redirect } from "@reach/router"
import ProductPage from './components/ProductPage';
import ImagesPage from './components/ImagesPage';
import CreateProductPage from './components/CreateProductPage';
import CreateCategoryPage from './components/CreateCategoryPage';
import CreateSizePage from './components/CreateSizePage';
import CreateDiscounts from './components/CreateDiscounts';



const routes = (
    <Router>
      <PrivateRoute path='/' component={App}/>
      <PrivateRoute path='/products/:productId' component={ProductPage} />
      <PrivateRoute path="/:category" component={CollectionPage}/>
      <PrivateRoute path='/create/product' component={CreateProductPage}/>
      <PrivateRoute path="/create/category" component={CreateCategoryPage}/>
      <PrivateRoute path="/create/size" component={CreateSizePage}/>
      <PrivateRoute path="/create/discount" component={CreateDiscounts}/>
      <PrivateRoute path='/images' component={ImagesPage}/>
      <Login path='/login'/>
    </Router>
)

ReactDOM.render(
  <React.StrictMode>
    {routes}
  </React.StrictMode>,
  document.getElementById('root')
);

//react 18 root entry point
// const container = document.getElementById('root');;
// const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     {routes}
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
