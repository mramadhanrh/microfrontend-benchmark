import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface SupportModuleProps {}

const StyledSupportModule = styled.div`
  color: pink;
`;

export function SupportModule(props: SupportModuleProps) {
  return (
    <StyledSupportModule>
      <h1>Welcome to SupportModule!</h1>
    </StyledSupportModule>
  );
}

export default SupportModule;
