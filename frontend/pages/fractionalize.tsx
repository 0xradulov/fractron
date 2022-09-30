import type { NextPage } from 'next';
import styled from 'styled-components';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { BiChevronRight } from 'react-icons/bi';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';

const Home: NextPage = () => {
  const [currentStage, setCurrentStage] = useState('select');
  const { register, handleSubmit, watch, formState } = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
  };
  return (
    <Outer>
      <div className="wrapper">
        <ProgressBar>
          <div className="navigate">
            <FaLongArrowAltLeft />
          </div>
          <div className="state">
            <Stage isActive={currentStage == 'select'}>
              <p>Select your NFT</p>
            </Stage>
            <BiChevronRight />
            <Stage isActive={currentStage == 'fractionalize'}>
              <p>Fractionalize NFT</p>
            </Stage>
          </div>
          <div className="navigate">
            <FaLongArrowAltRight />
          </div>
        </ProgressBar>
        <Content>
          <Left>
            <h1>
              Select your NFT to <span>Fractionalize</span>
            </h1>
            <p>
              Choose the NFT(s) to send to a new vault, select your desired
              fraction type, set your vault&apos;s details, then continue to
              fractionalize. Once complete, all fractions will appear in your
              wallet. Be aware, you cannot add to the NFTs in a vault once
              created. Read our guides for more information.
            </p>
            <input placeholder="search your NFTs..." />
          </Left>
          <Right>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <p className="header">Vault details</p>

              <div className="single">
                <label>Vault Name:</label>
                <input
                  className="name"
                  placeholder="e.g BAYCTRONV"
                  {...register('name', { required: true })}
                />
              </div>
              <Double>
                <div>
                  <label>Token supply:</label>
                  <input
                    placeholder="e.g 10000"
                    {...register('supply', { required: true })}
                  />
                </div>

                <div>
                  <label>Token symbol:</label>
                  <input
                    placeholder="e.g BAYT"
                    {...register('symbol', { required: true })}
                  />
                </div>
              </Double>
              {formState.errors.resolutionSource && (
                <span>This field is required</span>
              )}
              <Button type="submit">Continue</Button>
            </StyledForm>
          </Right>
        </Content>
      </div>
    </Outer>
  );
};

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

const Double = styled.div`
  display: flex;
  gap: 1rem;
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledForm = styled.form`
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

  label {
    opacity: 0.8;
    font-size: 14px;
    font-weight: 500;
  }
`;

const Right = styled.div`
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
  width: 80%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
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
