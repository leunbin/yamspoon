import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Pagination.scss'
import ArrowBackFilled from '../Icons/ArrowBackFilled';
import ArrowForwardFilled from '../Icons/ArrowForwardFilled';

const Pagination = ({totalItems, itemsPerPage, handlePageData}) => {
  const [ selectedPage, setSelectedPage ] = useState(0);
  const [ pageList, setPageList ] = useState([])
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if(totalPages < 5) {
      const newList = [1]
      for(let i = 2; i <= totalPages; i++) {
        newList.push(i)
      }
      setPageList(newList)
    }
    else setPageList([1,2,3,4,5])
  }, [totalPages])

  useEffect(() => {
    if( !handlePageData ) return
    handlePageData([selectedPage * itemsPerPage, selectedPage * itemsPerPage + itemsPerPage])
    
    const startIndex = Math.floor(selectedPage/5)
    const newList = []
    if(selectedPage === 0) return
    for (let i = 1; i <=5; i++) {
      const num = i + (startIndex * 5)
      if(num === totalPages+1) break
      newList.push(num)
    }
    setPageList(newList)
  }, [selectedPage])

  const handlePageClick = (idx) => {
    setSelectedPage(idx)
  };

  const goToNext = () => {
    if (selectedPage === totalPages - 1) return
    setSelectedPage(prev => prev+1)
  };
  const goToPrev = () => {
    if (selectedPage === 0) return
    setSelectedPage(prev => prev-1)
  };

  return (
    <nav className='pagination-container'>
      <button className='arrow-button' onClick={goToPrev}>
        <ArrowBackFilled />
      </button>
      <ul className='pagination'>
        {
          pageList.map((page, idx) => (
            <li key={idx}>
              <button
                className={selectedPage === page - 1 ? 'selected' : ''}
                onClick={() => handlePageClick(page - 1)}
              >{page}</button>
            </li>
          ))
        }
      </ul>
      <button className='arrow-button' onClick={goToNext}>
        <ArrowForwardFilled />
      </button>
    </nav>
  )
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  recipeData: PropTypes.array,
  handlePageData: PropTypes.func
};

export default Pagination;