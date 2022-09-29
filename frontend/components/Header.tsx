import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

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
          <a className="logo">fractron</a>
        </Link>
        <Link href="/explore">
          <a className="choice">Explore</a>
        </Link>
        <Link href="/collections">
          <a className="choice">Collections</a>
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Button>Connect</Button>
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
    :hover {
      cursor: pointer;
    }
  }

  .choice {
    padding-top: 0.5rem;
    font-weight: 400;

    :hover {
      cursor: pointer;
      font-weight: 600;
    }
  }
`;

const ButtonContainer = styled.div`
  justify-self: end;
`;

const Button = styled.button`
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
