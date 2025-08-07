import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const preloader = document.getElementById('preloader');
const rootElement = document.getElementById('root');

if (preloader) preloader.style.display = 'none';
if (rootElement) rootElement.style.display = 'block';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
