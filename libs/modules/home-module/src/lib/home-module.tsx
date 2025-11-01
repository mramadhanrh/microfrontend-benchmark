import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface HomeModuleProps {}

const StyledHomeModule = styled.div`
  color: pink;
`;

export const HomeModule = (props: HomeModuleProps)  => {
  return (
    <StyledHomeModule>
      <h1 className='text-3xl font-bold text-blue-600'>Welcome to HomeModule!</h1>
    </StyledHomeModule>
  );
}

export default HomeModule;
