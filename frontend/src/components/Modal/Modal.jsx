import "./Modal.scss";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';

function Modal({IconComponent, alertBody, buttonAction, actionText, hideCloseButton, closeModal}){

  return ReactDOM.createPortal(
    <>
      <div className="modal">
        <div className="modal__overlay"></div>
        <div className="modal__content">
          <div className="modal__content__icon">
            <IconComponent/>
          </div>
          <div className="modal__content__body">
              <p>{alertBody}</p>
          </div>
          <div className="modal__content__button">
              {!hideCloseButton && <button type="button" className="close" onClick={closeModal}>닫기</button>}
              <button type="button" className="action" onClick={buttonAction}>{actionText}</button>
          </div>
        </div>
      </div>
    </>, document.body
  )

}

// propTypes로 props의 타입을 지정해줌
// isRequired는 필수 props로 지정해줌
Modal.propTypes = {

  // 아이콘 컴포넌트
  IconComponent: PropTypes.any.isRequired,
  
  // 알림 내용
  alertBody: PropTypes.string.isRequired,
  
  // action 버튼 클릭 시 실행할 함수
  buttonAction: PropTypes.func.isRequired,

  // action 버튼 텍스트
  actionText: PropTypes.string.isRequired,

  // 닫기 버튼 숨김 여부
  hideCloseButton: PropTypes.bool,

  // 모달 닫기 함수
  closeModal: PropTypes.func,
}

export default Modal; 