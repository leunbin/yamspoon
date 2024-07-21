import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHeader from '../../components/Header/LoginHeader';
import User from '../../utils/User';
import { validateEmptyFields } from '../../utils/validateEmptyFields';
import Modal from '../../components/Modal/Modal';
import FindPwIcon from '../../components/Icons/FindPwIcon';
import './ResetPassword.scss';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });

  const [validation, setValidation] = useState({
    passwordError: '',
    passwordConfirmError: '',
    passwordMatch: false
  });

  const { password, passwordConfirm } = formData;
  const { passwordError, passwordConfirmError, passwordMatch } = validation;

  // 비밀번호 입력 처리
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    if (passwordConfirm === '') {
      setValidation({
        ...validation,
        passwordError:
          newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
            ? 'X 비밀번호는 8자 이상이고 특수문자를 포함해야 합니다.'
            : '',
      })
    } else {
      setValidation({
        ...validation,
        passwordError:
          newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
            ? 'X 비밀번호는 8자 이상이고 특수문자를 포함해야 합니다.'
            : '',
        passwordConfirmError: newPassword !== passwordConfirm ? 'X 입력하신 비밀번호와 일치하지 않습니다.' : '',
        passwordMatch: newPassword === passwordConfirm && newPassword !== ''
      })
    }
  };

  // 비밀번호 확인 입력 처리
  const handlePasswordConfirmChange = (e) => {
    const newPasswordConfirm = e.target.value;
    setFormData({ ...formData, passwordConfirm: newPasswordConfirm });
    setValidation({
      ...validation,
      passwordConfirmError: newPasswordConfirm !== password ? 'X 입력하신 비밀번호와 일치하지 않습니다.' : '',
      passwordMatch: newPasswordConfirm === password && newPasswordConfirm !== ''
    })
  };

  // 비밀번호 재설정 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 빈 값 확인
    if (!validateEmptyFields(formData, validation, setValidation)) {
      return;
    }

    // 유효한 값 확인
    if (passwordError) {
      document.getElementById('password').focus();
      return;
    } else if (passwordConfirmError) {
      document.getElementById('passwordConfirm').focus();
      return;
    }

    // 비밀번호 재설정 처리
    await User.resetPassword(userId, { "newPassword": password });
    setIsModalOpen(true);
  }

  return (
    <div>
      <LoginHeader />
      <div className='reset-container'>
        <p className='reset-title'>비밀번호 재설정</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor='password'>새 비밀번호</label>
            <input 
              id='password' 
              type='password' 
              placeholder='비밀번호를 입력해 주세요.'
              value={password}
              onChange={handlePasswordChange}
              className={`${passwordError && 'invalid'}`}
            />
            {passwordError && <p className='error-message'>{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor='passwordConfirm'>새 비밀번호 확인</label>
            <input 
              id='passwordConfirm'
              type='password'
              placeholder='비밀번호를 다시 입력해 주세요.'
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              className={`${passwordConfirmError && 'invalid'}`}
            />
            {passwordConfirmError && <p className='error-message'>{passwordConfirmError}</p>}
            {passwordMatch && <p className='success-message'>O 비밀번호가 일치합니다.</p>}
          </div>
          <button type='submit' className='reset-button long'>비밀번호 재설정</button>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          IconComponent={FindPwIcon}
          alertBody='비밀번호 재설정이 완료되었습니다.'
          buttonAction={() => navigate('/signin')}
          actionText='로그인 화면으로'
          hideCloseButton={true}
        />
      )}
    </div>
  )
}

export default ResetPassword;