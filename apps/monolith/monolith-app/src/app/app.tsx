import '../styles.css';

import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { HomeModule } from '@mfe-benchmark/home-module';
import { LoginModule } from '@mfe-benchmark/login-module';
import { DashboardModule } from '@mfe-benchmark/dashboard-module';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      {/* <HomeModule /> */}
      {/* <LoginModule /> */}
      <DashboardModule />
    </StyledApp>
  );
}

export default App;
