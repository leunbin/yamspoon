import './assets/App.scss';
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import UseScrollToTop from './components/UseScrollToTop/UseScrollToTop';
import Loading from './components/Loading/Loading';

const Home = lazy(() => import('./pages/home/Home'));
const MaterialRecipe = lazy(() => import('./pages/material/MaterialRecipe'));
const Refrigerator = lazy(() => import('./pages/material/Refrigerator'));
const Recipe = lazy(() => import('./pages/recipe/Recipe'));
const Search = lazy(() => import('./pages/recipe/Search'));
const TypeRecipe = lazy(() => import('./pages/recipe/TypeRecipe'));
const EditProfile = lazy(() => import('./pages/user/EditProfile'));
const FindId = lazy(() => import('./pages/user/FindId'));
const FindPassword = lazy(() => import('./pages/user/FindPassword'));
const MyPage = lazy(() => import('./pages/user/MyPage'));
const SignIn = lazy(() => import('./pages/user/SignIn'));
const SignUp = lazy(() => import('./pages/user/SignUp'));
const ResetPassword = lazy(() => import('./pages/user/ResetPassword'));
const RecipeRegister = lazy(() => import('./pages/recipe/RecipeRegister'));
const RecipeEdit = lazy(() => import ('./pages/recipe/RecipeEdit')); 

function App() {
  return (
    <>
      <UseScrollToTop />
      <Suspense fallback={<Loading isLoading={true} />}>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/material-recipe" element={<MaterialRecipe />} /> 
          <Route path="/refrigerator" element={<Refrigerator />} /> 
          <Route path="/recipes/:recipeId" element={<Recipe />} /> 
          <Route path="/search" element={<Search />} /> 
          <Route path="/type-recipe" element={<TypeRecipe />} /> 
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/recipe-register" element={<RecipeRegister />} />
          <Route path="/recipe-edit/:recipeId" element={<RecipeEdit />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;