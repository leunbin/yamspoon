import React, { useEffect, useState, useRef } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './HomeSlideArrows.scss'
import './Home.scss'
import TopButton from '../../components/TopButton/TopButton'
import Cutlery from '../../components/Icons/Cutlery'
import { Link } from 'react-router-dom'
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel'
import Recipe from '../../utils/Recipe'

const Home = () => {
  const [ sortLikesData, setSortLikesData ] = useState(null)
  const [ newestData, setNewestData ] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const targetRef = useRef(null)
  
  useEffect(() => {
    fetchRecipes();
    observeScroll();
  }, []);

  const observeScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          console.log("Start fetching recent recipe data")
          fetchNewestRecipes();
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.2 }
    )

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    }
  }

  const fetchRecipes = async () => {
    try {
      const sortedData = await Recipe.getRecipePopular()
      setSortLikesData(sortedData.data.data)

    } catch (error) {
      console.error('Error fetching recipes:', error);
    }

    setIsLoading(false);
    if (isLoading) return null
  }

  const fetchNewestRecipes = async () => {
    try {
      const newestData = await Recipe.getRecipeRecent();
      setNewestData(newestData.data.data);
    } catch (error) {
      console.error('Error fetching newest recipes:', error);
    }
  }

  const loginRequired = () => {
    return localStorage.getItem('token')
  }
  
  return (
    <div>
        <Header />
        <div className='banner-container'>
          <div className='banner'>
            <img src="../../images/banner_image.webp" alt="banner_image" loading='lazy'/>
            <Link to = {loginRequired() ? "/refrigerator" : "/signin"}>
                <button className='banner-button'>
                나만의 냉장고 재료 추가하기
                <Cutlery />
              </button>
            </Link>
          </div>
        </div>
        <div className='recipe-container'>
          <p className='title'>화제의 레시피를 알려드릴게요!</p>
          <div className='popular-recipes-scroll'>
          {sortLikesData && <ImageCarousel slideDatas={sortLikesData} hideRecipeRanking={false} />}
          </div>
        </div>

        <div className='middle-line'></div>
        
        <div className='recipe-container recent-recipe' ref={targetRef} style={{ paddingBottom: "82px"}}>
          <p className='title'>최근에 올라온 레시피는 어떤가요?</p>
          { newestData && <ImageCarousel slideDatas={newestData} hideRecipeRanking={true} />}
        </div>

        <TopButton />
        <Footer />
    </div>
  )
}

export default Home
