import React from 'react';
import './Footer.scss';
import Logo from '../Icons/LogoIcon';

const Footer = () => {
  return (
    <footer>
        <div className='container'>
          <Logo className="logo" alt ="logo" />
          <p>Copyright ©️ eliceTeam6.All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;