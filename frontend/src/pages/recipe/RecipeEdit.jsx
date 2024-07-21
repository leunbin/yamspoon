import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopButton from '../../components/TopButton/TopButton';
import Plus from '../../components/Icons/Plus';
import Trashcan from '../../components/Icons/Trashcan';
import ImageUpload from '../../components/Icons/ImageUpload';
import Recipe from '../../utils/Recipe';
import RecipeCategory from '../../utils/RecipeCategory';
import AddModal from '../material/AddModal';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Icons/Alert';
import './RecipeEdit.scss';
import { useParams } from 'react-router-dom';

const RecipeEdit = () => {
    const navigate = useNavigate();

    const [ categories, setCategories ] = useState([]);
    const [ uploadedImage, setUploadedImage ] = useState(null);
    const [ addModalOpen, setAddModalOpen ] = useState(false);
    const [ recipesData, setRecipesData ] = useState([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ emptyFields, setEmptyFields ] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: [],
        ingredients: [],
        sauce: [],
        recipe_Category: "",
        img: "",
    })

    // 레시피 아이디
    const { recipeId } = useParams();

    // 수정할 레시피 가져오기
    useEffect(() => {
        const fetchRecipe = async () => {
            try{
                // 레시피 정보
                const response = await Recipe.getDetailRecipe(recipeId);
                const { title, description, content, ingredients, sauce, recipe_Category, img} = response.data.data;
                setFormData({ title, description, content, ingredients, sauce, recipe_Category, img });
                setUploadedImage(img);
                
                // 카테고리 데이터 가져오기
                const categoryResponse = await RecipeCategory.getRecipeCategory();
                const categoryNames = categoryResponse.data.data;
                setCategories(categoryNames);
            }catch(error){
                throw new Error("데이터를 가져오기 실패.", error);
            }
        }
        
        fetchRecipe();

    }, [recipeId])

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
        const newTitle = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            title: newTitle
        }));
    };    

    // 레시피 설명 입력
    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            description: newDescription
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
            return !formData.ingredients.some(existingIngredient => existingIngredient.name === newIngredient[1]);
        });

        // 새로운 재료 배열 생성
        const updatedIngredientArray = updatedIngredients.map(([ingredientId, name]) => ({
            ingredientId,
            name,
            amount: ''
        }));

        // formData 업데이트
        setFormData(prevData => ({
            ...prevData,
            ingredients: [...prevData.ingredients, ...updatedIngredientArray]
        }));
    };

    // 재료 수량 변경
    const handleIngredientAmountChange = (ingredientName, e) => {
        const { value } = e.target;

        // ingredientsData 업데이트
        setFormData(prevData => {
            const updatedIngredients = prevData.ingredients.map(ingredient => {
                if (ingredient.name === ingredientName) {
                    return {
                        ...ingredient,
                        amount: value
                    };
                }
                return ingredient;
            });

            return {
                ...prevData,
                ingredients: updatedIngredients
            };
        });
    };

    // 재료 삭제
    const handleRemoveIngredient = (index) => {
        // ingredient 배열에서 삭제
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients.splice(index, 1);
        
        // formData 업데이트
        setFormData(prevData => ({
            ...prevData,
            ingredients: updatedIngredients
        }));
    };

    // 소스 탭 추가 버튼
    const sauceAddButton = () => {
        setFormData(prevData => ({
            ...prevData,
            sauce: [...prevData.sauce, {name: "", amount: ""}]
        }));
    };

    // 소스 입력
    const handleSauceChange = (index, e) => {
        const { name, value } = e.target;
            // formData sauce 배열 복사본을 만들어 업데이트
            const updatedSauces = formData.sauce.map((sauce, idx) => {
                if (idx === index) {
                    // 입력된 name에 따라 key 이름 변경
                    return { ...sauce, [name]: value };
                } else {
                    return sauce;
                }
            });
        
            // updatedSauce 배열을 formData 적용
            const updatedFormData = {
                ...formData,
                sauce: updatedSauces
            };
        
            // formData 업데이트
            setFormData(updatedFormData);
    };

    // 소스 삭제 버튼
    const handleRemoveSauce = (index) => {
        setFormData(prevData => {
            const updatedSauce = [...prevData.sauce];
            updatedSauce.splice(index, 1);

            return {
                ...prevData,
                sauce: updatedSauce
            };
        });
    };


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

        const updatedContent = [...formData.content];
        updatedContent.splice(index, 1);
        
        // formData 업데이트
        setFormData(prevData => ({
            ...prevData,
            content: updatedContent
        }));
    }

    const handleRecipeEdit = async () => {
        // 필수 필드가 비어 있는지 확인
        if (!formData.title || !formData.description || !formData.recipe_Category || !formData.img || formData.content.length === 0 || formData.ingredients.length === 0 || formData.sauce.length === 0) {
            const currentEmptyFields = [];
            if (!formData.title) currentEmptyFields.push('레시피 제목');
            if (!formData.description) currentEmptyFields.push('레시피 설명');
            if (!formData.recipe_Category) currentEmptyFields.push('레시피 카테고리');
            if (!formData.img) currentEmptyFields.push('레시피 이미지');
            if (formData.content.length === 0) currentEmptyFields.push('레시피 내용');
            if (formData.ingredients.length === 0) currentEmptyFields.push('재료');
            if (formData.sauce.length === 0) currentEmptyFields.push('소스');

            if (currentEmptyFields.length > 0) {
                setIsModalOpen(true);
                setEmptyFields(currentEmptyFields);
                return;
            }        
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
    
            // content 배열
            formData.content.forEach((step, index) => {
                formDataToSend.append(`content[${index}]`, step);
            });

            // ingredients 배열
            formData.ingredients.forEach((ingredient, index) => {
                formDataToSend.append(`ingredients[${index}][ingredientId]`, ingredient.ingredientId);
                formDataToSend.append(`ingredients[${index}][name]`, ingredient.name);
                formDataToSend.append(`ingredients[${index}][amount]`, ingredient.amount);
            });

            // sauce 배열
            formData.sauce.forEach((sauceItem, index) => {
                formDataToSend.append(`sauce[${index}][name]`, sauceItem.name);
                formDataToSend.append(`sauce[${index}][amount]`, sauceItem.amount);
            });

            // 카테고리
            formDataToSend.append('recipe_Category[categoryId]', formData.recipe_Category.categoryId); // 카테고리 ID
            formDataToSend.append('recipe_Category[name]', formData.recipe_Category.name); // 카테고리 이름
            
            formDataToSend.append('img', formData.img);

            const res = await Recipe.updateRecipe(recipeId, formDataToSend);

            // 레시피 수정이 완료되면, 레시피 상세 페이지로 이동.
            const id = res.data.data._id;
            navigate(`/recipes/${id}`);

        } catch (error) {
            throw new Error('레시피 수정 실패', error);
        }
    }

    console.log(formData);
    return (
        <div>
            <Header />
            <div className='recipe-edit-container'>
                <div className='recipe-edit-page-title'>
                    <p>레시피 수정</p>
                </div>
                <div className='edit-form-container'>
                    <div className='image-edit'>
                        <div className='image-upload'>
                        { uploadedImage ? <img className="image-uploaded" src={uploadedImage} alt="imageupload" /> : <ImageUpload />}
                            <input type="file" accept='image/jpg, image/jpeg, image/png' onChange={handleImageUpload} style={{ display: 'none' }} />
                        </div>
                        <button className='image-upload-button' onClick={handleImageUploaButtonClick}>사진 업로드</button>
                    </div>
                    <div className='left-edit-container'>
                        <div className='recipe-category-container'>
                            <p>카테고리</p>
                            <select className='recipe-filter' onChange={handleCategoryChange} value={formData.recipe_Category.categoryId}>
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
                                onChange={handleTitleChange}
                                placeholder='레시피 제목을 입력해주세요.'
                                value={formData.title} />
                        </div>
                        <div className='recipe-introduction-container'>
                            <p>레시피 설명</p>
                            <textarea
                                className='recipe-introduction'
                                id='recip-introduction'
                                type='text'
                                placeholder='레시피에 대해 소개해주세요.'
                                onChange={handleDescriptionChange}
                                value={formData.description} />
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
                        {formData.ingredients.map((ingredient, index) => (
                                <div className='ingredient' key={index}>
                                    <p>{ingredient.name}</p>
                                    <input
                                        className='ingredient-count'
                                        type='text'
                                        placeholder='수량 (ex. 4개)'
                                        onChange={(e) => handleIngredientAmountChange(ingredient.name, e)}
                                        value={ingredient.amount} />
                                    <div className='trashcan-icon' onClick={() => handleRemoveIngredient(index)}>
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
                        {formData.sauce.map((sauce, index) => (
                            <div className='recipe-sauce' key={index}>
                                <input
                                    className='sauce-name'
                                    type='text'
                                    placeholder='소스명'
                                    name='name'
                                    onChange={(e) => handleSauceChange(index, e)}
                                    value={sauce.name} />
                                <input
                                    className='sauce-amount'
                                    type='text'
                                    name='amount'
                                    placeholder='소스양 (ex. 3스푼)'
                                    onChange={(e) => handleSauceChange(index, e)}
                                    value={sauce.amount} />
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
                        <p>레시피</p>
                        <div className='plus-icon' onClick={recipeAddButton}>
                            <Plus width="29px" height="29px" strokeColor="#D3233A" />
                        </div>
                    </div>
                    {formData.content.map((recipe, index) => (
                        <div className='recipe-input' key={index}>
                            <p>{index + 1}</p>
                            <input
                                className='recipe-procedure'
                                type='text'
                                placeholder='레시피를 입력해주세요.'
                                value={recipe}
                                onChange={(e) => handleRecipeChange(index, e)} />
                            <div className='trashcan-icon' onClick={() => handleRemoveRecipe(index)}>
                                <Trashcan />
                            </div>
                        </div>
                    ))}
                </div>
                <button className='recipe-edit-button' onClick={handleRecipeEdit}>수정하기</button>
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

export default RecipeEdit;