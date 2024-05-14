import React, { useState, useRef } from 'react';
import './Log.css';
import logoo from "./logo.empaty.jpeg"; 
import { useNavigate } from 'react-router-dom';

function Log() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState(null);
  const idEmailRef = useRef(null);
  const idPasswordRef = useRef(null);

  const handleLogin = async () => {
    const email = idEmailRef.current.value;
    const password = idPasswordRef.current.value;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      setError(''); // איפוס השגיאה אם יש הודעה
      setDisplayedMessage('message'); // סמן שהודעה נוצגה
      window.tempemail = idEmailRef.current.value;
    } else {
      setError(data.error);
      setMessage(''); // איפוס ההודעה אם יש שגיאה
      setDisplayedMessage('error'); // סמן ששגיאה נוצגה
    }
  };

  return (
    <div className="log-container">
      <div className="log-popup">
        <div className='box'>
          <img
            style={{marginBottom: "10px"}}
            src={logoo}
            alt="MFT Logo"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
          <h2>התחברות</h2>
          <h4>אימייל</h4>
          <input ref={idEmailRef} type="text" />
          <h4>סיסמה</h4>
          <input ref={idPasswordRef} type="password" />
          <button className="btn_log" onClick={handleLogin}>התחבר</button>
          {displayedMessage === 'message' && message && <h4>{message}</h4>} {/* הצגת הודעה אם יש הודעה ואין שגיאה */}
          {displayedMessage === 'error' && error && <h4>{error}</h4>} {/* הצגת שגיאה אם יש שגיאה ואין הודעה */}
          <div className="reg">
            <a href="registration">
              הרשמה
            </a>
            <div>
              <a href="forget-Password">
                שכחתי סיסמה
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;
