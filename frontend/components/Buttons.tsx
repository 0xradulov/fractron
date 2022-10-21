import styled from 'styled-components';

export const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.background.primary};
  padding: 0.5rem 1.75rem;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const SecondaryButton = styled.button`
  width: 200px;
  padding: 0.75rem;
  border-radius: 30px;
  background-color: white;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  :hover {
    cursor: pointer;
    color: white;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
