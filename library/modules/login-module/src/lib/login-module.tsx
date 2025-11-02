import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface LoginModuleProps {}

const StyledLoginModule = styled.div`
  color: pink;
`;

export function LoginModule(props: LoginModuleProps) {
  return (
    <StyledLoginModule>
      <h1>Welcome to LoginModule!</h1>
    </StyledLoginModule>
  );
}

export default LoginModule;
