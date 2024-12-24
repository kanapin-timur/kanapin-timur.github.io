const form = document.querySelector('#form');
const inputs = form.querySelectorAll('input');
const firstName = form.querySelector('#first-name');
const lastName = form.querySelector('#last-name');
const email = form.querySelector('#email');
const password = form.querySelector('#password');
const confirmPassword = form.querySelector('#password-confirm');
const birthDate = form.querySelector('#birth-day');
const submitButton = form.querySelector('#form-button');
const errorMessage = form.querySelector('#error-message');
const errorTitle = errorMessage.querySelector('.error-title');
const errorCloseButton = errorMessage.querySelector('.error-close');
const passwordButton = form.querySelector('#password-toggle');
const confirmPasswordButton = form.querySelector('#password-confirm-toggle');

// Дебаунсер

const debounce = (func, delay) => {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
};

// Переключатель отображения пароля

passwordVisibilityToggle = (element, button) => {
  button.addEventListener('click', () => {
    if (element.type === 'password') {
      element.type = 'text';
      button.src = 'images/password-show.svg';
    } else {
      element.type = 'password';
      button.src = 'images/password-hide.svg';
    }
  });
};

passwordVisibilityToggle(password, passwordButton);
passwordVisibilityToggle(confirmPassword, confirmPasswordButton);

// Валидация формы

const validateForm = () => {
  const regExName = /[^A-Za-zА-Яа-яЁё]/;
  const regExEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regExPassword = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;

  // Сообщение об ошибке

  const errorShow = (message, element = '') => {
    errorMessage.classList.add('error--active');
    errorTitle.textContent = message;

    if (element.classList.contains('valid')) {
      element.classList.remove('valid');
    }

    element.classList.add('invalid');
  };

  const errorHide = (element) => {
    errorMessage.classList.remove('error--active');
    element.classList.remove('invalid');
    element.classList.add('valid');
  };

  errorCloseButton.addEventListener('click', () => {
    errorMessage.classList.remove('error--active');
  });

  // Проверка на валидность каждого инпута

  const isEveryInputValid = () => {
    if ([...inputs].every((input) => input.classList.contains('valid'))) {
      form.classList.remove('invalid');
      form.classList.add('valid');
      submitButton.removeAttribute('disabled');
    } else {
      form.classList.remove('valid');
      form.classList.add('invalid');
      submitButton.setAttribute('disabled', '');
    }
  };

  // Валидация имени и фамилии

  const validateFullName = (element) => {
    element.addEventListener(
      'input',
      debounce(() => {
        if (regExName.test(element.value)) {
          errorShow(
            `${element.placeholder} must only contain letters`,
            element
          );
        } else if (element.value.length < 2 && element.value != '') {
          errorShow(
            `${element.placeholder} must be at least 2 characters long`,
            element
          );
        } else {
          errorHide(element);
        }

        isEveryInputValid();
      }, 800)
    );
  };

  // Валидация почты

  const validateEmail = () => {
    email.addEventListener(
      'input',
      debounce(() => {
        if (!regExEmail.test(email.value)) {
          errorShow('Please enter a valid email address', email);
        } else {
          errorHide(email);
        }

        isEveryInputValid();
      }, 800)
    );
  };

  // Валидация пароля и его подтверждения

  const validatePassword = () => {
    password.addEventListener(
      'input',
      debounce(() => {
        if (regExPassword.test(password.value)) {
          errorShow(
            'Password must be at least 8 characters length and contain at least one uppercase letter, one lowercase letter, one number and one special character (@, $, !, %, *, #, ?, &)',
            password
          );
        } else {
          errorHide(password);
        }

        isEveryInputValid();
      }, 800)
    );

    confirmPassword.addEventListener(
      'input',
      debounce(() => {
        if (confirmPassword.value !== password.value) {
          errorShow('Passwords do not match', confirmPassword);
        } else {
          errorHide(confirmPassword);
        }

        isEveryInputValid();
      }, 800)
    );
  };

  // Валидация даты рождения

  const validateBirthDate = () => {
    birthDate.addEventListener(
      'input',
      debounce(() => {
        const currentDate = new Date();
        const userDate = new Date(birthDate.value);
        const age = currentDate.getFullYear() - userDate.getFullYear();
        if (userDate > currentDate) {
          errorShow('Please enter a valid date', birthDate);
        } else if (age < 18) {
          errorShow('You must be over 18 years old', birthDate);
        } else {
          errorHide(birthDate);
        }

        isEveryInputValid();
      }, 800)
    );
  };

  validateFullName(firstName);
  validateFullName(lastName);
  validateEmail();
  validatePassword();
  validateBirthDate();
  isEveryInputValid();

  inputs.forEach((input) => {
    input.addEventListener('blur', (event) => {
      if (event.target.value === '') {
        errorShow(`${event.target.placeholder} is required`, input);
      }
    });
  });
};

validateForm();
