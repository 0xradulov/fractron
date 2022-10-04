import type { NextPage } from 'next';
import styled from 'styled-components';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { BiChevronRight } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TronWebContext, TronWebFallbackContext } from '../pages/_app';
import { trimAddress, wl } from '../misc';

type TokenURI = {
  tokenId: string;
  name: string;
  image: string;
  description: string;
  owner: string;
};

const Home: NextPage = () => {
  const tronWeb = useContext(TronWebContext);
  const tronWebFallback = useContext(TronWebFallbackContext);
  const [currentStage, setCurrentStage] = useState<'select' | 'fractionalize'>(
    'select'
  );
  const [chosenNFTs, setChosenNFTs] = useState<TokenURI[]>([]);
  const [searchedTokenURI, setSearchedTokenURI] = useState<TokenURI>({
    tokenId: '-1',
    name: 'name',
    image: 'image',
    description: 'description',
    owner: 'owner',
  });
  const { register, handleSubmit, watch, formState } = useForm<any>();
  const searchForm = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
    // do the actual fractionalization
  };

  const onSearch: SubmitHandler<any> = async (data) => {
    console.log(data);

    const collection = wl[data.collection];
    if (!collection) {
      console.log("we don't support this collection yet!");
      return;
    }

    try {
      const nftContract = await tronWeb.contract().at(collection.address);
      const owner = await nftContract.ownerOf(data.tokenId).call();
      const metadataURI = collection.baseURI + data.tokenId + collection.endURI;
      const response = await fetch(metadataURI);
      const uri = await response.json();
      console.log(uri);
      if (collection.ipfsImage) {
        uri.image = 'https://ipfs.io/ipfs/' + uri.image.slice(7);
      }
      console.log(uri.image);
      uri.owner = owner;
      setSearchedTokenURI(uri);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChooseNFT = () => {
    if (chosenNFTs.includes(searchedTokenURI)) {
      console.log('already chosen!');
      return;
    }
    if (chosenNFTs.length > 6) {
      console.log('max length is 6!');
      return;
    }
    setChosenNFTs(chosenNFTs.concat([searchedTokenURI]));
  };

  const deleteFromChosenNFTs = (name: string, tokenId: string) => {
    setChosenNFTs(
      chosenNFTs.filter((nft) => nft.name != name && nft.tokenId != tokenId)
    );
  };

  const handleContinue = () => {
    setCurrentStage('fractionalize');
  };

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
                      <option value="bayctron">BAYCTRON</option>
                      <option value="mayctron">MAYCTRON</option>
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
                    </>
                  )}
                </div>
              </NFTContainer>
            </Left>
          )}
          {currentStage === 'fractionalize' && (
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
                <Button type="submit">Fractionalize</Button>
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
`;

const Right = styled.div`
  width: 60%;
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
