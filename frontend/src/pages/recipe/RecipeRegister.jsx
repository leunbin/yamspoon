import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopButton from '../../components/TopButton/TopButton';
import Plus from '../../components/Icons/Plus';
import Trashcan from '../../components/Icons/Trashcan';
import ImageUpload from '../../components/Icons/ImageUpload';
import AddModal from '../material/AddModal';
import RecipeCategory from '../../utils/RecipeCategory';
import Recipe from '../../utils/Recipe';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Icons/Alert';
import './RecipeRegister.scss';

const RecipeRegister = () => {
    const navigate = useNavigate();

    const [ categories, setCategories ] = useState([]);
    const [ uploadedImage, setUploadedImage ] = useState(null);
    const [ ingredientsData, setIngredientsData ] = useState([]);
    const [ addModalOpen, setAddModalOpen ] = useState(false);
    const [ sauces, setSauces ] = useState([]);
    const [ recipesData, setRecipesData ] = useState([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ emptyFields, setEmptyFields ] = useState([]);
    

    const [ formData, setFormData ] = useState({
        title: '',
        description: '',
        content: [],
        ingredients: [],
        sauce: [],
        recipe_Category: "",
        img: "",
    })

    const { title, description, content, ingredients, sauce, recipe_Category, img } = formData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 카테고리 데이터 가져오기
                const response = await RecipeCategory.getRecipeCategory();
                const categoryNames = response.data.data;
                setCategories(categoryNames);
            } catch (error) {
                throw new Error("데이터 가져오기 실패: ", error);
            }
        };
        
        fetchData();
    }, [])
    console.log(categories);

    
    // 이미지 업로드
    const handleImageUpload = (e) => {
        const imageFile = e.target.files[0];
        // 이미지 파일 URL 생성
        const imageURL = URL.createObjectURL(imageFile); 

        setUploadedImage(imageURL);   

        setFormData(prevData => ({
            ...prevData,
            img: imageFile
        }))
    }
    
    //  이미지 업로드 버튼 클릭하면 input 버튼 클릭
    const handleImageUploaButtonClick = () => {
        const input = document.querySelector('.image-upload input[type=file]');
        if (input) {
            input.click();
        }
    };

    // 레시피 이름 입력
    const handleTitleChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            title: e.target.value
        }));
    };    

    // 레시피 설명 입력
    const handleDescriptionChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            description: e.target.value
        }))
    }

    // 카테고리 선택
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategory = categories.find(category => category._id === selectedCategoryId);
        const selectedCategoryObject = {
            categoryId: selectedCategory._id,
            name: selectedCategory.name
        };

        setFormData(prevData => ({
            ...prevData,
            recipe_Category: selectedCategoryObject
        }));
    }

    // 재료 추가 모달창 버튼
    const ingredientModalClick = () => {
        setAddModalOpen(!addModalOpen);
    }

    // 재료 추가
    const handleAddIngredient = async (newIngredients) => {
        // 이미 추가된 재료 제외
        const updatedIngredients = newIngredients.filter(newIngredient => {
            return !ingredients.some(existingIngredient => existingIngredient.name === newIngredient[1]);
        });

        // 새로운 재료 배열 생성
        const updatedIngredientArray = updatedIngredients.map(([ingredientId, name]) => ({
            ingredientId,
            name,
            amount: ''
        }));

        // ingredientsData 업데이트
        setIngredientsData(prevData => [...prevData, ...updatedIngredientArray]);
    };
    
    // 재료 수량 변경
    const handleIngredientAmountChange = (ingredientName, e) => {
        const { value } = e.target;

        // ingredientsData 업데이트
        setIngredientsData(prevData => {
            const updatedData = prevData.map(ingredient => {
                if (ingredient.name === ingredientName) {
                    return {
                        ...ingredient,
                        amount: value
                    };
                }
                return ingredient;
            });
            return updatedData;
        });

        // formData 업데이트
        const updatedFormData = {
            ...formData,
            ingredients: ingredientsData
        };

        setFormData(updatedFormData);
    };
  
    // 재료 삭제 버튼
    const handleRemoveIngredient = (index) => {
        // ingredient 배열에서 삭제
        const updatedIngredients = [...ingredientsData];
        updatedIngredients.splice(index, 1);

        setIngredientsData(updatedIngredients);

        // formData 업데이트
        const updatedFormData = {
            ...formData,
            ingredients: updatedIngredients
        };
        setFormData(updatedFormData);
    }

    // 소스 탭 추가 버튼
    const sauceAddButton = () => {
        setSauces([...sauces, {name:"", amount:""}])
    }
    
    // 소스 입력
    const handleSauceChange = (index, e) => {
        const { name, value } = e.target; 

        const updatedSauces = sauces.map((sauce, idx) => {
            if (idx === index) {
                // 입력된 name에 따라 key 이름 변경
                return { ...sauce, [name]: value }; 
            } else {
                return sauce;
            }
        });
        
        setSauces(updatedSauces);

        // formData 업데이트
        const updatedFormData = {
            ...formData,
            sauce: updatedSauces
        };
        setFormData(updatedFormData)

    };
    console.log(formData);


    // 소스 삭제 버튼
    const handleRemoveSauce = (index) => {
        const updatedSauces = [...sauces];
        updatedSauces.splice(index, 1);

        setSauces(updatedSauces);

        // formData 업데이트
        const updatedFormData = {
            ...formData,
            sauce: updatedSauces
        };

        setFormData(updatedFormData);
    }

    // 레시피 입력
    const handleRecipeChange = (index, e) => {
        const { value } = e.target;
        const updatedRecipes = [...formData.content];
        updatedRecipes[index] = value;

        setRecipesData(updatedRecipes);

        setFormData(prevData => ({
            ...prevData,
            content: updatedRecipes
        }));
    };


    // 레시피 탭 추가 버튼
    const recipeAddButton = () => {
        setRecipesData([...recipesData, ''])

        // 레시피 탭 추가 시 formData에 빈 문자열 추가
        setFormData(prevData => ({
            ...prevData,
            content: [...prevData.content, '']
        }));
    }

    // 레시피 삭제 버튼
    const handleRemoveRecipe = (index) => {
        const updatedRecipes = [...recipesData];
        updatedRecipes.splice(index, 1);

        setRecipesData(updatedRecipes);

        // 레시피 삭제 시 해당 내용 formData에서 제거
        const updatedContent = [...formData.content];
        updatedContent.splice(index, 1);

        setFormData(prevData => ({
            ...prevData,
            content: updatedContent
        }));
    }

    const handleRecipeRegister = async () => {
        // 필수 필드가 비어 있는지 확인
        if (!title || !description || !recipe_Category || !img || content.length === 0 || ingredients.length === 0 || sauce.length === 0) {
            const currentEmptyFields = [];
            if (!title) currentEmptyFields.push('레시피 제목');
            if (!description) currentEmptyFields.push('레시피 설명');
            if (!recipe_Category) currentEmptyFields.push('레시피 카테고리');
            if (!img) currentEmptyFields.push('레시피 이미지');
            if (content.length === 0) currentEmptyFields.push('레시피 내용');
            if (ingredients.length === 0) currentEmptyFields.push('재료');
            if (sauce.length === 0) currentEmptyFields.push('소스');

            if (currentEmptyFields.length > 0) {
                setIsModalOpen(true);
                setEmptyFields(currentEmptyFields);
                return;
            }    
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', title);
            formDataToSend.append('description', description);
    
            // content 배열
            content.forEach((step, index) => {
                formDataToSend.append(`content[${index}]`, step);
            });

            // ingredients 배열
            ingredients.forEach((ingredient, index) => {
                formDataToSend.append(`ingredients[${index}][ingredientId]`, ingredient.ingredientId);
                formDataToSend.append(`ingredients[${index}][name]`, ingredient.name);
                formDataToSend.append(`ingredients[${index}][amount]`, ingredient.amount);
            });

            // sauce 배열
            sauce.forEach((sauceItem, index) => {
                formDataToSend.append(`sauce[${index}][name]`, sauceItem.name);
                formDataToSend.append(`sauce[${index}][amount]`, sauceItem.amount);
            });

            // 카테고리
            formDataToSend.append('recipe_Category[categoryId]', recipe_Category.categoryId); // 카테고리 ID
            formDataToSend.append('recipe_Category[name]', recipe_Category.name); // 카테고리 이름
            
            formDataToSend.append('img', img);
            
            const res = await Recipe.postRecipe(formDataToSend);

            // 레시피 등록이 완료되면, 레시피 상세 페이지로 이동.
            const id = res.data.data._id;
            navigate(`/recipes/${id}`);

        } catch (error) {
            throw new Error('레시피 등록 실패', error);
        }
    }

    return (
        <div>
            <Header />
            <div className='recipe-register-container'>
                <div className='recipe-register-page-title'>
                    <p>레시피 등록</p>
                </div>
                <div className='register-form-container'>
                    <div className='image-register'>
                        <div className='image-upload'>
                            { uploadedImage ? <img className="image-uploaded" src={uploadedImage} alt="imageupload" /> : <ImageUpload />}
                            <input type="file" accept='image/jpg, image/jpeg, image/png' onChange={handleImageUpload} style={{ display: 'none' }} />
                        </div>
                        <button className='image-upload-button' onClick={handleImageUploaButtonClick}>사진 업로드</button>
                    </div>
                    <div className='left-register-container'>
                        <div className='recipe-category-container'>
                            <p>카테고리</p>
                            <select className='recipe-filter' onChange={handleCategoryChange} value={formData.recipe_Category.categoryId}>
                                <option value="" defaultValue={"종류"} hidden>종류</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='recipe-title-container'>
                            <p>레시피 제목</p>
                            <input
                                className='recipe-title'
                                id="recipe-title"
                                type='text'
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder='레시피 제목을 입력해주세요.' />
                        </div>
                        <div className='recipe-introduction-container'>
                            <p>레시피 설명</p>
                            <textarea
                                className='recipe-introduction'
                                id='recip-introduction'
                                type='text'
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder='레시피에 대해 소개해주세요.' />
                        </div>
                    </div>
                </div>

                <div className='ingredient-sauce-container'>
                    <div className='ingredient-container'>
                        <div className='ingredients-title'>
                            <p>재료</p>
                            <div className='plus-icon' onClick={ingredientModalClick}>
                                <Plus width="29px" height="29px" strokeColor="#D3233A" fillColor="#fff" />
                            </div>
                        </div>
                        <div className='ingregdients'>                            
                            {ingredientsData.map((ingredient, index) => (
                                <div className="ingredient" key={index}>
                                    <p>{ingredient.name}</p>
                                    <input
                                        type="text"
                                        name={ingredient.name}
                                        value={ingredient.amount} 
                                        onChange={(e) => handleIngredientAmountChange(ingredient.name, e)}
                                        placeholder="수량(ex. 10g)"
                                    />
                                    <div className="trashcan-icon" onClick={() => handleRemoveIngredient(index)}>
                                        <Trashcan />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='sauce-container'>
                        <div className='sauces-title'>
                            <p>소스</p>
                            <div className='plus-icon' onClick = {sauceAddButton}>
                                <Plus width="29px" height="29px" strokeColor="#D3233A" fillColor="#fff" />
                            </div>
                        </div>
                        <div className='recipe-sauces'>
                            {sauces.map((sauce, index) => (
                                <div className='recipe-sauce' key={index}>
                                    <input 
                                        className='sauce-name'
                                        type='text'
                                        name='name'
                                        value={sauce.name}
                                        onChange={(e) => handleSauceChange(index, e)}
                                        placeholder='소스명' />
                                    <input
                                        className='sauce-amount'
                                        type='text'
                                        name='amount'
                                        value={sauce.amount}
                                        onChange={(e) => handleSauceChange(index, e)}
                                        placeholder='소스양 (ex. 3스푼)' />
                                    <div className='trashcan-icon' onClick={() => handleRemoveSauce(index)}>
                                        <Trashcan />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='recipe-input-container'>
                    <div className='recipe-input-title'>
                        <p>레시피 입력</p>
                        <div className='plus-icon' onClick={recipeAddButton}>
                            <Plus width="29px" height="29px" strokeColor="#D3233A" fillColor="#fff" />
                        </div>
                    </div>
                    {recipesData.map((recipe, index) => (
                        <div className='recipe-input' key={index}>
                            <p>{index + 1}</p>
                            <input
                                className='recipe-procedure'
                                type='text'
                                placeholder='레시피를 입력해주세요.'
                                value={recipe}
                                onChange={(e) => handleRecipeChange(index, e)}
                            />
                            <div className='trashcan-icon' onClick={() => handleRemoveRecipe(index)}>
                                <Trashcan />
                            </div>
                        </div>
                    ))}
                </div>
                <button className='recipe-register-button' onClick={handleRecipeRegister}>등록하기</button>
            </div>
            {addModalOpen && (<AddModal closeModal={ingredientModalClick} handleAddAction={handleAddIngredient}/> )}
            {isModalOpen &&
                (
                    <Modal
                        IconComponent={Alert}
                        alertBody={`${emptyFields.join(', ')}을 작성해주세요.`}
                        buttonAction={() => setIsModalOpen(false)}
                        actionText="확인"
                        hideCloseButton={true}
                        closeModal={() => setIsModalOpen(false)}
                    />
                )}
            <TopButton />
            <Footer />
        </div>
    )
}

export default RecipeRegister;