import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { completePartnerProfile } from '../../slices/partner.slice';

const CompletePartnerProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.partnerAuth);

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [orgname, setOrgname] = useState('');

    const submit = async () => {
        if (phone.length !== 10) return alert("Enter valid 10-digit phone");
        if (password.length < 6) return alert("Password must be at least 6 characters");
        const res = await dispatch(completePartnerProfile({ token, phone, password, orgname }));
        console.log(res);
        if (res.meta.requestStatus === "fulfilled") {
            alert("Profile completed!");
            navigate("/partner/login");
        }
    };
    return (
         <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Complete Partner Profile</h2>
      <label>Place Name</label>
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        value={orgname}
        onChange={(e) => setOrgname(e.target.value)}
      />
      <label>Phone</label>
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Save</button>
    </div>
    )
}

export default CompletePartnerProfile;