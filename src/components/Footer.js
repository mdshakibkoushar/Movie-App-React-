import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🎬</span>
          <span className="footer-name">CineVault</span>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} SHAKIB. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
