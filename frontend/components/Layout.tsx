import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
`;
