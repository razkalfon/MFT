import React, { useState, useRef } from 'react';
import './ForgetPassword.css'; // קובץ CSS עם העיצוב
import logo from "./logo.empaty.jpeg";

function ForgetPassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState(null);
  const idEmailRef = useRef(null);

  const handleResetPassword = async () => {
    const email = idEmailRef.current.value;

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      setError(''); // איפוס השגיאה אם יש הודעה
      setDisplayedMessage('message'); // סמן שהודעה נוצגה
    } else {
      setError(data.error);
      setMessage(''); // איפוס ההודעה אם יש שגיאה
      setDisplayedMessage('error'); // סמן ששגיאה נוצגה
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-popup">
        <div className='box'>
          <img
            style={{ marginBottom: "10px" }}
            src={logo}
            alt="MFT Logo"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
          <h2>איפוס סיסמה</h2>
          <h4>אימייל</h4>
          <input ref={idEmailRef} type="text" />
          <button className='btn_reset' onClick={handleResetPassword}>איפוס סיסמה</button>
          {displayedMessage === 'message' && message && <h4>{message}</h4>} {/* הצגת הודעה אם יש הודעה ואין שגיאה */}
          {displayedMessage === 'error' && error && <h4>{error}</h4>} {/* הצגת שגיאה אם יש שגיאה ואין הודעה */}
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
