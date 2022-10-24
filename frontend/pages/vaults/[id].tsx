import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiLinkExternal } from 'react-icons/bi';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import {
  TestnetContext,
  TronWebContext,
  TronWebFallbackContext,
  TronWebFallbackContextShasta,
} from '../../pages/_app';

export default function Vault() {
  const { query } = useRouter();
  const tronWebFallback = useContext(TronWebFallbackContext);
  const tronWebFallbackShasta = useContext(TronWebFallbackContextShasta);
  const testnet = useContext(TestnetContext);
  // console.log(query.id);

  const {
    isLoading,
    error,
    data: vault,
  } = useQuery(
    ['vault'],
    async () => {
      return {
        name: 'first vault',
        supply: '100',
        balance: 100,
        collections: [],
        tokenIds: [],
      };
    },
    {
      enabled: !!tronWebFallback && !!tronWebFallbackShasta && !!query.id,
    }
  );

  console.log(vault);

  return (
    <Container>
      <Upper>
        <div className="left">
          <img src="/coolcat.png" alt=""></img>
        </div>
        <div className="right">
          <h1>
            BAYCTRON Vault <BsPatchCheckFill />
          </h1>
          <div className="box">
            <div className="">
              <p className="small">Total supply</p>
              <p className="big">{vault?.supply} BAYT</p>
            </div>
            <div className="">
              <p className="small">Your balance</p>
              <p className="big">{vault?.balance} BAYT</p>
            </div>
            <Button>Join vault</Button>
          </div>
          <Link href="/">
            <a className="sunswap">
              <div>
                <img
                  src="https://assets.coingecko.com/coins/images/12424/small/RSFOmQ.png?1624024337"
                  alt=""
                ></img>
                <p>Trade fractions on Sunswap</p>
              </div>
              <BiLinkExternal />
            </a>
          </Link>
        </div>
      </Upper>
      <Lower>
        <h1>NFTs inside the vault (${vault?.tokenIds.length})</h1>
        <div className="nfts">
          {[...Array(5)].map((_, i) => {
            return (
              <div key={i} className="nft">
                <img
                  src="https://gateway.ipfs.io/ipfs/QmVWhjRUy2NxgNGpdjaWLbMZRhXZGwwqoupjbi9KNBjqEY"
                  alt=""
                ></img>
                <Link href="/">
                  <a>
                    <img
                      src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=023"
                      alt=""
                    ></img>
                    <p>View on tronscan</p>
                    <BiLinkExternal />
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </Lower>
    </Container>
  );
}

const Lower = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .nfts {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    .nft {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      /* height: 500px; */
      /* width: 300px; */
      img {
        height: 300px;
        width: 300px;
      }
      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        cursor: pointer;
        :hover {
          background-color: ${({ theme }) => theme.background.secondary};
        }
        p {
          font-size: 19px;
        }
        img {
          height: 25px;
          width: 25px;
        }
        border-radius: 0.75rem;
        border: 1px solid ${({ theme }) => theme.background.tertiary};
        padding: 1.25rem 1.5rem;
      }
    }
  }
`;

const Upper = styled.div`
  display: flex;
  gap: 4rem;
  /* grid-template-columns: 1fr 1fr; */
  .left {
    img {
      border-radius: 1rem;
      height: 400px;
      width: 400px;
    }
  }
  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    h1 {
      display: flex;
      gap: 1rem;
      align-items: center;
      svg {
        color: ${({ theme }) => theme.colors.secondary};
      }
    }
    .sunswap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      cursor: pointer;
      :hover {
        background-color: ${({ theme }) => theme.background.secondary};
      }
      p {
        font-size: 19px;
      }
      img {
        height: 25px;
        width: 25px;
      }
      div {
        display: flex;
        gap: 1rem;
        font-weight: 500;
      }
      border-radius: 0.75rem;
      border: 1px solid ${({ theme }) => theme.background.tertiary};
      padding: 1.25rem 1.5rem;
    }
    .box {
      margin-top: 1rem;
      padding: 1.5rem;
      border: 1px solid ${({ theme }) => theme.background.tertiary};
      border-radius: 1rem;

      display: flex;
      flex-direction: column;
      gap: 1rem;
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .small {
          font-size: 14px;
        }
        .big {
          font-size: 24px;
        }
      }
    }
  }
`;

const Container = styled.div`
  padding: 4rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Button = styled.button`
  width: 200px;
  padding: 1rem;
  border-radius: 10px;
  background-color: white;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  font-size: 18px;
  :hover {
    cursor: pointer;
    color: white;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
