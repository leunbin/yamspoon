import React, { useState } from 'react';
import "./ImageSlide.scss";
import Arrow from "../Icons/Arrow";
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Heart from '../Icons/Heart';


export default function Slider({ slideDatas, hideRecipeRanking }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const TOTAL_SLIDES = slideDatas.length; // 전체 슬라이드 개수

  // Next 버튼 클릭 시
  const NextSlide = () => {
    setCurrentSlide(prevSlide => 
      // 만약 현재 슬라이드가 마지막 슬라이드(TOTAL_SLIDES - 1)이거나,
      // 마지막 슬라이드에서 4개 이전의 슬라이드(TOTAL_SLIDES - 4)인 경우 첫 슬라이드로 설정
      prevSlide === TOTAL_SLIDES - 1 || prevSlide === TOTAL_SLIDES - 4 ? 0 : prevSlide + 1
    );
  };

  // Prev 버튼 클릭 시
  const PrevSlide = () => {
    setCurrentSlide(prevSlide =>
      // 첫 슬라이드인 경우 마지막에서 네 번째 슬라이드로 설정
      prevSlide === 0 ? TOTAL_SLIDES - 4 :
      // 그 외의 경우에는 슬라이드 인덱스를 1 감소
      prevSlide - 1
    );
  };

   // 이제 슬라이드 수가 4개 미만일 때도 버튼을 표시하지 않습니다.
  const shouldShowArrows = TOTAL_SLIDES > 4;

  // slideDatas가 없으면 아무것도 렌더링하지 않음
  if (!slideDatas || slideDatas.length === 0) {
    return null;
  }

  return (
    <div className='imageSlider'>
      <div className='imageSliderWrap'
        style={{
          transition: 'all 0.3s ease-in-out',
          transform: `translateX(-${currentSlide * 25}%)`
        }}
      >
        {/* 각 슬라이드를 매핑하여 표시 */}
        {
          slideDatas.map((slide, index) => (
            <div className='imageSlide' key={index}>
              <Link to={`/recipes/${slide._id}`}>
                <div className="recipe-img">
                    <img src={slide.img} alt="레시피 이미지"/>
                </div>
                {/* 레시피 랭킹 숨김 여부 */}
                {!hideRecipeRanking && <div className='ranking'>{index + 1}</div>}
                <p className='recipeName'>{slide.title}</p>
                <div className='likes'>
                    <span>
                      <Heart fill={"#D3233A"}/>
                      {slide.like.length}
                    </span>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
      {
        shouldShowArrows && (
          <>
            <button className='arrow prevBtn' onClick={PrevSlide}>
              <Arrow stroke={"#d3233a"}/>
            </button>
            <button className='arrow nextBtn' onClick={NextSlide}>
              <Arrow stroke={"#d3233a"}/>
            </button>
          </>
        )
      }
    </div>
  );
}

// props 정의
Slider.propTypes = {
  slideDatas: propTypes.array.isRequired,
  hideRecipeRanking: propTypes.bool
};