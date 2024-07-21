import React, { useState } from "react";
import PropTypes from "prop-types";
import './AddModal.scss'
import MaterialBar from "./MaterialBar";
import ReactDOM from 'react-dom';
import Delete from "../../components/Icons/Delete";

const AddModal = ({closeModal, handleAddAction}) => {
  const [ materials, setMaterials ] = useState([])

  const handleMaterialSelect = (material) => {
    if (materials.includes(material)) return
    setMaterials([...materials, material])
  }
    
    return ReactDOM.createPortal(
        <div className='modal'>
        <div className='modal__overlay'></div>
        <div className="modal_content">
          <div className="modal__content__title">
            <p>재료 추가하기</p>
          </div>
          <div className="modal__content__body">
              <MaterialBar handleMaterialSelect={handleMaterialSelect}/>
              <ListBeforeAdd materials={materials} setMaterials={setMaterials}/>
          </div>
          <div className="modal__content__button">
              <button type="button" className="action" onClick={closeModal}>닫기</button>
              <button type="button" 
                className="action" 
                onClick={() => {handleAddAction(materials); closeModal();}}
              >
                추가하기
              </button>
          </div>
        </div>
      </div>, document.body
    )
}

const ListBeforeAdd = ({materials, setMaterials}) => {
  if (!materials) return
  
  const handleDeleteClick = (index) => {
    const newArr = materials.filter((_, idx) => idx !== index);
    setMaterials(newArr)
  };
  
  return (
    <div className='select-container'>
      <div className='select-tap-container'>
        { materials.map((item, idx) => (
          <div key={idx} className='select-item'>
            <button className='select-button'>{item[1]}</button>
            <button className='delete-button' onClick={() => handleDeleteClick(idx)}><Delete /></button>
          </div>
        )) }
      </div>
    </div>
  )
}

AddModal.propTypes = {
  closeModal: PropTypes.func,
}

ListBeforeAdd.propTypes ={
  setMaterials: PropTypes.func,
  materials: PropTypes.array
}

export default AddModal