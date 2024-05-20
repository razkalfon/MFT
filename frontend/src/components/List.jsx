import React, { useRef, useState, useEffect } from "react";
import "./List.css";

const handleSellStock = async (tempEmail, datesell, closeprice, removeSymbol, removeQuantity, setMyList2, setMyList) => {
  const newStock = {
    datesell,
    closeprice,
    symbol: removeSymbol,
    quantity: removeQuantity
  };
  try {
    const response = await fetch(`/api/stock/sell_stock/${tempEmail}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStock)
    });

    if (!response.ok) {
      throw new Error('הסרת המניה נכשלה');
    }

    const responseData = await response.json();
    setMyList2(prev => [...prev, responseData]);
    setMyList(prev => {
      const updatedList = prev.map(stock => {
        if (stock.symbol === removeSymbol) {
          stock.quantity -= removeQuantity;
          if (stock.quantity === 0) {
            return null;
          } else {
            stock.pldaily = ((parseFloat(closeprice) - parseFloat(stock.openPrice)) * stock.quantity).toFixed(2);
          }
        }
        return stock;
      }).filter(stock => stock !== null);
      return updatedList;
    });
  } catch (error) {
    console.error(error);
  }
};

const handleBuyStock = async (tempEmail, datebuy, openPrice, symbol, quantity, setMyList, setMyList2) => {
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
      throw new Error('הוספת המניה נכשלה');
    }

    const responseData = await response.json();
    setMyList(responseData);
    setMyList2(prev => [...prev, responseData]);
  } catch (error) {
    console.error(error);
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
  const [mylist2, setMyList2] = useState([]);

  const tempEmail = window.tempemail;

  const getListStock = async () => {
    try {
      const res = await fetch(`/api/stock/get_listStocks/${tempEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('בעיה בהצגת הרשימה');
      }

      const responseData = await res.json();
      setMyList(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (tempEmail && displaySection === "stocks") {
      getListStock();
    }
  }, [displaySection, tempEmail]);

  const getStocksHistory = async () => {
    try {
      const res = await fetch(`/api/stock/get_stocksHistory/${tempEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('בעיה בהצגת הרשימה');
      }

      const responseData = await res.json();
      setMyList2(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (tempEmail && displaySection === "diary") {
      getStocksHistory();
    }
  }, [displaySection, tempEmail]);

  const addNewStock = async () => {
    const datebuy = id_buy_date.current.value;
    const openPrice = id_open_price.current.value;
    const symbol = id_symboll_buy.current.value;
    const quantity = id_quantity_buy.current.value;
    if (tempEmail) {
      await handleBuyStock(tempEmail, datebuy, openPrice, symbol, quantity, setMyList, setMyList2);
    } else {
      console.error("אין כתובת מייל זמינה");
    }
  };

  const removeStock = async () => {
    const removeSymbol = id_symboll_sell.current.value;
    const removeQuantity = parseInt(id_quantity_sell.current.value, 10);
    const datesell = id_sell_date.current.value;
    const closeprice = id_close_price.current.value;
    if (tempEmail) {
      await handleSellStock(tempEmail, datesell, closeprice, removeSymbol, removeQuantity, setMyList2, setMyList);
    } else {
      console.error("אין כתובת מייל זמינה");
    }
  };

  return (
    <div className="calculators-container">
      <div className="buttons">
        <button className="btn_buy1" onClick={() => setDisplaySection("buy")}>קניית מניה</button>
        <button className="btn_my_list" onClick={() => setDisplaySection("stocks")}>רשימת המניות שלי</button>
        <button className="btn_sell1" onClick={() => setDisplaySection("sell")}>מכירת מניה</button>
        <button className="btn_diary" onClick={() => setDisplaySection("diary")}>יומן העסקאות</button>
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
          <h2>היסטוריית העסקאות שלי</h2>
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
                {mylist2.map((item, index) => (
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
