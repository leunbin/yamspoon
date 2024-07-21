import React from 'react';

const LikeIcon = (props) => {
    return (
    <svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
        {/* eslint-disable-next-line */}
        <path d="M15.2953 1.5C12.0833 1.5 10.5 4.77272 10.5 4.77272C10.5 4.77272 8.91675 1.5 5.70474 1.5C3.09435 1.5 1.02722 3.75715 1.00051 6.45049C0.946082 12.0412 5.29161 16.0171 10.0547 19.3583C10.186 19.4506 10.3412 19.5 10.5 19.5C10.6588 19.5 10.814 19.4506 10.9453 19.3583C15.7079 16.0171 20.0534 12.0412 19.9995 6.45049C19.9728 3.75715 17.9057 1.5 15.2953 1.5Z" fill={props.fill} stroke="#D3233A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    )
}

export default LikeIcon;
