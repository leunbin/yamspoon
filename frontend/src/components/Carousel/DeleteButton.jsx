import React from 'react';
import PropTypes from 'prop-types';
import Delete from '../Icons/Delete';
import './Carousel.scss';

const DeleteButton = ({ onClick }) => {
    return (
        <button className='delete-button' onClick={onClick}>
            <Delete />
        </button>
    )
}

DeleteButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default DeleteButton;