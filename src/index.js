import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CollectionPage from './components/CollectionPage';

const routes = (
  <Router>
    <Routes>
      <Route exact path='/' element={<App/>}/>
      <Route path='/:collection' element={<CollectionPage/>}/>
    </Routes>
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
reportWebVitals();
