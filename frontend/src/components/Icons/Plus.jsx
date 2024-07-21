import React from "react";
import PropTypes from 'prop-types';

export default function Plus({ width, height, strokeColor }) {

    return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width} height={height} stroke={strokeColor}>
        <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 112v288M400 256H112"/>
    </svg>
    );
}

Plus.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    strokeColor: PropTypes.string.isRequired,
};
