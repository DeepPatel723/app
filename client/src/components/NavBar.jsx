import React from 'react'
import { useState } from 'react';
import AuthActions from './AuthActions';

const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false)
  return (
    <div>Navbar
        <button onClick={() => setShowLogin(!showLogin)}>
          SignIn
        </button>
      {showLogin && (<AuthActions onClose={() => setShowLogin(false)} />)}
    </div>
  )
}

export default NavBar;