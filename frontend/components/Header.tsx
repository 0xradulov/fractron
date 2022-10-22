import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BiUserCircle } from 'react-icons/bi';
import { useContext } from 'react';
import { ConnectedContext, TestnetContext } from '../pages/_app';
import { SecondaryButton } from './Buttons';

export default function Header() {
  const { connected, setConnected } = useContext(ConnectedContext);
  const testnet = useContext(TestnetContext);
  const router = useRouter();

  console.log('testnet: ', testnet);

  const handleConnect = async () => {
    try {
      let response = await window.tronLink.request({
        method: 'tron_requestAccounts',
      });
      console.log(response);
      if (response.code === 200) {
        setConnected(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const page =
    router.asPath === '/explore'
      ? 'explore'
      : router.asPath.slice(0, 7) === '/vaults'
      ? 'vaults'
      : '';

  return (
    <Container>
      <LogoContainer>
        <Link href="/">
          <a className="logo">
            frac<span className="tron">tron</span>
            {testnet && <span className="shasta">shasta</span>}
          </a>
        </Link>
        <Link href="/vaults">
          <Choice isActive={page === 'vaults'}>Vaults</Choice>
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Link href="/fractionalize">
          <a>
            <SecondaryButton>Fractionalize</SecondaryButton>
          </a>
        </Link>
        {connected ? (
          <Link href="/profile">
            <a>
              <BiUserCircle />
            </a>
          </Link>
        ) : (
          <PrimaryButton
            onClick={
              connected ? () => console.log('already connected') : handleConnect
            }
          >
            Connect
          </PrimaryButton>
        )}
      </ButtonContainer>
    </Container>
  );
}

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.background.primary};
  padding: 0.85rem 1.75rem;
  border-radius: 30px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;
  opacity: 0.9;

  :hover {
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

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
  gap: 2.5rem;
  justify-self: center;
  align-items: center;
  .logo {
    position: relative;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.typeScale.header2};
    font-weight: 700;
    margin-right: 1rem;
    .tron {
      color: ${({ theme }) => theme.colors.secondary};
    }
    .shasta {
      color: black;
      position: absolute;
      top: 0;
      font-size: 12px;
    }
    :hover {
      cursor: pointer;
    }
  }

  .choice {
  }
`;

const Choice = styled.a<{ isActive: boolean }>`
  padding-top: 0.25rem;
  font-weight: 600;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.6)};

  :hover {
    cursor: pointer;
    opacity: 1;
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
