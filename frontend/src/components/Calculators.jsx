import React, { useRef, useState } from "react";
import "./Calculators.css";

function Calculators() {
  const id_sum1 = useRef(null);
  const id_quantity = useRef(null);
  const id_sum2 = useRef(null);
  const id_ribit = useRef(null);
  const id_years = useRef(null);

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  const calculateSum = () => {
    const sum1 = parseFloat(id_sum1.current.value);
    const quantity = parseFloat(id_quantity.current.value);
    const sumResult = (sum1 / quantity).toFixed(2);
    setResult1(parseFloat(sumResult));
  };
  
  const calculateRibit = () => {
    const sum2 = parseFloat(id_sum2.current.value);
    const ribit = parseFloat(id_ribit.current.value);
    const years = parseFloat(id_years.current.value);
    const ribitResult = (sum2 * ((1 + ribit * 0.01) ** years)).toFixed(2);
    setResult2(parseFloat(ribitResult));
  };
  
  return (
    <div className="calculators-container">
      <div className="calc1">
        <h2>מחשבון יחידות</h2>
        <h4>הכנס סכום</h4>
        <input ref={id_sum1} type="number" />
        <h4>הכנס שער קנייה</h4>
        <input ref={id_quantity} type="number" />
        <button className="btn_calc1" onClick={calculateSum}>חשב</button>
        {result1 !== null && <h4>כמות יחידות: {result1}</h4>}
      </div>
      <div className="calc2">
        <h2>מחשבון ריבית דריבית</h2>
        <h4>הכנס סכום</h4>
        <input ref={id_sum2} type="number" />
        <h4>הכנס ריבית שנתית</h4>
        <input ref={id_ribit} type="number" />
        <h4>הכנס מספר שנים</h4>
        <input ref={id_years} type="number" />
        <button  className="btn_calc1" onClick={calculateRibit}>חשב</button>
        {result2 !== null && <h4>סכום הכסף שהצטבר: {result2}</h4>}
      </div>
    </div>
  );
}
export default Calculators;
