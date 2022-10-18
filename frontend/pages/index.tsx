import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';

const indexToImageName = (i: number) => {
  // assumes that i < 1000
  let name = 'image_part_';
  if (i < 10) {
    name += `00${i}.jpg`;
  } else if (i < 100) {
    name += `0${i}.jpg`;
  } else {
    name += `${i}.jpg`;
  }

  return name;
};

const Home: NextPage = () => {
  return (
    <Outer>
      <div className="wrapper bottom-border">
        <First>
          <Left>
            <h1>
              <span>Explore</span>, <span>collect</span> and{' '}
              <span>fractionalize</span> NFTs
            </h1>
            <p>
              Fractional ownership of the world&apos;s most sought after NFTs.
              Fractional reduces entry costs, increases access, and enables new
              communities.
            </p>
            <Link href="/vaults">
              <a>
                <Button>Explore Vaults</Button>
              </a>
            </Link>
          </Left>
          <Right>
            {new Array(100).fill(0).map((_, i) => {
              const name = indexToImageName(i + 1);
              console.log(name);
              return (
                <img src={`./doodle100/${name}`} key={name} alt="image"></img>
              );
              // return <div key={Math.random()}></div>;
            })}
          </Right>
        </First>
      </div>
      <div className="wrapper">
        <Second>
          <h1>
            <span>Collective ownership</span> of iconic and historic NFTs
          </h1>
          <p>
            Fractionalization is also a unique way to unlock NFT utility and
            community building around popular NFTs.
          </p>
          <BigNFT>
            <div className="inner">
              {new Array(100).fill(0).map((_, i) => {
                const name = indexToImageName(i + 1);
                console.log(name);
                return (
                  <img src={`./doodle100/${name}`} key={name} alt="image"></img>
                );
              })}
            </div>
            <div className="inner">
              {new Array(100).fill(0).map((_, i) => {
                const name = indexToImageName(i + 1);
                console.log(name);
                return (
                  <img src={`./clonex100/${name}`} key={name} alt="image"></img>
                );
              })}
            </div>
            <div className="inner">
              {new Array(100).fill(0).map((_, i) => {
                const name = indexToImageName(i + 1);
                console.log(name);
                return (
                  <img
                    src={`./tronbies100/${name}`}
                    key={name}
                    alt="image"
                  ></img>
                );
              })}
            </div>
            <div className="inner">
              {new Array(100).fill(0).map((_, i) => {
                const name = indexToImageName(i + 1);
                console.log(name);
                return (
                  <img
                    src={`./coolcat100/${name}`}
                    key={name}
                    alt="image"
                  ></img>
                );
              })}
            </div>
          </BigNFT>
          <Link href="/vaults">
            <a>
              <Button>Popular Vaults</Button>
            </a>
          </Link>
        </Second>
      </div>
    </Outer>
  );
};

const Button = styled.button`
  width: 200px;
  padding: 1rem;
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

const Outer = styled.div`
  min-height: calc(100vh - 62px);
  margin-top: 4rem;
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-bottom: 4rem;
    &.bottom-border {
      border-bottom: 2px solid ${({ theme }) => theme.background.tertiary};
    }
  }
`;

const Second = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  h1 {
    font-size: 1.75rem;
    span {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
  p {
    font-size: ${({ theme }) => theme.typeScale.header6};
    line-height: 1.7rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text.tertiary};
  }
  .big-nft {
    margin-top: 1.5rem;
    height: 600px;
    width: 600px;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const First = styled.div`
  width: 80%;
  max-width: 1100px;
  display: flex;
  gap: 3rem;
`;
const Left = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  h1 {
    font-size: 3.25rem;
    span {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
  p {
    font-size: ${({ theme }) => theme.typeScale.header5};
    line-height: 1.7rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text.tertiary};
    margin-bottom: 0.5rem;
  }

  @media screen and (max-width: 1200px) {
    h1 {
      font-size: 2.5rem;
      span {
        color: ${({ theme }) => theme.colors.secondary};
      }
    }
    p {
      font-size: ${({ theme }) => theme.typeScale.header6};
      line-height: 1.7rem;
      font-weight: 500;
      color: ${({ theme }) => theme.text.tertiary};
    }
  }

  @media screen and (max-width: 1040px) {
    h1 {
      font-size: 2.25rem;
      span {
        color: ${({ theme }) => theme.colors.secondary};
      }
    }
    p {
      font-size: ${({ theme }) => theme.typeScale.paragraph};
      line-height: 1.7rem;
      font-weight: 500;
      color: ${({ theme }) => theme.text.tertiary};
    }
  }
`;

const BigNFT = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1rem;
  .inner {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0.2rem;
    img {
      height: 25px;
      width: 25px;
      background: ${({ theme }) => theme.colors.primary};
    }

    @media screen and (max-width: 1200px) {
      img {
        height: 40px;
        width: 40px;
      }
    }
    @media screen and (max-width: 1040px) {
      img {
        height: 30px;
        width: 30px;
      }
    }
  }
`;
const Right = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  img {
    height: 50px;
    width: 50px;
    background: ${({ theme }) => theme.colors.primary};
  }

  @media screen and (max-width: 1200px) {
    img {
      height: 40px;
      width: 40px;
    }
  }
  @media screen and (max-width: 1040px) {
    img {
      height: 30px;
      width: 30px;
    }
  }
`;

export default Home;
