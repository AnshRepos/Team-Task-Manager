const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = (values) => {
  const errors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateSignupForm = (values) => {
  const errors = validateLoginForm(values);
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.length > 80) {
    errors.name = 'Name must be at most 80 characters';
  }

  if (values.password) {
    if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (values.password.length > 128) {
      errors.password = 'Password must be at most 128 characters';
    } else if (!/[a-z]/.test(values.password)) {
      errors.password = 'Password must include a lowercase letter';
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = 'Password must include an uppercase letter';
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = 'Password must include a number';
    }
  }

  return errors;
};

export const hasValidationErrors = (errors) => Object.keys(errors).length > 0;
