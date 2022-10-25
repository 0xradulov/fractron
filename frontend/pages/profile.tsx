import type { NextPage } from 'next';
import styled from 'styled-components';
import { BsPatchCheckFill } from 'react-icons/bs';
import Link from 'next/link';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import Fractron from '../../contracts/out/Fractron.sol/Fractron.json';
import { fractron } from '../addresses';
const TronWeb = require('tronweb');
import {
  TestnetContext,
  TronWebContext,
  TronWebFallbackContext,
  TronWebFallbackContextShasta,
} from '../pages/_app';

const Profile: NextPage = () => {
  const tronWeb = useContext(TronWebContext);
  const testnet = useContext(TestnetContext);

  const {
    isLoading,
    error,
    data: vaults,
  } = useQuery(
    ['vaults'],
    async () => {
      const network = testnet ? 'shasta' : 'mainnet';
      try {
        let parsedVaults = [];
        let contract = await tronWeb.contract(Fractron.abi, fractron[network]);
        let vaults = await contract.getAllVaults().call();

        for (let i = 0; i < vaults.length; i++) {
          if (vaults[i].creator !== tronWeb.defaultAddress.hex) continue;
          let collections: string[] = [];
          for (let collection of vaults[i][0]) {
            if (!collections.includes(collection)) {
              collections.push(collection);
            }
          }
          parsedVaults[i] = {
            collectionsCount: collections.length,
            nftCount: vaults[i][1].length,
            name: vaults[i][5],
          };
        }
        return parsedVaults;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    {
      enabled: !!tronWeb && !!testnet,
    }
  );

  const coverImages = [
    'coolcat.png',
    'clonex.png',
    'bayc.jpeg',
    'doodle.jpeg',
    'mayc.png',
  ];

  return (
    <Outer>
      <Inner>
        <div>
          <h1>
            Your fractions on Frac<span>tron</span>
          </h1>
        </div>
        <Vaults>
          {vaults &&
            vaults.map((vault, i) => {
              return vault?.collectionsCount > 0 ? (
                <Link href={`/vaults/${i}`} key={i}>
                  <Vault>
                    <div className="top">
                      <img
                        src={`./${coverImages[i % coverImages.length]}`}
                        alt=""
                      ></img>
                    </div>
                    <div className="bottom">
                      <div className="title">
                        <p>{vault.name} </p>
                        <BsPatchCheckFill />
                      </div>
                      <div className="details">
                        <div>
                          <p className="header"># of collections</p>
                          <p>{vault.collectionsCount}</p>
                        </div>
                        <div>
                          <p className="header"># of NFTs</p>
                          <p>{vault.nftCount}</p>
                        </div>
                      </div>
                    </div>
                  </Vault>
                </Link>
              ) : null;
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
  background-color: white;
  border: 1px solid ${({ theme }) => theme.background.quaternary};
  border-radius: 1rem;
  .top {
    height: 300px;
    width: 300px;
    border-radius: 1rem 1rem 0 0;
    /* background-color: blue; */
    img {
      height: 100%;
      width: 350px;
    }
  }
  .bottom {
    padding: 1rem;
    /* height: 100px; */
    width: 350px;
    border-radius: 0 0 1rem 1rem;
    background-color: white;
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
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 1.5rem;

  @media screen and (max-width: 1700px) {
    /* grid-template-columns: 1fr 1fr 1fr; */
  }
`;

const Inner = styled.div`
  width: 95%;
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

export default Profile;
