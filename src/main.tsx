import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'               // initialise i18next before render
import './styles/globals.css' // Tailwind + global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
