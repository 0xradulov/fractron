import type { NextPage } from 'next';
import styled from 'styled-components';
import { BsPatchCheckFill } from 'react-icons/bs';
import Link from 'next/link';

const VaultsPage: NextPage = () => {
  return (
    <Outer>
      <Inner>
        <div>
          <h1>
            Top Vaults on Frac<span>tron</span>
          </h1>
        </div>
        <Vaults>
          {[...Array(8)].map((_, i) => {
            return (
              <Link href={`/vaults/${i}`} key={i}>
                <Vault>
                  <div className="top"></div>
                  <div className="bottom">
                    <div className="title">
                      <p>BAYCTRON Vault </p>
                      <BsPatchCheckFill />
                    </div>
                    <div className="details">
                      <div>
                        <p className="header"># of collections</p>
                        <p>3</p>
                      </div>
                      <div>
                        <p className="header"># of NFTs</p>
                        <p>323</p>
                      </div>
                    </div>
                  </div>
                </Vault>
              </Link>
            );
          })}
        </Vaults>
      </Inner>
    </Outer>
  );
};

const Vault = styled.a`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  .top {
    height: 150px;
    width: 350px;
    border-radius: 1.5rem 1.5rem 0 0;
    background-color: blue;
  }
  .bottom {
    padding: 1rem;
    /* height: 100px; */
    width: 350px;
    border-radius: 0 0 1.5rem 1.5rem;
    background-color: white;
    border: 2px solid ${({ theme }) => theme.background.quaternary};
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      svg {
        height: 22px;
        width: 22px;
        color: ${({ theme }) => theme.colors.secondary};
      }
    }

    .details {
      p {
        font-weight: 500;
      }
      .header {
        opacity: 0.4;
        /* color: ${({ theme }) => theme.background.senary}; */
      }
      border-top: 1px solid ${({ theme }) => theme.background.quaternary};
      padding: 0.5rem;
      padding-top: 1rem;
      display: flex;
      gap: 1.5rem;
      div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }
`;
const Vaults = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  gap: 1.25rem;
`;

const Inner = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  h1 {
    font-size: 2.25rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid ${({ theme }) => theme.background.quaternary};
    span {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const Outer = styled.div`
  min-height: calc(100vh - 62px);
  margin: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default VaultsPage;
