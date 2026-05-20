import { Link, useLocation, useNavigate } from 'react-router';

import { Alert } from '../components/ui/Alert.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AuthFormShell } from '../components/auth/AuthFormShell.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useFormState } from '../hooks/useFormState.js';
import { hasValidationErrors, validateLoginForm } from '../utils/authValidation.js';
import { useAuth } from '../hooks/useAuth.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { errors, markTouched, setErrors, values, updateField } = useFormState({
    email: '',
    password: '',
  });
  const { error, isLoading, run } = useAsyncAction();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    await run(async () => {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    });
  };

  return (
    <AuthFormShell
      title="Welcome back"
      subtitle="Log in to continue managing your team tasks."
      footer={
        <p className="text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link className="font-medium text-brand-700 hover:text-brand-600" to="/signup">
            Sign up
          </Link>
        </p>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        {error ? <Alert variant="error">{error}</Alert> : null}
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
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onBlur={() => markTouched('password')}
          onChange={(event) => updateField('password', event.target.value)}
        />
        <Button className="w-full" isLoading={isLoading} loadingLabel="Logging in..." type="submit">
          Login
        </Button>
      </form>
    </AuthFormShell>
  );
};
