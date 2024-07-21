import React, {useEffect, useState} from 'react';
import './Mypage.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopButton from '../../components/TopButton/TopButton';
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import User from '../../utils/User';
import { Link, useNavigate } from 'react-router-dom';
import Loading from "../../components/Loading/Loading";
import PropTypes from 'prop-types';

export default function MyPage() {
	const [user, setUser] = useState([]); // 유저 정보
	const [isLoading, setIsLoading] = useState(false);
	const [saveList, setSaveList] = useState(false); // 저장한 레시피 리스트
  const [recipeData, setRecipeData] = useState([]); // 저장한 레시피 데이터
  const [createList, setCreateList] = useState(false); // 작성한 레시피 리스트
  const [createRecipeData, setCreateRecipeData] = useState([]); // 작성한 레시피 데이터
  const navigate = useNavigate(); // navigate 함수를 사용하기 위해 호출

	// 유저 정보 조회
	useEffect(() => {
    setIsLoading(true);

    const fetchUser = async () => {
      try {
        const response = await User.getUser();
        const user = response.data.data;
        setUser(user);
        fetchSaveRecipe(user.recipe);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // 로그인 페이지로 리다이렉트
        navigate('/signin');
      }

      setIsLoading(false);
    }

    fetchUser();

    // 유저 저장 레시피 매핑
    const fetchSaveRecipe = async () => {
      const response = await User.getUserBookmark()
      const recipes = response.data.data.slice().reverse();
      
      setRecipeData(recipes);
      setSaveList(recipes.length > 0 ? true : false);
      setIsLoading(false);
    }

    // 유저 작성 레시피
    const fetchUserRecipe = async () => {
      try {
        const response = await User.getCreateRecipe();
        const userRecipe = response.data.data.recipe.slice().reverse();

        setCreateRecipeData(userRecipe)
        setCreateList(userRecipe.length > 0 ? true : false)
      } catch (error) {
        console.error('Failed to fetch user recipe:', error);
      }
    }
    fetchUserRecipe()
  }, [])
  
	return (
			<>
        <Header />
        <div className='innerBox'>
          <Loading isLoading={isLoading}/>
          <div className='inner'>
            <div className='titleBox'>
              <h2 className='pageTitle'>마이 페이지</h2>
            </div>
            
            <div className='userBox'>
              <p>
                <span className='name'>{user.name}</span> 님 안녕하세요!
              </p>

              <Link to='/edit-profile'>
                <button type='button' className='edit notFilled'>정보 수정</button>
              </Link>
            </div>
          </div>
          <MyRecipe createRecipeData={createRecipeData} createList={createList}/>
          <SavedRecipe recipeData={recipeData} saveList={saveList}/>
        </div>
        <TopButton />
        <Footer />
    </>
	)
}

// 내가 작성한 레시피
function MyRecipe({createRecipeData, createList}) {

  return (
    <div className='listInner'>
      <div className='saveListBox top'>
          <h2 className='title'>내가 작성한 레시피</h2>
          <div className='saveList'>
            {createList ?
              (<ImageCarousel key="createRecipes" slideDatas={createRecipeData} hideRecipeRanking={true}/>)
              :
              (<div className='empty'>
                <p>작성된 레시피가 없습니다.</p>
              </div>)
            }
          </div>
      </div>
    </div>
  )
}

// 내가 저장한 레시피
function SavedRecipe({recipeData, saveList}) {

  return (
    <div className='listInner'>
      <div className='saveListBox'>
          <h2 className='title'>내가 저장한 레시피</h2>
          <div className='saveList'>
            {saveList ?
              (<ImageCarousel key="savedRecipes" slideDatas={recipeData} hideRecipeRanking={true}/>)
              :
              (<div className='empty'>
                <p>저장된 레시피가 없습니다.</p>
              </div>)
            }
          </div>
      </div>
    </div>
  )
}

// props 정의
MyRecipe.propTypes = {
  createRecipeData: PropTypes.array,
  createList: PropTypes.bool
}

// props 정의
SavedRecipe.propTypes = {
  recipeData: PropTypes.array,
  saveList: PropTypes.bool
}