import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import BoxComponent from "./Components/BoxComponent";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ <App /> } />
                <Route path="/" element={ <BoxComponent /> } />
            </Routes>
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
