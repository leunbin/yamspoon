import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Header.scss';
import SearchIcon from '../Icons/SearchIcon';
import MypageIcon from '../Icons/MypageIcon';
import Logo from '../Icons/LogoIcon'

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // 엔터키를 누르면 검색값 전달
  const activeEnter = (e) => {
    if(e.key === "Enter") {
      navigate(`/search?recipes=${searchValue}`);
    }
  }

  // input 값 변화를 확인하는 핸들러
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  }

  
  // 로그인 여부에 따른 마이페이지 이동
  const handleMyPageClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      navigate('/signin');
    }
  };

  // 로그인 여부에 따른 로그인, 로그아웃 버튼
  const handleLoginClick = () => {
    if(isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    } else{
      navigate('/signin');
    }
  }

  // 로그인 여부에 따른 나만의 냉장고 이동
  const handleRefrigeratorClick = () => {
    if(isLoggedIn){
      navigate('/refrigerator')
    }else{
      navigate('/signin');
    }
  }

  return (
    <header>
      <div className='headerInner'>
        <Link to ="/"><Logo /></Link>

        <div className='container'>
          <div className='nav'>
            <Link className='text' to = "/material-recipe">재료별 레시피</Link>
            <Link className='text' to = "/type-recipe">종류별 레시피</Link>
            <div className='text' onClick={handleRefrigeratorClick}>나만의 냉장고</div>
          </div>

          <div className='right-container'>
            <div className='searchContainer'>
              <input 
                className="search-cotainer" 
                id="search" 
                type="text" 
                placeholder="무엇을 찾아드릴까요?"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={(e) => activeEnter(e)}/>
              <Link className="search-icon" to={`/search?recipes=${searchValue}`}><SearchIcon alt ="searchIcon" /></Link>
            </div>
            <div className='mypage-icon' onClick={handleMyPageClick}>
              <MypageIcon alt="myPageIcon"/>
            </div>
            <button className='login' onClick={handleLoginClick}>
              {isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;