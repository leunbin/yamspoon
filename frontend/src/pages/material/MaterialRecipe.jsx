import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import './MaterialRecipe.scss'
import Pagination from '../../components/Pagination/Pagination'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Heart from '../../components/Icons/Heart'
import TopButon from '../../components/TopButton/TopButton'
import MaterialBar from './MaterialBar'
import Recipe from '../../utils/Recipe'
import Loading from "../../components/Loading/Loading";

const MaterialRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ recipeData, setRecipeData ] = useState(null)
  const [ filteredRecipe, setFilteredRecipe ] = useState(null)
  const [ totalItems, setTotalItems ] = useState(null)
  const [ pageData, setPageData ] = useState(null)
  const [ pageIndex, setPageIndex ] = useState(null)
  const [ sort , setSort ] = useState('latest')

  const fetchRecipes = async () => {
    try {
      const response = await Recipe.getRecipe()
      const newestData = response.data.data.toSorted((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      setRecipeData(newestData)
      setFilteredRecipe(newestData)
      setTotalItems(newestData.length)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchRecipes();
  }, [])

  useEffect(() => {
    if (!filteredRecipe) return;
  
    let sortedData = [...filteredRecipe];
    if (sort === 'latest') sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'likes') sortedData.sort((a, b) => b.like.length - a.like.length);
    
    setFilteredRecipe(sortedData);
  }, [sort]);
  
  useEffect(() => {
    if (!filteredRecipe || !pageIndex) return;
  
    const startIndex = pageIndex[0] || 0;
    const endIndex = pageIndex[1] || 16;
    setPageData(filteredRecipe.slice(startIndex, endIndex));
  }, [pageIndex, filteredRecipe]);

  useEffect(() => {
    if (filteredRecipe) {
      setTotalItems(filteredRecipe.length);
    }
  }, [filteredRecipe]);

  const handlePageData = (data) => {
    setPageIndex([data[0], data[1]])
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
  }
  const handleMaterialSelect = async (material) => {
    const response = await Recipe.getIngredientRecipe(material[0])
    const newFiltered = response.data.data.recipes
    if ( sort === 'latest' ) newFiltered.toSorted((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if ( sort === 'likes' ) newFiltered.toSorted((a,b) =>  b.like.length - a.like.length)
    setFilteredRecipe(newFiltered)
    setTotalItems(filteredRecipe.length)
  }

  const handleAllClick = () => {
    const resetData = [...recipeData]
    if (sort === 'likes') resetData.sort((a, b) => b.like.length - a.like.length);
    setFilteredRecipe(resetData)
  }

  return (
    <div>
        <Header />
        <div className='innerBox'>
          <Loading isLoading={isLoading}/>
            <div className='material-container'>
              <div className='title'>재료별로 레시피가 준비되었어요!</div>
              <div className='materialbar-container'>
                  <MaterialBar 
                      handleMaterialSelect={handleMaterialSelect}
                      handleAllClick={handleAllClick}
                  />
              </div>
              <div className='result'>
                  <p>검색 결과 <span>{filteredRecipe? filteredRecipe.length : 0}</span>건 조회</p>
                  <select name="order" onChange={handleSortChange}>
                      <option value="latest">최신순</option>
                      <option value="likes">인기순</option>
                  </select>
              </div>
              <RecipesList pageData={pageData}/>
              {filteredRecipe && filteredRecipe.length === 0 && 
                <div className='no-recipe'>
                  <p>등록된 레시피가 없습니다.</p>
                </div>
              }
          </div>
        </div>
        { filteredRecipe && <Pagination
                            key={filteredRecipe.length + sort} 
                            totalItems={totalItems}
                            itemsPerPage={16} 
                            handlePageData={handlePageData}
                        />}
        <TopButon/>
        <Footer />
    </div>
  )
}


const RecipesList = ({ pageData }) => {
  if (!pageData) return 

    const makeArray = (array, size) => {
      const newArr = [];
      for (let i = 0; i < array.length; i += size) {
          newArr.push(array.slice(i, i + size));
      }
      return newArr;
    };

    
    return (
        <div className='ListWrapper'>
            <div className='RecipeList'>
                { makeArray(pageData, 4).map((chunk, pageIndex) => (
                  <div key={pageIndex} className='Recipe-container'>
                      {chunk.map((item, idx) => (
                          <div className='RecipeItem' key={idx}>
                              <Link to={`/recipes/${item._id}`}>
                                  <div className="item-img">
                                      <img className='ItemImage' src={item.img} alt={`image_${item.title}`} />
                                  </div>
                                  <p>{item.title}</p>
                                  <span>
                                      <Heart fill={"#D3233A"} />
                                      {item.like.length}
                                  </span>
                              </Link>
                          </div>
                      ))}
                  </div>
              ))}
            </div>
        </div>
    )
}

RecipesList.propTypes = {
    recipeData: PropTypes.array,
    pageData: PropTypes.array,
    selectedOption: PropTypes.string,
    filteredRecipe: PropTypes.array
}

MaterialRecipe.propTypes = {
    handleMaterialSelect: PropTypes.func
}

export default MaterialRecipe
