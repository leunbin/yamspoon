import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../../components/Header/LoginHeader';
import User from '../../utils/User';
import { validateEmptyFields } from '../../utils/validateEmptyFields';
import Modal from '../../components/Modal/Modal';
import FindIdIcon from '../../components/Icons/FindIdIcon';
import Alert from '../../components/Icons/Alert';
import './FindId.scss';

const FindId = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [emailCode, setEmailCode] = useState('');
  const [userId, setUserId] = useState('');

  const [validation, setValidation] = useState({
    nameError: '',
    emailError: '',
    emailSend: false,
    emailCodeError: '',
    emailCodeCheck: false,
  });

  const { name, email } = formData;
  const { nameError, emailError, emailSend, emailCodeError, emailCodeCheck } = validation;

  // 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidation({ ...validation, [`${name}Error`]: '', [`${name}Check`]: '' });
  };

  // 이메일 입력 처리
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setFormData({ ...formData, email: newEmail });
    setValidation({
      ...validation,
      emailError: !emailPattern.test(newEmail) ? 'X 이메일 형식이 올바르지 않습니다.' : ''
    })
  };

  // 이메일로 인증번호 전송(인증 버튼)
  const handleEmailSend = async () => {
    if (!validateEmptyFields(formData, validation, setValidation)) {
      return;
    }

    // 입력한 정보와 일치한 계정이 있는지 확인
    try {
      await User.findUserId(formData);

    } catch (err) {
      if (err.response.status === 404) {
        setErrorModalOpen(true);
        return;
      }
    }
    
    setValidation({ ...validation, emailSend: true, emailError: '' });
    // 이메일 전송
    await User.sendEmailCode({ email });
  };

  // 인증번호 입력 처리
  const handleEmailCodeChange = (e) => {
    const newEmailCode = e.target.value;
    setEmailCode(newEmailCode.slice(0, 6));
    setValidation({ ...validation, emailCodeError: '', emailCodeCheck: false })
  }

  // 이메일 인증번호 확인(확인 버튼)
  const handleEmailCodeConfirm = async () => {
    if (!emailCode) {
      setValidation({ ...validation, emailCodeError: '※ 인증번호를 입력해 주세요.' })
    } else {
      try {
        const res = await User.verifyCode({ "verificationCode": emailCode });
        
        if (res.status === 200) {
          setValidation({ ...validation, emailCodeError: '', emailCodeCheck: true });
        }

      } catch (err) {
        if (err.response.status === 400) {
          setValidation({ ...validation, 
            emailCodeError: 'X 입력하신 인증번호가 틀렸습니다. 다시 확인해주세요.',
            emailCodeCheck: false
          });
        }
      }
    }
  }

  // 아이디 찾기 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 빈 값 확인
    if (!validateEmptyFields(formData, validation, setValidation)) {
      return;
    }

    // 이메일 인증 유무
    if (!emailSend) {
      setValidation({ ...validation, emailError: '※ 이메일 인증을 해주세요.' });
      return;
    } else if (!emailCodeCheck) {
      setValidation({ ...validation, emailCodeError: '※ 이메일 인증을 해주세요.' });
      return;
    }

    // 아이디 찾기 처리
    const res = await User.findUserId(formData);
    setUserId(res.data.data.slice(0, -3) + '***');

    setIsModalOpen(true);
  }

  return (
    <div>
      <LoginHeader />
      <div className='findid-container'>
        <p className='findid-title'>아이디 찾기</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor='name'>이름</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="이름을 입력해 주세요."
              value={name}
              onChange={handleInputChange}
              className={`${nameError && 'invalid'}`}
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor='email'>이메일</label>
            <div className="input-with-button">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={handleEmailChange}
                className={`${emailError && 'invalid'}`}
                disabled={emailSend}
              />
              <button
                type="button"
                className="notFilled short"
                onClick={handleEmailSend}
                disabled={!email || emailSend || emailError === 'X 이메일 형식이 올바르지 않습니다.'}
              >
                인증
              </button>
            </div>
            {emailSend && (
              <div className="input-with-button">
                <input
                  type="number"
                  placeholder="인증번호 6자리를 입력해 주세요."
                  value={emailCode}
                  onChange={handleEmailCodeChange}
                  name="emailCode"
                  disabled={emailCodeCheck}
                />
                <button
                  type="button"
                  className="notFilled short"
                  onClick={handleEmailCodeConfirm}
                  disabled={emailCodeCheck}
                >
                  확인
                </button>
              </div>
            )}
            {emailError && <p className="error-message">{emailError}</p>}
            {emailCodeError && <p className="error-message">{emailCodeError}</p>}
            {emailCodeCheck && <p className="success-message">O 인증번호가 일치합니다.</p>}
          </div>
          <button type='submit' className='findid-button long'>아이디 찾기</button>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          IconComponent={FindIdIcon}
          alertBody={`${name}님의 아이디는 ${userId} 입니다.`}
          buttonAction={() => navigate('/signin')}
          actionText='로그인 화면으로'
          hideCloseButton={true}
        />
      )}
      {errorModalOpen && (
        <Modal 
          IconComponent={Alert}
          alertBody='입력하신 정보와 일치하는 계정이 없습니다. 다시 한 번 확인해 주세요.'
          buttonAction={() => setErrorModalOpen(false)}
          actionText='확인'
          hideCloseButton={true}
        />
      )}
    </div>
  )
}

export default FindId;