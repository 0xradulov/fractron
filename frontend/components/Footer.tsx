import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <p>fractron is where you fractionalize your NFTs on the tron network</p>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.background.tertiary};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  padding: 1rem 1.5rem;
  font-size: ${({ theme }) => theme.typeScale.smallParagraph};
`;

export default Footer;
