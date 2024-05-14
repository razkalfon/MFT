import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import 'bootstrap/dist/css/bootstrap.min.css';

const port = process.env.PORT || 3000; // או כל מספר פורט אחר שברצונך

ReactDOM.render(<App />, document.getElementById("root"));
