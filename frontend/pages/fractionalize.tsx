import type { NextPage } from 'next';
import styled from 'styled-components';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { BiChevronRight } from 'react-icons/bi';
import { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TestnetContext,
  TronWebContext,
  TronWebFallbackContext,
} from '../pages/_app';
import { trimAddress, wl } from '../misc';
import Fractron from '../../contracts/out/Fractron.sol/Fractron.json';
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiLinkExternal } from 'react-icons/bi';
import Link from 'next/link';
import { fractron } from '../addresses';

type TokenURI = {
  tokenId: string;
  name: string;
  image: string;
  description: string;
  owner: string;
  address: string;
  isApproved: boolean;
};

const Home: NextPage = () => {
  const testnet = useContext(TestnetContext);
  const tronWeb = useContext(TronWebContext);
  const tronWebFallback = useContext(TronWebFallbackContext);
  const [isFractionalized, setIsFractionalized] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [currentStage, setCurrentStage] = useState<'select' | 'fractionalize'>(
    'select'
  );
  const [chosenNFTs, setChosenNFTs] = useState<TokenURI[]>([]);
  const [allChosenAreApproved, setAllChosenAreApproved] = useState(true);
  const [notApprovedName, setNotApprovedName] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [searchedTokenURI, setSearchedTokenURI] = useState<TokenURI>({
    tokenId: '-1',
    name: 'name',
    image: 'image',
    description: 'description',
    owner: 'owner',
    address: '',
    isApproved: false,
  });
  const [searchedCollection, setSearchedCollection] = useState(wl['bayctron']);
  const [notOwnerError, setNotOwnerError] = useState(false);
  const [vaultInfo, setVaultInfo] = useState({
    address: '',
    name: '',
    symbol: '',
    supply: '',
  });
  const { register, handleSubmit, watch, formState } = useForm<any>();
  const searchForm = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    const network = testnet ? 'shasta' : 'mainnet';
    console.log(chosenNFTs);
    console.log(data);
    // setIsFractionalized(!isFractionalized);
    // do the actual fractionalization
    setIsSplitting(true);
    try {
      let contract = await tronWeb.contract(Fractron.abi, fractron[network]);

      console.log(chosenNFTs);
      const parameters = {
        nftContracts: chosenNFTs.map((chosenNFT) => chosenNFT.address),
        tokenIds: chosenNFTs.map((chosenNFT) => chosenNFT.tokenId),
        supply: data.supply,
        name: data.name,
        symbol: data.symbol,
      };

      // APPROVE ERROR
      console.log(parameters);

      let currentVaultId = (await contract.currentVaultId().call()).toString();
      console.log('cvi:', currentVaultId);

      await contract.split(...Object.values(parameters)).send({
        feeLimit: 10000000000,
        callValue: 0,
        shouldPollResponse: false,
      });

      // get the address with the vaultID
      setTimeout(async () => {
        const vault = await contract.getVault(currentVaultId).call();
        console.log(vault);

        setIsSplitting(false);
        setIsFractionalized(!isFractionalized);

        // cannot find result bullshit error
        setVaultInfo({
          address: tronWeb.address.fromHex(vault.tokenContract),
          name: data.name,
          supply: data.supply,
          symbol: data.symbol,
        });
      }, 10000);
    } catch (e) {
      setIsSplitting(false);
      console.log(e);
    }
    // setTimeout(() => {
    //   setIsSplitting(false);
    //   setIsFractionalized(!isFractionalized);
    // }, 5000);

    // show address, name, ticker and supply
  };

  const onSearch: SubmitHandler<any> = async (data) => {
    console.log(data);

    if (data.collection === 'bayctron' && testnet) {
      data.collection = 'trontastybones'; // dirty fix for default value bug
    }
    if (data.collection === 'trontastybones' && !testnet) {
      data.collection = 'bayctron'; // dirty fix for default value bug
    }
    const network = testnet ? 'shasta' : 'mainnet';
    const collection = wl[network][data.collection];
    if (!collection) {
      console.log("we don't support this collection yet!");
      return;
    }
    setSearchedCollection(collection);
    console.log(collection);

    try {
      const nftContract = await tronWeb.contract().at(collection.address);
      const owner = await nftContract.ownerOf(data.tokenId).call();

      if (data.collection === 'testcollection') {
        let uri = {
          owner,
          image:
            'https://cpmr-islands.org/wp-content/uploads/sites/4/2019/07/test.png',
          name: 'Test NFT',
          description: 'A Test NFT.',
          tokenId: data.tokenId,
          address: collection.address,
          isApproved: false,
        };
        setSearchedTokenURI(uri);
      } else if (data.collection === 'testcollection2') {
        let uri = {
          owner,
          image:
            'https://cpmr-islands.org/wp-content/uploads/sites/4/2019/07/test.png',
          name: 'Test NFT 2',
          description: 'Another Test NFT.',
          tokenId: data.tokenId,
          address: collection.address,
          isApproved: false,
        };
        setSearchedTokenURI(uri);
      } else {
        const metadataURI =
          collection.baseURI + data.tokenId + collection.endURI;
        const response = await fetch(metadataURI);
        const uri = await response.json();

        if (collection.ipfsImage) {
          uri.image = 'https://ipfs.io/ipfs/' + uri.image.slice(7);
        }
        uri.owner = owner;
        uri.address = collection.address;
        uri.isApproved = false;
        uri.tokenId = data.tokenId;
        setSearchedTokenURI(uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChooseNFT = async () => {
    if (chosenNFTs.includes(searchedTokenURI)) {
      console.log('already chosen!');
      return;
    }
    if (chosenNFTs.length > 10) {
      console.log('max length is 10!');
      return;
    }
    // check if logged in user is the owner...
    try {
      if (searchedTokenURI.owner === tronWeb.defaultAddress.hex) {
        setChosenNFTs(chosenNFTs.concat([searchedTokenURI]));
        // check if approved
        const network = testnet ? 'shasta' : 'mainnet';
        const nftContract = await tronWeb
          .contract()
          .at(searchedTokenURI.address);
        const isApproved = await nftContract
          .isApprovedForAll(searchedTokenURI.owner, fractron[network])
          .call();
        console.log('ia', isApproved);
        if (allChosenAreApproved) {
          setAllChosenAreApproved(isApproved);
        }
        if (!isApproved) {
          setNotApprovedName(searchedTokenURI.name);
        }
        setSearchedTokenURI({
          ...searchedTokenURI,
          isApproved,
        });
      } else {
        console.log("you cannot fractionalize NFTs you don't own.");
        setNotOwnerError(true);
        setTimeout(() => {
          setNotOwnerError(false);
        }, 10000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFromChosenNFTs = (name: string, tokenId: string) => {
    setChosenNFTs(
      chosenNFTs.filter((nft) => nft.name != name && nft.tokenId != tokenId)
    );
  };

  const handleContinue = () => {
    setCurrentStage('fractionalize');
  };

  const approveCollection = async () => {
    // for all collection addresses in chosenNFTs that arent approved, approve
    let chosenNFTsNew = chosenNFTs;
    console.log(chosenNFTs);
    const network = testnet ? 'shasta' : 'mainnet';
    for (let i = 0; i < chosenNFTs.length; i++) {
      if (chosenNFTs[i].name === notApprovedName) {
        // approve
        setApprovalLoading(true);
        try {
          const nftContract = await tronWeb
            .contract()
            .at(chosenNFTs[i].address);
          const approval = await nftContract
            .setApprovalForAll(fractron[network], true)
            .send();
          console.log(approval);
        } catch (e) {
          console.log(e);
        }
        setTimeout(() => {
          setApprovalLoading(false);
        }, 5000);

        break;
      }
    }

    for (let i = 0; i < chosenNFTsNew.length; i++) {
      if (chosenNFTsNew[i].name === notApprovedName) {
        chosenNFTsNew[i].isApproved = true;
      }
    }

    setNotApprovedName('');
    setAllChosenAreApproved(true);

    for (let i = 0; i < chosenNFTsNew.length; i++) {
      if (!chosenNFTsNew[i].isApproved) {
        setNotApprovedName(chosenNFTsNew[i].name);
        setAllChosenAreApproved(false);
      }
    }

    setChosenNFTs(chosenNFTsNew);
  };

  useEffect(() => {
    setChosenNFTs([]);
    setCurrentStage('select');
    setSearchedTokenURI({
      tokenId: '-1',
      name: 'name',
      image: 'image',
      description: 'description',
      owner: 'owner',
      address: '',
      isApproved: false,
    });
  }, [testnet]);

  return (
    <Outer>
      <div className="wrapper">
        <ProgressBar>
          <div className="navigate">
            <FaLongArrowAltLeft />
          </div>
          <div className="state">
            <Stage
              className="select"
              isActive={currentStage == 'select'}
              onClick={() => setCurrentStage('select')}
            >
              <p>Select your NFTs</p>
            </Stage>
            <BiChevronRight />
            <Stage isActive={currentStage == 'fractionalize'}>
              <p>Fractionalize NFTs</p>
            </Stage>
          </div>
          <div className="navigate">
            <FaLongArrowAltRight />
          </div>
        </ProgressBar>
        <ChosenBar>
          <div className="nft-row">
            {currentStage === 'select' &&
              chosenNFTs.map((nft) => {
                return (
                  <img
                    onClick={() => deleteFromChosenNFTs(nft.name, nft.tokenId)}
                    key={nft.tokenId + nft.name}
                    src={nft.image}
                    alt="image"
                  ></img>
                );
              })}
          </div>
          {chosenNFTs.length > 0 && currentStage === 'select' && (
            <BlackButton onClick={handleContinue}>Continue</BlackButton>
          )}
        </ChosenBar>
        <Content>
          {currentStage === 'select' && (
            <Left>
              <h1>
                Select your NFTs to <span>Fractionalize</span>
              </h1>
              <p>
                Choose the NFT(s) to send to a new vault, select your desired
                fraction type, set your vault&apos;s details, then continue to
                fractionalize. Once complete, all fractions will appear in your
                wallet. Be aware, you cannot add to the NFTs in a vault once
                created. Read our guides for more information.
              </p>
              <LeftForm onSubmit={searchForm.handleSubmit(onSearch)}>
                <LeftSearch>
                  <div>
                    <label>Collection</label>
                    <select
                      {...searchForm.register('collection', {
                        required: true,
                      })}
                    >
                      {testnet ? (
                        <>
                          <option value="trontastybones">
                            Tron Tasty Bones
                          </option>
                          <option value="troncryptocoven">
                            Tron Crypto Coven
                          </option>
                          <option value="testcollection">
                            Test Collection
                          </option>
                          <option value="testcollection2">
                            Test Collection 2
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="bayctron">BAYC Tron</option>
                          <option value="mayctron">MAYC Tron</option>
                          <option value="coolcatstron">Cool Cats Tron</option>
                          <option value="metaversenameservice">
                            Metaverse Name Service
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label>NFT Token ID</label>
                    <input
                      placeholder="e.g 3546"
                      {...searchForm.register('tokenId', { required: true })}
                    />
                  </div>
                  <button type="submit">Search</button>
                </LeftSearch>
                {(searchForm.formState.errors.contractAddress ||
                  searchForm.formState.errors.tokenId) && (
                  <span>Contract Address and token ID are required</span>
                )}
              </LeftForm>
              <NFTContainer>
                {searchedTokenURI.tokenId !== '-1' && (
                  <img src={searchedTokenURI.image} alt="image"></img>
                )}
                <div className="metadata">
                  {searchedTokenURI.tokenId !== '-1' && (
                    <>
                      <h1>{searchedTokenURI.name}</h1>
                      <p className="owner">
                        {' '}
                        Owned by {trimAddress(searchedTokenURI.owner)}
                      </p>
                      <p className="description">
                        {searchedTokenURI.description}
                      </p>
                      <BlackButton onClick={handleChooseNFT}>
                        Choose
                      </BlackButton>
                      {notOwnerError && (
                        <p className="error">You don&apos;t own this NFT.</p>
                      )}
                    </>
                  )}
                </div>
              </NFTContainer>
            </Left>
          )}
          {currentStage === 'fractionalize' && !isFractionalized && (
            <Right>
              <RightForm onSubmit={handleSubmit(onSubmit)}>
                <div className="vault-details">
                  <p className="header">Vault details</p>
                  <div className="nft-row">
                    {chosenNFTs.map((nft) => {
                      return (
                        <img
                          key={nft.tokenId + nft.name}
                          src={nft.image}
                          alt="image"
                        ></img>
                      );
                    })}
                  </div>
                </div>
                <div className="single vault-input">
                  <label>Vault Name:</label>
                  <input
                    className="name"
                    placeholder="e.g BAYCTRONV"
                    {...register('name', { required: true })}
                  />
                  {formState.errors.name && <span>Vault name is required</span>}
                </div>
                <Double>
                  <div className="vault-input">
                    <label>Token supply:</label>
                    <input
                      type="number"
                      placeholder="e.g 10000"
                      {...register('supply', { required: true })}
                    />
                    {formState.errors.supply && <span>Supply is required</span>}
                  </div>

                  <div className="vault-input">
                    <label>Token symbol:</label>
                    <input
                      placeholder="e.g BAYT"
                      {...register('symbol', { required: true })}
                    />
                    {formState.errors.symbol && <span>Symbol is required</span>}
                  </div>
                </Double>
                {allChosenAreApproved && isSplitting ? (
                  <Button type="submit">Fractionalizing...</Button>
                ) : allChosenAreApproved ? (
                  <Button type="submit">Fractionalize</Button>
                ) : approvalLoading ? (
                  <Button type="button">Loading...</Button>
                ) : (
                  <Button type="button" onClick={approveCollection}>
                    Approve {notApprovedName}
                  </Button>
                )}
              </RightForm>
            </Right>
          )}
          {currentStage === 'fractionalize' && isFractionalized && (
            <Right>
              <RightForm onSubmit={handleSubmit(onSubmit)}>
                <div className="vault-details">
                  <p className="header">Vault details</p>
                  <div className="nft-row">
                    {chosenNFTs.map((nft) => {
                      return (
                        <img
                          key={nft.tokenId + nft.name}
                          src={nft.image}
                          alt="image"
                        ></img>
                      );
                    })}
                  </div>
                </div>
                <div className="single vault-input">
                  <label>Vault Address:</label>

                  <a
                    href={`https://${
                      testnet ? 'shasta.' : ''
                    }tronscan.org/#/contract/${vaultInfo.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{vaultInfo.address}</span> <BiLinkExternal />
                  </a>
                </div>
                <div className="single vault-input">
                  <label>Vault Name:</label>
                  <p>{vaultInfo.name}</p>
                </div>
                <Double>
                  <div className="vault-input">
                    <label>Token supply:</label>
                    <p>{vaultInfo.supply}</p>
                  </div>

                  <div className="vault-input">
                    <label>Token symbol:</label>
                    <p>{vaultInfo.symbol}</p>
                  </div>
                </Double>
                <Button2
                  type="button"
                  onClick={() => setIsFractionalized(false)}
                >
                  <p>Fractionalized</p>
                  <BsPatchCheckFill />
                </Button2>
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
              </RightForm>
            </Right>
          )}
        </Content>
      </div>
    </Outer>
  );
};

const NFTContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
  justify-content: center;
  img {
    height: 350px;
    width: 350px;
  }
  .metadata {
    align-self: center;
    .error {
      margin-top: 0.25rem;
      color: red;
      font-weight: 500;
    }
  }

  h1 {
    padding-top: 0.5rem;
  }

  p {
    padding-left: 0.2rem;
    padding-top: 0.2rem;
  }

  .owner {
    opacity: 0.8;
  }

  .description {
    padding-top: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 20px;
  background-color: white;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  :hover {
    cursor: pointer;
    color: white;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  &.fractionalized {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    background: transparent;
    svg {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const Button2 = styled.button`
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  background: transparent;
  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LeftSearch = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input {
      width: 100%;
    }
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.background.primary};
    padding: 0.7rem 2.25rem;
    border-radius: 5px;
    font-size: ${({ theme }) => theme.typeScale.header6};
    font-weight: 600;
    cursor: pointer;

    :hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const BlackButton = styled.button`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.background.primary};
  padding: 0.7rem 2.25rem;
  width: 100%;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Double = styled.div`
  display: flex;
  gap: 1rem;
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input {
      width: 100%;
    }
  }
`;

const LeftForm = styled.form`
  /* border: 1px solid ${({ theme }) => theme.background.senary}; */
  /* border-radius: 20px; */
  /* padding: 2rem; */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input {
    /* width: 100%; */
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.background.senary};
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.background.senary};
  }

  .single {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    opacity: 0.8;
    font-size: 14px;
    font-weight: 500;
  }
`;

const RightForm = styled.form`
  border: 1px solid ${({ theme }) => theme.background.senary};
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .header {
    font-weight: 600;
  }

  input {
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.background.senary};
  }

  .single {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .vault-input {
    span {
      color: ${({ theme }) => theme.colors.secondary};
      font-size: ${({ theme }) => theme.typeScale.helperText};
    }
    p {
      font-weight: 700;
      font-size: ${({ theme }) => theme.typeScale.header6};
    }
    a {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      span {
        font-weight: 700;
        font-size: ${({ theme }) => theme.typeScale.header6};
        color: black;
      }
      :hover {
        color: ${({ theme }) => theme.colors.secondary};
        span {
          color: ${({ theme }) => theme.colors.secondary};
        }
      }
    }
  }

  label {
    opacity: 0.8;
    font-size: 14px;
    font-weight: 500;
  }
  .vault-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .nft-row {
    margin-left: 0.25rem;
    display: flex;
    gap: 0.5rem;
    img {
      border-radius: 10px;
      width: 50px;
      height: 50px;
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
`;

const Right = styled.div`
  /* width: 60%; */
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  p {
    font-weight: 500;
    line-height: 1.6rem;
  }
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
  input {
    width: 40%;
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.background.senary};
  }
`;

const Content = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* display: grid; */
  /* grid-template-columns: 2fr 1fr; */
  gap: 3rem;
  /* margin-top: 3rem; */
`;

const Stage = styled.div<{ isActive: boolean }>`
  border-bottom: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.secondary : theme.background.senary};
  padding-bottom: 10px;
  p {
    font-weight: 600;
    opacity: ${({ theme, isActive }) => (isActive ? 1 : 0.5)};
  }
  &.select {
    cursor: pointer;
    :hover {
      border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
    }
    p {
      :hover {
        opacity: 1;
      }
    }
  }
`;

const ChosenBar = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.75rem;

  .nft-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    img {
      cursor: pointer;
      border-radius: 10px;
      width: 80px;
      height: 80px;
    }
  }

  button {
    width: 200px;
  }
`;

const ProgressBar = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .state {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    svg {
      color: ${({ theme }) => theme.colors.primary};
      height: 22px;
      width: 22px;
    }
  }
  .navigate {
    svg {
      color: ${({ theme }) => theme.colors.primary};
      height: 25px;
      width: 25px;
    }
  }
`;

const Outer = styled.div`
  min-height: calc(100vh - 62px);
  margin-top: 2.5rem;
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* width: 100%; */
    padding-bottom: 4rem;
    &.bottom-border {
      border-bottom: 2px solid ${({ theme }) => theme.background.tertiary};
    }
  }
`;

export default Home;
