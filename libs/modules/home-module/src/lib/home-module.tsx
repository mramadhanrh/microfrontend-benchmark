import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface HomeModuleProps {}

const StyledHomeModule = styled.div`
  color: pink;
`;

export function HomeModule(props: HomeModuleProps) {
  return (
    <StyledHomeModule>
      <h1>Welcome to HomeModule!</h1>
    </StyledHomeModule>
  );
}

export default HomeModule;
