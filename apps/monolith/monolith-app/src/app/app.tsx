import '../styles.css';

import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { HomeModule } from '@mfe-benchmark/home-module';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <HomeModule />
    </StyledApp>
  );
}

export default App;
