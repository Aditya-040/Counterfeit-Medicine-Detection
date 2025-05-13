import React from "react";
import "../css/home.css";
import { NavLink } from "react-router-dom";

const Home = ({ account, onDisconnect }) => {
  return (
    <div className="container">
      <div id="login-type-container">
        <div className="wallet-header">
          <h4 className="wallet-address">
            Wallet Address:{" "}
            {account.substring(0, 4) +
              "..." +
              account.substring(account.length - 4, account.length)}
          </h4>
          <button onClick={onDisconnect} className="disconnect-btn">
            Disconnect Wallet
          </button>
        </div>
        <br />
        <div id="login-type">
          <h1 id="greetings">Welcome to Medi Block!</h1>
          <h1 id="subtitle-txt">
            A Blockchain Based Fake Medicine Detection 🕵️‍♀️
          </h1>
          <div id="options-container">
            <NavLink to="/vendor" className="select-link">
              <div className="options">
                <img
                  src="/assets/images/manufacturer.png"
                  alt="manufacturer"
                  className="options-image"
                />
                <h1 className="options-image-caption">Manufacturer Login</h1>
              </div>
            </NavLink>
            <NavLink to="/distributorform" className="select-link">
              <div className="options">
                <img
                  src="/assets/images/distributor.png"
                  alt="manufacturer"
                  className="options-image"
                />
                <h1 className="options-image-caption">Distributor Login</h1>
              </div>
            </NavLink>
            <NavLink to="/authenticate" className="select-link">
              <div className="options">
                <img
                  src="/assets/images/qr-code-scan.png"
                  alt="manufacturer"
                  className="options-image"
                />
                <h1 className="options-image-caption">Authenticate Product</h1>
              </div>
            </NavLink>
            <NavLink to="/medicine-auth" className="select-link">
              <div className="options">
                <img
                  src="/assets/images/medicine-auth.png"
                  alt="medicine authentication"
                  className="options-image"
                />
                <h1 className="options-image-caption">AI Medicine Authentication</h1>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
