import React, { useState } from 'react';
import LoginHeader from '../../components/Header/LoginHeader';
import { Link, useNavigate } from 'react-router-dom';
import User from '../../utils/User';
import { validateEmptyFields } from '../../utils/validateEmptyFields';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Icons/Alert';
import './SignIn.scss';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [validation, setValidation] = useState({
    userIdError: '',
    passwordError: '',
  });

  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const { userId, password } = formData;
  const { userIdError, passwordError } = validation;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidation({ ...validation, [`${name}Error`]: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 빈 값 확인
    if (!validateEmptyFields(formData, validation, setValidation)) {
      return;
    }

    try {
      const res = await User.loginUser({ userId, password });

      if (res.status === 201) {
        localStorage.clear();
        localStorage.setItem('token', res.data.data);

        navigate('/');
      }

    } catch (err) {
      if (err.response.status === 404 || err.response.status === 401) {
        setErrorModalOpen(true);
      }
    }
  }

  return (
    <div>
      <LoginHeader />
      <div className='signin-container'>
        <p className='signin-title'>로그인</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor='userId'>아이디</label>
            <input
              id='userId'
              name='userId'
              type='text'
              placeholder='아이디를 입력해 주세요.'
              value={userId}
              onChange={handleInputChange}
            />
            {userIdError && <p className="error-message">{userIdError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor='password'>비밀번호</label>
            <input 
              id='password' 
              name='password'
              type='password' 
              placeholder='비밀번호를 입력해 주세요.'
              value={password}
              onChange={handleInputChange}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button type='submit' className='signin-button long'>로그인</button>
        </form>
        <div className='link-container'>
          <div className='find-container'>
            <Link to='/find-id'>아이디 찾기</Link>
            <span className='separator'>|</span>
            <Link to='/find-password'>비밀번호 찾기</Link>
          </div>
          <Link to='/signup'>회원가입</Link>
        </div>
      </div>
      {errorModalOpen && (
        <Modal 
          IconComponent={Alert}
          alertBody='아이디 또는 비밀번호가 일치하지 않습니다.'
          buttonAction={() => setErrorModalOpen(false)}
          actionText='확인'
          hideCloseButton={true}
        />
      )}
    </div>
  )
}

export default SignIn;