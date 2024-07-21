import React from "react";
import propTypes from "prop-types";

export default function Save({ fill, strokeWidth, stroke, viewBox, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={fill}
            viewBox={viewBox}
            strokeWidth={strokeWidth}
            stroke={stroke}
            className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
    );
}

// props 정의
Save.propTypes = {
    fill: propTypes.string,
    strokeWidth: propTypes.number,
    stroke: propTypes.string,
    viewBox: propTypes.string,
    className: propTypes.string, // 추가된 className prop 타입 정의
};

// 기본값
Save.defaultProps = {
    fill: 'none',
    strokeWidth: 1.5,
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    className: 'w-6 h-6'
};


