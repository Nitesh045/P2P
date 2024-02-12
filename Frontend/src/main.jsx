import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import { SocketP } from './Components/Context/Socket.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketP>
        <App />
      </SocketP>
    </BrowserRouter>
  </React.StrictMode>
)
