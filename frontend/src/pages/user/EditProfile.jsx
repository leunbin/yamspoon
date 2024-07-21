import React, { useState, useEffect } from 'react';
import LoginHeader from '../../components/Header/LoginHeader';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Icons/Alert';
import './EditProfile.scss';
import User from '../../utils/User';
import { useNavigate } from 'react-router-dom';
import { validateEmptyFields } from '../../utils/validateEmptyFields';

export default function EditProfile () {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [originalNickname, setOriginalNickname] = useState('');

  const [formData, setFormData] = useState({
    name: '', // 이름
    nickname: '', // 닉네임
    userId: '', // 사용자 아이디
    email: '', // 이메일
  });

  const [validation, setValidation] = useState({
    nameError: '',
    nicknameError: '',
    nicknameCheck: false,
  });

  const [basicData, setBasicData] = useState({
    password: '',
    isAdmin: false,
    recipe: [],
    ingredients: [],
  });

  const { name, nickname, userId, email } = formData;
  const { nameError, nicknameError, nicknameCheck } = validation;
  const newUserInfo = {
    ...formData,
    ...basicData,
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    setValidation(prev => ({...prev, [`${name}Error`]: ''}));
  };

  // 수정할 유저 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await User.getUser();
        const { name, nickname, userId, email } = response.data.data;
        const user = response.data.data;
        setFormData({
          name,
          nickname,
          userId,
          email,
        })
    
        setBasicData()
        setOriginalNickname(user.nickname); // 원래 닉네임 저장
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/signin');
      }
      
    }

    fetchUser();
  }, [])

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (nickname === originalNickname) {
      setValidation({...validation, nicknameError: "", nicknameCheck: true})
      return
    }

    try {
      const res = await User.verifyNickname({ nickname });

      if (res.status === 200) {
        setValidation({ ...validation, nicknameError: '', nicknameCheck: true });
      }

    } catch (err) {
      if (err.response.status === 400) {
        setValidation({ ...validation, nicknameError: 'X 이미 사용중인 닉네임입니다.',  nicknameCheck: false });
      }
    }
  }
  

  // 정보 수정 함수
  const handleEdit = async (e) => {
    e.preventDefault();

    // 빈 값 확인
    if (!validateEmptyFields(formData, validation, setValidation)) {
      return;
    }

    // 중복 확인 유무
    if (!nicknameCheck) {
      document.getElementById('nickname').focus();
      setValidation({ ...validation, nicknameError: '※ 닉네임 중복 확인을 해주세요.' });
      return;
    } 

    await User.updateUser(newUserInfo);
    setEditSuccess(true);
  }

  // 마이 페이지로 이동
  const goToMypage = () => {
    setEditSuccess(false);
    navigate('/mypage')
  }

  // 탈퇴 모달 창 열기
  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  const confirmWithdraw = () => {
    // 탈퇴 로직 구현
    User.deleteUser().then(() => {
      setIsModalOpen(false);
      localStorage.removeItem('token');
      window.location.href="/";
    })
  }
  
  return (
    <div>
      <LoginHeader />
      <div className='edit-container'>
        <p className='edit-title'>정보 수정</p>
        <form>
          <div className="form-group">
            <label htmlFor='name'>이름</label>
            <input
              id='name'
              type='text'
              name='name'
              placeholder='이름을 입력해 주세요.'
              value={name}
              onChange={handleInputChange}
              className={`${nameError && 'invalid'}`}
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor='nickname'>닉네임</label>
            <div className="input-with-button">
              <input
                id='nickname'
                type='text'
                name='nickname'
                placeholder='닉네임을 입력해 주세요.'
                value={nickname}
                onChange={handleInputChange}
                className={`${nicknameError && 'invalid'}`}
              />
              <button type='button' className='notFilled short' onClick={handleNicknameCheck} disabled={!nickname}>중복 확인</button>
            </div>
            {nicknameError && <p className="error-message">{nicknameError}</p>}
            {nicknameCheck && <p className="success-message">O 사용할 수 있는 닉네임입니다.</p>}
          </div>
          <div className="form-group">
            <label htmlFor='userId'>아이디</label>
            <input id='userId' type='text' value={userId} disabled />
          </div>
          <div className="form-group">
            <label htmlFor='email'>이메일</label>
            <input id='email' type='email' value={email} disabled />
          </div>
          <div className='button-container'>
            <button type='submit' className='long' onClick={handleEdit}>정보 수정</button>
            <button type='submit' className='long notFilled' onClick={handleWithdraw}>회원 탈퇴</button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          IconComponent={Alert}
          alertBody='정말 탈퇴하시겠습니까?'
          buttonAction={confirmWithdraw}
          actionText='탈퇴'
          hideCloseButton={false}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
      {editSuccess && (
        <Modal
          IconComponent={Alert}
          alertBody='회원님의 정보 수정이 완료되었습니다.'
          buttonAction={goToMypage}
          actionText='마이 페이지'
          hideCloseButton={true}
        />
      )}
    </div>
  )
}