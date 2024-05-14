import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // וודא שאתה מייבא את Link
import { Navbar, Nav, Container } from "react-bootstrap";
import Calendar from "./Calendar";
import Calculators from "./Calculators";
import List from "./List";
import Log from "./Log";
import Registration from "./Registration";
import logo from "./logo.empaty.jpeg";
import ForgetPassword from "./ForgetPassword";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>MFT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/calculators">מחשבונים</Nav.Link>
                <Nav.Link as={Link} to="/calendar">סיכום חודשי</Nav.Link>
                <Nav.Link as={Link} to="/list">רשימת מניות</Nav.Link>
                <Nav.Link as={Link} to="/log">כניסה</Nav.Link>
              </Nav>
              <img
                src={logo}
                alt="MFT Logo"
                width="40"
                height="40"
                className="d-inline-block align-top"
              />
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          <Routes>
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/list" element={<List />} />
            <Route path="/log" element={<Log />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/forget-password" element={<ForgetPassword />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
