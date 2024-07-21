export function validateEmptyFields(formData, validation, setValidation) {
  const emptyField = Object.keys(formData).find(field => !formData[field]);
  if (emptyField) {
    const inputElement = document.getElementById(emptyField);
    const text = inputElement ? inputElement.getAttribute('placeholder') : "Required field";
    setValidation(prev => ({ ...prev, [`${emptyField}Error`]: `※ ${text}` }));

    if (inputElement) {
      inputElement.focus();
    }
    return false;
  }
  return true;
}