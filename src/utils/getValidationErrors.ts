import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // pode ser qualquer coisa - qualquer campo/propriedade
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
