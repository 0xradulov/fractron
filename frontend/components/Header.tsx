import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { BiUserCircle } from 'react-icons/bi';

export default function Header() {
  const router = useRouter();
  const page =
    router.asPath === '/explore'
      ? 'explore'
      : router.asPath === '/collections'
      ? 'collections'
      : '';

  return (
    <Container>
      <LogoContainer>
        <Link href="/">
          <a className="logo">
            frac<span>tron</span>
          </a>
        </Link>
        <Link href="/explore">
          <a className="choice">Explore</a>
        </Link>
        <Link href="/collections">
          <a className="choice">Collections</a>
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Link href="/fractionalize">
          <a>
            <SecondaryButton>Fractionalize</SecondaryButton>
          </a>
        </Link>
        <BiUserCircle />
        {/* <PrimaryButton>Connect</PrimaryButton> */}
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 2.5rem;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.background.secondary};
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-self: center;
  align-items: center;
  .logo {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.typeScale.header2};
    font-weight: 700;
    margin-right: 1rem;
    span {
      color: ${({ theme }) => theme.colors.secondary};
    }
    :hover {
      cursor: pointer;
    }
  }

  .choice {
    padding-top: 0.5rem;
    font-weight: 600;
    opacity: 0.6;

    :hover {
      cursor: pointer;
      opacity: 1;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    height: 45px;
    width: 45px;
    opacity: 0.8;
    :hover {
      cursor: pointer;
      opacity: 1;
    }
  }
`;
