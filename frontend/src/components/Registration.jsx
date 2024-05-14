import React, { useState, useRef } from 'react';
import './Registration.css'; // קובץ CSS עם העיצוב
import logo from "./logo.empaty.jpeg"; // שימוש בתמונה כמשתנה logo

function Registration() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState(null); // משתנה חדש לזיהוי הודעה מוצגת
  const idUsernameRef = useRef(null);
  const idEmailRef = useRef(null);
  const idPasswordRef = useRef(null);

  const handleRegister = async () => {
    const username = idUsernameRef.current.value;
    const email = idEmailRef.current.value;
    const password = idPasswordRef.current.value;

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
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
    <div className="reg-container">
      <div className="registration-popup">
        <div className='box'>
          <img
            style={{ marginBottom: "10px" }}
            src={logo} // שימוש בתמונה מתוך המשתנה logo
            alt="MFT Logo"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
          <h2>הרשמה</h2>
          <h4>שם משתמש</h4>
          <input ref={idUsernameRef} type="text" />
          <h4>אימייל</h4>
          <input ref={idEmailRef} type="text" />
          <h4>סיסמה</h4>
          <input ref={idPasswordRef} type="password" />
          <button className='btn_reg' style={{ marginTop: "10px" }} onClick={handleRegister}>הרשם</button>
          {displayedMessage === 'message' && message && <h4>{message}</h4>} {/* הצגת הודעה אם יש הודעה ואין שגיאה */}
          {displayedMessage === 'error' && error && <h4>{error}</h4>} {/* הצגת שגיאה אם יש שגיאה ואין הודעה */}
        </div>
      </div>
    </div>
  );
};

export default Registration;
