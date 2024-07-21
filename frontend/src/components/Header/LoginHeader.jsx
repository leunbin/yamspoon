import React from 'react';
import { Link } from 'react-router-dom';
import './LoginHeader.scss';
import Logo from '../Icons/LogoIcon';

const LoginHeader = () => {
  return (
    <header className="login-header">
        <Link to="/"><Logo alt ="logo"/></Link>
    </header>
  );
};

export default LoginHeader;