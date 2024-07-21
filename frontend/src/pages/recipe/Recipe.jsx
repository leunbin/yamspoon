import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Recipe.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopButton from '../../components/TopButton/TopButton';
import Recipe from '../../utils/Recipe';
import User from "../../utils/User";
import Heart from "../../components/Icons/Heart";
import Check from "../../components/Icons/Check";
import Alert from "../../components/Icons/Alert";
import Modal from "../../components/Modal/Modal";
import Save from "../../components/Icons/Save";

export default function RecipeDetails () {
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [saveRecipe, setSaveRecipe] = useState(false); // 저장한 레시피
  const [user, setUser] = useState(null);  // 사용자 정보 상태 추가
  const [isCreator, setIsCreator] = useState(false); // 레시피 작성자 여부
  const [recipeItem, setRecipeItem] = useState({
    creatorNickName: "",
    title: "",
    description: "",
    content: [],
    ingredients: [],
    sauce: [],
    like: [],
    recipe_Category: "",
    img: "",
  }); // 레시피 정보

  const navigate = useNavigate();

  // 레시피 아이디
  const { recipeId } = useParams()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await Recipe.getDetailRecipe(recipeId);
        const { creatorNickName, title, description, content, ingredients, sauce, like, recipe_Category, img } = response.data.data;
        setRecipeItem({ creatorNickName, title, description, content, ingredients, sauce, like, recipe_Category, img });


        const createResponse = await User.getCreateRecipe();
        const userCreator = createResponse.data.data.userOid;
        const creatorId = response.data.data.creatorId;

        // 레시피 작성자 id와 로그인 유저 id가 일치하면 isCreator를 true로 설정
        if (userCreator === creatorId) {
          setIsCreator(true);
        }

      } catch (error) {
        console.error('Error loading recipe data:', error);
      }
      setIsLoading(false);
      if (isLoading) return null
    };
  
    fetchRecipe(); // 레시피 정보 로드
    
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await User.getUser();
        const userData = response.data.data;
        console.log(userData)

        if (userData) {
          setIsMember(true);
          setUser(userData);
          setSaveRecipe(userData.recipe?.includes(recipeId));
        } else {
          setIsMember(false);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsMember(false);
      }
    };
  
    fetchUserData(); // 사용자 데이터 로드
  }, [recipeId]);
  
  useEffect(() => {
    // 좋아요 상태 설정
    if (user && recipeItem.like) {
      setLiked(recipeItem.like.includes(user.userId));
    }
  }, [user, recipeItem.like, recipeId]); // user 또는 recipeItem.like가 변경될 때 실행

  // 저장하기 핸들러
  const saveHandle = async () => {
    setIsSaveModalOpen(true);

    if (isMember) {
      try {
        let newRecipeList;
    
        if (saveRecipe) {
          // 저장된 레시피에서 현재 레시피 ID 제거
          newRecipeList = user.recipe.filter(recipe => recipe.toString() !== recipeId.toString());
        } else {
          // 저장되지 않은 레시피에 현재 레시피 ID 추가
          newRecipeList = [...user.recipe, recipeId];
        }

        // 서버에 업데이트 요청
        await User.updateUserBookmark( { recipe: newRecipeList });
        setUser((prev) => ({ ...prev, recipe: newRecipeList }));
        setSaveRecipe(!saveRecipe);
    
      } catch (error) {
        console.error("저장하기 중 오류 발생 : ", error);
      }
    }
    
  }

  // 좋아요 핸들러
  const toggleLike = async () => {
    setIsLikeModalOpen(true); 

    if (isMember) {
      const alreadyLiked = liked; // 현재 좋아요 상태를 임시 변수에 저장
      const newLikedStatus = !liked; // 좋아요 상태 토글
      setLiked(newLikedStatus); // UI를 옵티미스틱 업데이트

      const updatedLikeList = newLikedStatus 
        ? [...recipeItem.like, user.userId]
        : recipeItem.like.filter(like => like !== user.userId);

      try {
        await Recipe.putLikeRecipe(recipeId, updatedLikeList);
        setRecipeItem(prev => ({ ...prev, like: updatedLikeList }));
      } catch (error) {
        console.error("좋아요 변경 중 오류 발생: ", error);
        setLiked(alreadyLiked); // 좋아요 상태를 이전 상태로 되돌림
      } 
    }
  }

  // 레시피 삭제
  const deleteRecipe = async () => {
    try {
      await Recipe.deleteRecipe(recipeId);
      navigate('/mypage');
    } catch (error) {
      console.error('레시피 삭제 중 오류 발생:', error);
    }
  }

  return (
      <>
        <Header />
        <div className='recipeInner'>
          <div className='recipeTop'>
            <div className='recipeImgBox'>
              <p className='recipeImg'>
                <img src={recipeItem.img} alt='recipeImg' />
              </p>
              <div className='saveAndLikes'>
                <button type='button' className='saveBtn' onClick={saveHandle}>
                  {saveRecipe ? <Save fill={"#aaaaaa"}/> : <Save fill='none' />}
                  <span>저장하기</span>
                </button>
                <button type='button' className='likesBtn' onClick={toggleLike}>
                  {!liked ? <Heart fill='none' /> : <Heart fill='#D3233A' />}
                  <span>{recipeItem.like.length}</span>
                </button>
              </div>
            </div>
            <div className='recipeInfo'>
              <div className='categoryBox'>
                <p className='category'>{recipeItem.recipe_Category.name}</p>
                <p className='creator'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                  </svg>
                  By {recipeItem.creatorNickName}
                </p>
              </div>
              <h3 className='recipeName'>{recipeItem.title}</h3>
              {recipeItem.description.split("\n").map((line, index) => (
                  <p className='recipeText' key={index}>{line}</p>
                ))}
            </div>
          </div> 
          <div className='recipeDetailBox'>
            <div className='marterialAndSauce'>
              <div className='materialBox Boxs'>
                <h4 className='title'>재료 준비</h4>
                <ul className='materialList material'>
                  {recipeItem.ingredients.map((ingredient, index) => {
                      return (
                        <li className='material' key={index}>
                          <span className='materialName'><Check /> {ingredient.name}</span>
                          <span className='materialQuantity'>{ingredient.amount}</span>
                        </li>
                      )})}
                </ul>
              </div>
              <div className='sauceBox Boxs'>
                <h4 className='title'>소스 준비</h4>
                <ul className='materialList sauce'>
                  {recipeItem.sauce.map((sauce, index) => {
                      return (
                        <li className='material' key={index}>
                          <span className='materialName'><Check /> {sauce.name}</span>
                          <span className='materialQuantity'>{sauce.amount}</span>
                        </li>
                      )})}
                </ul>
              </div>
            </div>
            <div className='recipeTextBox'>
              <h4 className='title'>레시피</h4>
              {recipeItem.content.map((content, index) => {return (
                <p key={index}>
                  <span className='num'>{index + 1}</span>
                  <span>{content}<br/></span>
                </p>)
              })}
            </div>
          </div>
          {
            isCreator && (
              <div className='recipeButtons'>
                <button type='button' className='edit notFilled' onClick={() => navigate(`/recipe-edit/${recipeId}`)}>수정</button>
                <button type='button' className='delete' onClick={() => setIsDeleteModalOpen(true)}>삭제</button>
              </div>
            )
          }
        </div>
        {isSaveModalOpen && 
          (<Modal 
            IconComponent={isMember ? (() => <Save fill="none"/>) : (() => <Alert/>)}
            alertBody={isMember ? (saveRecipe ? "레시피가 저장되었습니다.\n마이 페이지에서 저장된 레시피를 확인해 주세요!" : "레시피 저장이 취소되었습니다.") : "로그인 후 이용해 주세요."}
            buttonAction={isMember ? () => setIsSaveModalOpen(false) : () => navigate('/signin')} 
            actionText='확인'
            hideCloseButton={true}
          />)}
        {isLikeModalOpen && 
          (<Modal 
            IconComponent={isMember ? (() => <Heart fill="none"/>) : (() => <Alert/>)}
            alertBody={isMember ? (liked ? "레시피를 좋아해 주셔서 감사합니다." : "레시피 좋아요가 취소되었습니다.") : "로그인 후 이용해 주세요."}
            buttonAction={isMember ? () => setIsLikeModalOpen(false) : () => navigate('/signin')} 
            actionText='확인'
            hideCloseButton={true}
          />)}
          {
            isDeleteModalOpen && 
            (<Modal 
              IconComponent={() => <Alert/>}
              alertBody={"정말 삭제하시겠습니까?"}
              buttonAction={deleteRecipe} 
              actionText='확인'
              closeModal={() => setIsDeleteModalOpen(false)}
            />)
          }
        <TopButton />
        <Footer />
    </>
  )
}