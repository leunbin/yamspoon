import React, {useState, createContext, useMemo, forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import ArrowButton from './ArrowButton';
import CategoryTap from './CategoryTap';
import './Carousel.scss'

const SelectdCategoryContext = createContext();

const Carousel = forwardRef(({ CategoryData, items, showDeleteButton, deleteMaterial, handleSubSelect, fridge, handleSelectMat }, ref) => {
    const [startIndex, setStartIndex] = useState(0);
    const itemsToShow = items;
    const endIndex = Math.min(startIndex + itemsToShow-1, CategoryData.length);
    const [selected, setSelected] = useState(Array(CategoryData.length).fill(false));

    const containerStyle = useMemo(() => {
        return deleteMaterial ? { width:'100%' } : {width: '100%'};
    }, [deleteMaterial]);

    useImperativeHandle(ref, () => ({
        handleSelect: (index) => {
            if (index === -1) setSelected(Array(CategoryData.length).fill(false))    
        }
    }))

    // 카테고리 선택
    const handleSelect = (index) => {
        const newSelected = [ ...selected];
        if (fridge) newSelected[index] = !newSelected[index];
        else {
            newSelected.fill(false)
            newSelected[index] = true
        } 
        setSelected(newSelected);
        handleSubSelect? handleSubSelect(index) : null
        handleSelectMat? handleSelectMat(newSelected) : null
    }

    // 이전 카테고리 버튼
    const previousCategory = () => {
        if (startIndex !== 0){
            setStartIndex(startIndex - 1);
        }
    }

    // 다음 카테고리 버튼
    const nextCategory = () => {
        if (endIndex !== CategoryData.length) {
            setStartIndex(startIndex + 1);
        }
    }

    // 재료 삭제 버튼
    const handleDeleteMaterial = (index) => {
        deleteMaterial(startIndex + index); // 부모 컴포넌트에서 전달된 deleteMaterial 함수 호출
        setSelected(selected.filter((_, i) => i !== startIndex + index));
        setStartIndex(0);
    };

    return (
        <div className='category-container' style={containerStyle}>
            <ArrowButton direction="previous" onClick={previousCategory} />
            <SelectdCategoryContext.Provider value={{ selected, handleSelect }}>
                <CategoryTap 
                    CategoryData={CategoryData} 
                    startIndex={startIndex} 
                    endIndex={endIndex} 
                    selected={selected} 
                    handleSelect={handleSelect}
                    deleteMaterial={showDeleteButton ? handleDeleteMaterial : undefined} 
                />
            </SelectdCategoryContext.Provider>
            <ArrowButton direction='next' onClick={nextCategory} />
        </div>
    )
})

Carousel.propTypes = {
    CategoryData: PropTypes.array.isRequired,
    items: PropTypes.number.isRequired,
    showDeleteButton: PropTypes.bool.isRequired,
    deleteMaterial: PropTypes.func,
    handleSubSelect: PropTypes.func,
    fridge: PropTypes.bool,
    handleSelectMat: PropTypes.func
}

Carousel.displayName = 'Carousel';
export default Carousel;