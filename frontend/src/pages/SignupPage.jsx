import { Link, useNavigate } from 'react-router';

import { Alert } from '../components/ui/Alert.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AuthFormShell } from '../components/auth/AuthFormShell.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useFormState } from '../hooks/useFormState.js';
import { useAuth } from '../hooks/useAuth.js';
import { hasValidationErrors, validateSignupForm } from '../utils/authValidation.js';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { errors, markTouched, setErrors, values, updateField } = useFormState({
    name: '',
    email: '',
    password: '',
  });
  const { error, isLoading, run } = useAsyncAction();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateSignupForm(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    await run(async () => {
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/dashboard', { replace: true });
    });
  };

  return (
    <AuthFormShell
      title="Create your account"
      subtitle="Start with a secure account for your team workspace."
      footer={
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-brand-700 hover:text-brand-600" to="/login">
            Login
          </Link>
        </p>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Input
          id="name"
          label="Name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onBlur={() => markTouched('name')}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onBlur={() => markTouched('email')}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onBlur={() => markTouched('password')}
          onChange={(event) => updateField('password', event.target.value)}
        />
        <p className="text-xs leading-5 text-slate-500">
          Use at least 8 characters with uppercase, lowercase, and a number.
        </p>
        <Button
          className="w-full"
          isLoading={isLoading}
          loadingLabel="Creating account..."
          type="submit"
        >
          Create account
        </Button>
      </form>
    </AuthFormShell>
  );
};
