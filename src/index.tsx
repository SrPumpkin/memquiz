import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { storage } from './storage';


const root = ReactDOM.createRoot(
    document.getElementById('main') as HTMLElement
);

root.render(
    <Provider store={storage}>
        <App />
    </Provider>
);
