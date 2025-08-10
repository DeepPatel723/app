import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthActions from './components/AuthActions'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import PartnerAuth from './components/PartnerAuth/PartnerAuth'
import PartnerRegister from './components/PartnerAuth/PartnerRegister'
import PartnerLogin from './components/PartnerAuth/PartnerLogin'

function App() {

  return (
    <div className="container">
      {/* <AuthActions />   */}
      <NavBar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/partner" element={<PartnerAuth />}>
          <Route path="register" element={<PartnerRegister />} />
          <Route path="login" element={<PartnerLogin />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
