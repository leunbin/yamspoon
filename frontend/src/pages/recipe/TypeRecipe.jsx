import React, { useState, useEffect } from 'react'
import _ from "lodash"
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Pagination from '../../components/Pagination/Pagination'
import TopButton from '../../components/TopButton/TopButton'
import Heart from '../../components/Icons/Heart'
import RecipeCategory from '../../utils/RecipeCategory'
import Recipe from '../../utils/Recipe'
import './TypeRecipe.scss'
import Loading from "../../components/Loading/Loading";

const TypeRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [foodType, setFoodType] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recipes , setRecipes] = useState([]);
  const [ pageData, setPageData ] = useState([]);
  const [ pageIndex, setPageIndex ] = useState(null);
  const [ totalItems, setTotalItems ] = useState(0);

  const [sortingFilter, setSortingFilter] = useState('latest');
  const [sortedRecipes, setSortedRecipes] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        // 카테고리 데이터 가져오기
        const response = await RecipeCategory.getRecipeCategory();
        const categoryNames = response.data.data;
        setFoodType(categoryNames);
  
        // 레시피 데이터 가져오기
        const recipeResponse = await Recipe.getRecipe();
        setRecipes(recipeResponse.data.data);
  
        const recipeDataDeepCopy = _.cloneDeep(recipeResponse.data.data);
        setSortedRecipes(recipeDataDeepCopy);

        setIsLoading(false); 
      } catch (error) {
        throw new Error("데이터 가져오기 실패: ", error);
      }
    };
    
    fetchData();
  }, []);

  // 페이지 인덱스에 따라 보여줄 레시피 설정
  useEffect(() => {
    try {
      if (!sortedRecipes || !pageIndex) return;
      
      // 페이지 인덱스 계산
      const startIndex = pageIndex[0] || 0;
      const endIndex = pageIndex[1] || 16;

      setPageData(recipes.slice(startIndex, endIndex));
    } catch (error) {
      throw new Error("페이지 데이터 설정 실패: ", error);
    }
  }, [pageIndex, sortedRecipes, recipes, selected]);
  
  // 카테고리 선택 핸들러
  const handleSelect = async (index, categoryId) => {
    try {
      setSortingFilter('latest');
      if (selected === index) {
        setSelected(null);
        setRecipes(sortedRecipes);
        setPageData(sortedRecipes);
        setTotalItems(sortedRecipes.length);
      } else {
        setSelected(index);
        
        const response = await Recipe.getCatgory(categoryId);
        const categoryRecipes = response.data.data.recipes;
  
        // 카테고리 레시피를 불러올 때 정렬 기준을 유지하도록 설정
        const sortedCategoryRecipes = [...categoryRecipes];
        if (sortingFilter === 'latest') {
          sortedCategoryRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortingFilter === 'famous') {
          sortedCategoryRecipes.sort((a, b) => (b.like ? b.like.length : 0) - (a.like ? a.like.length : 0));
        }
  
        setSortedRecipes(sortedCategoryRecipes);
        setPageData(sortedCategoryRecipes);
        setTotalItems(sortedCategoryRecipes.length);
      }
    } catch (error) {
      throw new Error("카테고리 선택 실패: ", error);
    }
  };

  // 전체 버튼 클릭 핸들러
  const handleAllButton = async() => {
    setSortingFilter('latest');

    const response = await Recipe.getRecipe();
    const recipesData = response.data.data;
    setRecipes(recipesData);
    setTotalItems(recipesData.length);
    setSelected(null);
  }
  // 정렬된 레시피 배열이 변경될때마다 전체 아이템 수 설정
  useEffect(() => {
    if (recipes) {
        setTotalItems(recipes.length);
    }
  }, []);

  // 정렬 기준에 따라 정렬된 레시피 재설정
  useEffect(() => {
    if (!sortedRecipes) return;
    
    const sorted = [...sortedRecipes]; // 복제본을 만들어 정렬합니다.
    if (sortingFilter === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortingFilter === 'famous') {
      sorted.sort((a, b) => (b.like ? b.like.length : 0) - (a.like ? a.like.length : 0));
    }

    setRecipes(sorted);
  }, [sortingFilter, sortedRecipes]);
  

  // 페이지 바뀔때마다 보여줄 레시피 핸들러
  const handlePageData = (data) => {
    setPageIndex([data[0], data[1]])
  }
  
  // 정렬 기준 변경 이벤트 핸들러
  const handleSortingChange = (e) => {
    setSortingFilter(e.target.value);
  }


  // 배열을 원하는 크기로 나누는 함수
  const makeArray = (arr, size) => {
    const result = [];
    for(let i = 0; i < arr.length; i += size){
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  return (
    <div>
      <Header />
      <div className='innerBox'>
        <Loading isLoading={isLoading}/>
        <div className='type-recipe-container'>
          <div className='type-recipe-result'>
            <p className='type-recipe-text'>종류별로 레시피가 준비되었어요!</p>
          </div>
          <div className='food-type'>
            <div className='line'/>
            <div className='food-type-filter'>
              <button className='all' onClick={() => handleAllButton()}>전체</button>
              <div className='food-type-button-container'>
                {foodType.map((category, index) => (
                  <button
                    key={index}
                    className={`food-type-button ${selected === index ? 'click-food-type-button' : ''}`}
                    onClick={() => handleSelect(index, category._id)}
                  >
                    {category.name}
                  </button>
                  ))}
              </div>
            </div>
            <div className='line'/>
          </div>
          <div className='search-result-container'>
            <div className='result-container'>
              <p className='result-count'>검색 결과 <span className="count">{recipes.length}</span>건 조회</p>
              <select name="filter" value={sortingFilter} onChange={handleSortingChange}>
                <option value="latest">최신순</option>
                <option value="famous">인기순</option>
              </select>
            </div>
            <div className='all-image-container'>
              {recipes.length === 0 ? (
                  <div className='no-recipes'>
                    <p>등록된 레시피가 없습니다.</p>
                  </div>
                ) : (
                  makeArray(pageData, 4).map((row, rowIndex) => (
                    <div key={rowIndex} className='images-container'>
                      {row.map((recipe, columnIndex) => (
                        <Link key={rowIndex * 4 + columnIndex} to={`/recipes/${recipe._id}`} className='image-container'>
                          <div className='imgBox'>
                            <img className='recipe-image' src={recipe.img} alt={recipe.title} />
                          </div>
                          <p className='recipe-name'>{recipe.title}</p>
                          <div className='like-container'>
                            <Heart fill={"#D3233A"} />
                            <p className='like-count'>{recipe.like ? recipe.like.length : 0}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))
              )}
            </div>
          </div>
          { sortedRecipes && <Pagination
                              key={sortedRecipes.length + sortingFilter} 
                              totalItems={totalItems} 
                              itemsPerPage={16} 
                              handlePageData={handlePageData}
                          />}
          <TopButton />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default TypeRecipe;