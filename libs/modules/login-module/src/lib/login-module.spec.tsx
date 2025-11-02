import { render } from '@testing-library/react';

import LoginModule from './login-module';

describe('LoginModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginModule />);
    expect(baseElement).toBeTruthy();
  });
});
