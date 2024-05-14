import React, { useRef, useState } from "react";
import "./List.css";

const handleBuyStock = async (tempEmail, datebuy, openPrice, symbol, quantity, setMyList, mylist) => {
  const newStock = {
    datebuy,
    openPrice,
    symbol,
    quantity
  };

  try {
    const response = await fetch(`/api/stock/buy_stock/${tempEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStock)
    });

    if (!response.ok) {
      throw new Error('הוספת המנייה נכשלה');
    }

    const responseData = await response.json();
    setMyList([...mylist, responseData]);
  } catch (error) {
    console.error(error);
    // טיפול בשגיאה כאן
  }
};

function List() {
  const id_symboll_buy = useRef(null);
  const id_open_price = useRef(null);
  const id_quantity_buy = useRef(null);
  const id_buy_date = useRef(null);
  const id_symboll_sell = useRef(null);
  const id_close_price = useRef(null);
  const id_quantity_sell = useRef(null);
  const id_sell_date = useRef(null);
  const [displaySection, setDisplaySection] = useState(null);
  const [mylist, setMyList] = useState([]);
  const tempEmail = window.tempemail;

  const addNewStock = async () => {
    const datebuy = id_buy_date.current.value;
    const openPrice = id_open_price.current.value;
    const symbol = id_symboll_buy.current.value;
    const quantity = id_quantity_buy.current.value;
    if (tempEmail) {
      await handleBuyStock(tempEmail, datebuy, openPrice, symbol, quantity, setMyList, mylist);
    } else {
      console.error("אין כתובת מייל זמינה");
      // טיפול במקרה בו אין כתובת מייל זמינה
    }
  };
  const removeStock = () => {
    const removeSymbol = id_symboll_sell.current.value;
    const removeQuantity = id_quantity_sell.current.value;

    const updatedList = mylist.filter((item) => {
      if (item.symbol === removeSymbol) {
        if (item.quantity === removeQuantity) {
          // אם כמות המניות שווה לכמות שרוצים להסיר - אל תכלול את הפריט במערך החדש
          return false;
        } else {
          // אם כמות המניות שונה - עדכן כמות המניות והכלול את הפריט במערך החדש
          item.quantity -= removeQuantity;
          return true;
        }
      } else {
        // אם ה-symbol של הפריט אינו תואם את ה-symbol שרוצים להסיר - כלול את הפריט במערך החדש
        return true;
      }
    });

    setMyList(updatedList);
  };

  const toggleDisplay = (section) => {
    setDisplaySection(section);
  };

  return (
    <div className="calculators-container">
      <div className="buttons">
        <button className="btn_buy1" onClick={() => toggleDisplay("buy")}>קניית מניה</button>
        <button className="btn_my_list" onClick={() => toggleDisplay("stocks")}>רשימת המניות שלי</button>
        <button className="btn_sell1" onClick={() => toggleDisplay("sell")}>מכירת מניה  </button>
        <button className="btn_diary" onClick={() => toggleDisplay("diary")}>יומן העסקאות </button>
      </div>
      <div className={`calss_buy ${displaySection === "buy" ? "" : "hidden"}`}>
        <div className="buy_h2">
          <h2>קניית מניה</h2>
        </div>
        {displaySection === "buy" && (
          <div className="buy_inputs">
            <input placeholder="שם המניה" ref={id_symboll_buy} type="text" />
            <input placeholder="שער קנייה" ref={id_open_price} type="number" />
            <input placeholder="כמות יחידות" ref={id_quantity_buy} type="number" />
            <input placeholder="תאריך קנייה" ref={id_buy_date} type="text" onFocus={(e) => { e.target.type = 'date'; }} onBlur={(e) => { e.target.type = 'text'; }} />
            <button className="btn_buy" onClick={addNewStock}>קנייה</button>
          </div>
        )}
      </div>
      <div className={`calss_sell ${displaySection === "sell" ? "" : "hidden"}`}>
        <div className="sell_h2">
          <h2>מכירת מניה</h2>
        </div>
        {displaySection === "sell" && (
          <div className="sell_inputs">
            <input placeholder="שם המניה" ref={id_symboll_sell} type="text" />
            <input placeholder="שער מכירה" ref={id_close_price} type="number" />
            <input placeholder="כמות יחידות" ref={id_quantity_sell} type="number" />
            <input placeholder="תאריך מכירה" ref={id_sell_date} type="text" onFocus={(e) => { e.target.type = 'date'; }} onBlur={(e) => { e.target.type = 'text'; }} />
            <button className="btn_sell" onClick={removeStock}>מכירה</button>
          </div>
        )}
      </div>
      <div className={`class_my_stocks ${displaySection === "diary" ? "" : "hidden"}`}>
        <div className="my_stocks">
          <h2>יומן העסקאות שלי</h2>
        </div>
        {displaySection === "diary" && (
          <div>
            <table>
              <thead>
                <tr>
                  <th className="table-pl">רווח/הפסד</th>
                  <th>כמות יחידות</th>
                  <th className="table-symboll">שם המניה</th>
                </tr>
              </thead>
              <tbody>
                {mylist.map((item, index) => (
                  <tr key={index}>
                    <td style={{ color: item.pldaily >= 0 ? 'green' : 'red' }} className="table-pl">{item.pldaily}</td>
                    <td>{item.quantity}</td>
                    <td className="table-symboll">{item.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className={`class_my_stocks ${displaySection === "stocks" ? "" : "hidden"}`}>
        <div className="my_stocks">
          <h2>רשימת המניות שלי</h2>
        </div>
        {displaySection === "stocks" && (
          <div>
            <table>
              <thead>
                <tr>
                  <th className="table-pl">רווח/הפסד</th>
                  <th>כמות יחידות</th>
                  <th className="table-symboll">שם המניה</th>
                </tr>
              </thead>
              <tbody>
                {mylist.map((item, index) => (
                  <tr key={index}>
                    <td style={{ color: item.pldaily >= 0 ? 'green' : 'red' }} className="table-pl">{item.pldaily}</td>
                    <td>{item.quantity}</td>
                    <td className="table-symboll">{item.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
