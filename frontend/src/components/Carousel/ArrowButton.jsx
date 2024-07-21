import React from 'react';
import PropTypes from 'prop-types';
import Arrow from '../Icons/Arrow';
import './Carousel.scss';

const ArrowButton = ({ direction, onClick }) => {
    return (
        <button className={`arrow-button ${direction}-button`} onClick={onClick}>
            <Arrow />
        </button>
    )
}

ArrowButton.propTypes = {
    direction: PropTypes.oneOf(['previous', 'next']).isRequired,
    onClick: PropTypes.func.isRequired,
}

export default ArrowButton;