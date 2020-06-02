import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

// Recebendo todas as propriedades que um button pode receber
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
