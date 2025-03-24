import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: #fdfaf6;
    background-color: #1f7d53;

    &:hover {
      background-color: #145a3a;
    }
  `,
  secondary: css`
    color: #255f38;
    background: #faf1e6;
    border: 1px solid #99bc85;

    &:hover {
      background-color: #e4efe7;
    }
  `,
  danger: css`
    color: #fdfaf6;
    background-color: #d9534f;

    &:hover {
      background-color: #c9302c;
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
  @media only screen and (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.7rem 0.9rem;
  }
`;

Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
};

export default Button;
