import React from 'react'
import { Outlet } from 'react-router-dom';

const PartnerAuth = () => {
  return (
    <div className="partner-auth-container">
        <div className="partner-auth-left-side">Partner</div>
        <div className="partner-auth-right-side">
            <Outlet />
        </div>
    </div>
  )
}

export default PartnerAuth;