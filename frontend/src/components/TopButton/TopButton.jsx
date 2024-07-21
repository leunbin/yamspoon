import React from "react";
import { useNavigate } from "react-router-dom";
import Plus from "../Icons/Plus";
import "./TopButton.scss";

function TopButton() {
    const navigate = useNavigate();

    function moveTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function RecipeRegisterClick(){
        const isLoggedin = localStorage.getItem('token')
        if(isLoggedin){
            navigate('/recipe-register');
        } else{
            navigate('/signin')
        }
    }
    return (
        <div className="buttons-container">
            <button className="plus-button" onClick={RecipeRegisterClick}>
                <Plus width="43px" height="43px" strokeColor="#fff" />
            </button>
            <button type="button" className="top-button" onClick={moveTop}>
                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M112 244l144-144 144 144M256 120v292"/>
                </svg>
            </button>
        </div>
    )

}

export default TopButton;