import { Alert } from './Alert.jsx';

export const ErrorState = ({ message = 'Something went wrong.' }) => (
  <Alert variant="error">{message}</Alert>
);
