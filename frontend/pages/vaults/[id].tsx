import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiLinkExternal } from 'react-icons/bi';
import Link from 'next/link';
import Fractron from '../../../contracts/out/Fractron.sol/Fractron.json';
import ERC20 from '../../../contracts/out/ERC20.sol/ERC20.json';
import { fractron } from '../../addresses';
import { useQuery } from 'react-query';
import { useContext, useState } from 'react';
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
  const tronWeb = useContext(TronWebContext);
  const testnet = useContext(TestnetContext);
  const [erc20IsApproved, setErc20IsApproved] = useState(false);

  const { data: vault } = useQuery(
    ['vault'],
    async () => {
      let tronWeb: any;
      if (testnet) {
        tronWeb = tronWebFallbackShasta;
      } else {
        tronWeb = tronWebFallback;
      }
      try {
        const network = testnet ? 'shasta' : 'mainnet';
        let contract = await tronWeb.contract(Fractron.abi, fractron[network]);
        let vault = await contract.getVault(query.id).call();

        let parsedVault = {
          nftContracts: vault.nftContracts.map((address: string) =>
            tronWeb.address.fromHex(address)
          ),
          tokenIds: vault.tokenIds.map((id: any) => id.toString()),
          tokenSupply: vault.tokenSupply.toString(),
          tokenContract: tronWeb.address.fromHex(vault.tokenContract),
          name: vault.name,
          creator: tronWeb.address.fromHex(vault.creator),
        };

        return parsedVault;
      } catch (e) {
        console.log(e);
        return {
          nftContracts: [],
          tokenIds: [],
          tokenSupply: '0',
          tokenContract: '',
          name: '',
          creator: '',
        };
      }
    },
    {
      enabled: !!tronWebFallback && !!tronWebFallbackShasta && !!query.id,
    }
  );

  const { data: erc20 } = useQuery(
    ['balance'],
    async () => {
      const network = testnet ? 'shasta' : 'mainnet';
      try {
        let contract = await tronWeb.contract(ERC20.abi, vault?.tokenContract);
        let balance = await contract
          .balanceOf(tronWeb.defaultAddress.hex)
          .call();
        let allowance = await contract
          .allowance(tronWeb.defaultAddress.hex, fractron[network])
          .call();

        return { balance: balance.toString(), allowance: allowance.toString() };
        // let vault = await contract.getVault(query.id).call();
      } catch (e) {
        console.log(e);
        return { balance: '0', allowance: '0' };
      }
    },
    {
      enabled: !!tronWeb && !!vault,
    }
  );

  const { data: nfts } = useQuery(
    ['content'],
    async () => {
      let tronWeb: any;
      if (testnet) {
        tronWeb = tronWebFallbackShasta;
      } else {
        tronWeb = tronWebFallback;
      }
      try {
        let nfts = [];
        for (let i = 0; i < vault?.nftContracts.length; i++) {
          let contract = await tronWeb.contract().at(vault?.nftContracts[i]);
          let tokenURI = await contract.tokenURI(vault?.tokenIds[i]).call();
          let parsedURI = JSON.parse(tokenURI);
          const nft = {
            ...parsedURI,
            address: vault?.nftContracts[i],
            tokenId: vault?.tokenIds[i],
          };
          nfts[i] = nft;
        }
        return nfts;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    {
      enabled: !!vault,
    }
  );

  const joinVault = async () => {
    if (!query.id) return;
    const network = testnet ? 'shasta' : 'mainnet';
    let contract = await tronWeb.contract(Fractron.abi, fractron[network]);
    await contract.join(query.id).send({
      feeLimit: 10000000000,
      callValue: 0,
      shouldPollResponse: false,
    });
  };

  const approveVault = async () => {
    if (!vault) return;

    const network = testnet ? 'shasta' : 'mainnet';
    let contract = await tronWeb.contract(ERC20.abi, vault?.tokenContract);
    await contract
      .approve(fractron[network], tronWeb.toSun('1000000000000'))
      .send({
        feeLimit: 10000000000,
        callValue: 0,
        shouldPollResponse: false,
      });
  };

  return (
    <Container>
      <Upper>
        <div className="left">
          <img src="/coolcat.png" alt=""></img>
        </div>
        <div className="right">
          <h1>
            {vault?.name} <BsPatchCheckFill />
          </h1>
          <div className="box">
            <div className="">
              <p className="small">Total supply</p>
              <p className="big">{vault?.tokenSupply} BAYT</p>
            </div>
            <div className="">
              <p className="small">Your balance</p>
              <p className="big">{erc20?.balance} BAYT</p>
            </div>
            {erc20?.balance === vault?.tokenSupply &&
            erc20?.allowance > erc20?.balance ? (
              <Button onClick={() => joinVault()}>Join vault</Button>
            ) : erc20?.balance === vault?.tokenSupply ? (
              <Button onClick={() => approveVault()}>Approve vault</Button>
            ) : null}
          </div>
          <Link href="/">
            <a
              className="sunswap"
              href="https://sunswap.com/#/v2"
              target="_blank"
              rel="noreferrer"
            >
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
        <h1>NFTs inside the vault ({vault?.tokenIds.length})</h1>
        <div className="nfts">
          {nfts?.map((nft, i) => {
            return (
              <div key={i} className="nft">
                <img src={nft.image} alt={nft.name}></img>
                <Link href="/">
                  <a
                    href={`https://${
                      testnet ? 'shasta.' : ''
                    }tronscan.org/#/contract/${nft.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
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
