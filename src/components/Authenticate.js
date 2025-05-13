import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

import "../css/Authenticate.css";
import { useNavigate } from "react-router-dom";

const Authenticate = ({ account }) => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dataLogged, setDataLogged] = useState(false);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState({});

  const handleScan = async (result, scanError) => {
    try {
      if (!!result && !!result?.text && !dataLogged) {
        let data = JSON.parse(result?.text);
        console.log("data: ", data);
        setDataLogged(true);
        if (data.hash) {
          try {
            let res = await axios.get(
              `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${data.hash}&apikey=AQ8I2UWIE7Z2FHBVF2U6RTFMI7NUR8HTJR`
            );
            if (res) {
              setMessage("Product is Authenticated ✅");
              setShowData(true);
              setData(data);
              setAuth(true);
            }
          } catch (authError) {
            setError("Error authenticating product. Please try again.");
          }
        }
      }
    } catch (jsonError) {
      setError("Invalid QR Code. Authentication Failed");
      console.error(jsonError);
    }

    if (!!scanError) {
      setError("Invalid QR Code. Authentication Failed");
      console.error(scanError);
    }
  };

  const previewStyle = {
    height: 400,
    width: 400,
  };

  return (
    <>
      <div className="cam" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h4 style={{ color: "#000", position: "fixed", right: 8, top: 2 }}>
          Wallet Address:{" "}
          {account.substring(0, 4) +
            "..." +
            account.substring(account.length - 4, account.length)}
        </h4>
        <br />
        <h2 style={{ position: "relative", marginTop:'2px' }}>
          Hold QR Code Steady and Clear to Scan
        </h2>
        <div style={{ position: "relative", marginTop:'10px' }}>
          <h3>
            Please wait for 15 sec if Authentication messages are not appearing
            on the screen then your product is not Authenticated.
          </h3>
          <br />
          <span>Please reload the page to Scan again.</span>
        </div>
        
        <QrScanner
          delay={300}
          onScan={handleScan}
          onError={(err) => console.error(err)}
          style={previewStyle}
          constraints={{
            video: { facingMode: "environment" }
          }}
        />

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            top: "20%",
          }}
        >
          <div>
            {error ? <h1 style={{ color: "red" }}>{error}</h1> : <h1>{message}</h1>}
          </div>
        </div>
        
        {showData && (
          <div style={{ position: "relative", marginTop:'2%', fontSize:'15px' }}>
            <p>Consumer Address: {data.consumerAdd}</p>
            <p>Consumer Name: {data.consumerName}</p>
            <p>Cost: {data.cost}</p>
            <p>Description: {data.description}</p>
            <p>Distributor ID: {data.distributorId}</p>
            <p>Hash: {data.hash}</p>
            <p>Name: {data.name}</p>
            <p>Quantity: {data.quantity}</p>
            <p>Vendor Address: {data.vendorAdd}</p>
            <p>Vendor Name: {data.vendorName}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Authenticate;