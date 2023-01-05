import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/App';
import reportWebVitals from './reportWebVitals';
import {consumeCrashCode} from "./utils/PageUrl";
import {createRoot} from "react-dom/client";

consumeCrashCode()
const root = createRoot(document.getElementById("root")!)
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
