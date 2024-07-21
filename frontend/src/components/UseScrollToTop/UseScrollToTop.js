import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function UseScrollToTop() {
  const location = useLocation(); // 현재 위치를 가져옵니다.

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // location이 변경될 때마다 실행됩니다.

  return null;
}

export default UseScrollToTop;