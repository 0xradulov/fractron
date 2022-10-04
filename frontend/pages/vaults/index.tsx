import type { NextPage } from 'next';
import styled from 'styled-components';

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
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Vaults>
      </Inner>
    </Outer>
  );
};

const Vaults = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  div {
    background-color: blue;
    height: 200px;
    width: 200px;
  }
`;

const Inner = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  h1 {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
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
