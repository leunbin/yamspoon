import React, {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';
import './MaterialBar.scss'
import Carousel from "../../components/Carousel/Carousel";
import Ingredients from "../../utils/Ingredients";

const MaterialBar = ({ handleMaterialSelect, handleAllClick }) => {
    const [ selectedSub, setSelectedSub ] = useState(null);
    const [ categoryData, setCategoryData ] = useState(null)
    const [ categoryIdData, setCategoryIdData ] = useState(null)
    const [ filteredSub, setFilteredSub ] = useState(null)

    const carouselRef = useRef(null);

    const fetchCategory = async () => {
        try {
          const response = await Ingredients.getIngredientsCategory()
          const categories = response.data.data.map(item => item.name)
          const categoriesId = response.data.data.map(item => item._id)
          setCategoryData(categories)
          setCategoryIdData(categoriesId)
  
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [])

    const handleSubClick = (idx) => {
        setSelectedSub(selectedSub === idx ? null : idx);
        handleMaterialSelect(filteredSub[idx])
    };

    const handleSubSelect = async (index) => {
        const response = await Ingredients.getIngredients(categoryIdData[index])
        const filteredArr = response.data.data
                            .map(item => [item._id,item.name])
        setFilteredSub(filteredArr)
        setSelectedSub(null)
    }

    const handleAllButtonClick = () => {
        handleAllClick()
        setSelectedSub(null)
        setFilteredSub(null)
        if (carouselRef.current && carouselRef.current.handleSelect) {
            carouselRef.current.handleSelect(-1);
        }
    }
   
    const items = 7;

    return (
        <div className='bar--container'>
            <div className="button--box">
                <button className="all" onClick={handleAllButtonClick}>전체</button>
                <div className='main--bar'>
                    {categoryData && <Carousel 
                                        ref={carouselRef} 
                                        CategoryData={categoryData} 
                                        items={items} 
                                        showDeleteButton={false} 
                                        handleSubSelect={handleSubSelect} />}
                </div>
            </div>
                
            <div className='sub--bar'>
                { filteredSub && filteredSub.map((item, idx) => (
                    <button
                        key={`${idx}-${item}`}
                        className={selectedSub === idx ? 'selected' : ''}
                        onClick={() => handleSubClick(idx)}
                    >
                    {item[1]}
                    </button>
                ))}

            </div>
            
        </div>
    )
}

MaterialBar.propTypes = {
    handleMaterialSelect: PropTypes.func,
    handleAllClick: PropTypes.func,
    material: PropTypes.bool
}

export default MaterialBar