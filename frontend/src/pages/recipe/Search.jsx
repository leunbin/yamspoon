import React, { useState, useEffect } from 'react'
import _ from "lodash"
import { Link, useLocation } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Pagination from '../../components/Pagination/Pagination'
import TopButton from '../../components/TopButton/TopButton'
import Heart from '../../components/Icons/Heart'
import Recipe from '../../utils/Recipe'
import './Search.scss'
import Loading from "../../components/Loading/Loading";

const Search = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [recipes , setRecipes] = useState([]);
    const [searchResult, setSearchResult] = useState('');
    const [ pageData, setPageData ] = useState([]);
    const [ pageIndex, setPageIndex ] = useState(null);
    const [ totalItems, setTotalItems ] = useState(0);
  
    const [sortingFilter, setSortingFilter] = useState('latest');
    const [sortedRecipes, setSortedRecipes] = useState([]);    

    useEffect(() => {
        const fetchData = async () => {
            // 레시피 데이터 가져오기
            const recipeResponse = await Recipe.getRecipe();
            setRecipes(recipeResponse.data.data);
            const recipeDataDeepCopy = _.cloneDeep(recipeResponse.data.data);
            setSortedRecipes(recipeDataDeepCopy);
        }

        fetchData();
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const SearchRecipes = params.get('recipes');

        // 검색 결과 있는지 파악
        if (SearchRecipes === null || SearchRecipes.trim() === '') {
            setSearchResult('');
            setSortedRecipes([]);

            return;
        }else if(!SearchRecipes){
            setSortedRecipes([]);

            return;
        }else{
            setIsLoading(true);
            // 검색어 포함하는 레시피 조회
            setSearchResult(SearchRecipes);
            const filteredRecipes = recipes.filter(recipe => recipe.title.includes(SearchRecipes));
    
            // 정렬된 레시피 배열
            const sorted = filteredRecipes.sort((a, b) => {
                if (sortingFilter === 'latest'){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }else if (sortingFilter === 'famous') {
                    return b.like.length - a.like.length;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            setSortedRecipes(sorted);
            setIsLoading(false);
        }
    }, [location.search, recipes, sortingFilter]);
    
    // 페이지 인덱스에 따라 보여줄 레시피 설정
    useEffect(() => {
        if (!sortedRecipes || !pageIndex) return;
        
        // 페이지 인덱스 계산
        const startIndex = pageIndex[0] || 0;
        const endIndex = pageIndex[1] || 16;

        setPageData(sortedRecipes.slice(startIndex, endIndex));
    }, [pageIndex, sortedRecipes]);
    
    // 정렬된 레시피 배열이 변경될때마다 전체 아이템 수 설정
    useEffect(() => {
        if (sortedRecipes) {
            setTotalItems(sortedRecipes.length);
        }
    }, [sortedRecipes]);

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
      <Header ></Header>
      <div className='innerBox'>
        <Loading isLoading={isLoading}/>
        <div className='search-container'>
          <div className='search-result'>
              <p className='data'><span className='search'>&quot;{searchResult}&quot;</span> 검색 결과</p>
          </div>
          <div className='line-container'>
              <div className='line' />
          </div>
          <div className='search-result-container'>
              <div className='result-container'>
                  <p className='result-count'>검색 결과 <span className="count">{sortedRecipes.length}</span>건 조회</p>
                  <select name="filter" value={sortingFilter} onChange={handleSortingChange}>
                      <option value="latest">최신순</option>
                      <option value="famous">인기순</option>
                  </select>
              </div>
              <div className='all-image-container'>
                  {sortedRecipes.length > 0 ? (
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
                  ) : (
                      <div className='no-results'>
                          <p>검색 결과가 없습니다.</p>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>
      { sortedRecipes && <Pagination
                      key={sortedRecipes.length + sortingFilter} 
                      totalItems={totalItems} 
                      itemsPerPage={16} 
                      handlePageData={handlePageData}
                  />}
      <TopButton></TopButton>
      <Footer></Footer>
    </div>
    )
}

export default Search