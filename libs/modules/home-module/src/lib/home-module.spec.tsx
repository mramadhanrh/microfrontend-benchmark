import { render } from '@testing-library/react';

import HomeModule from './home-module';

describe('HomeModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeModule />);
    expect(baseElement).toBeTruthy();
  });
});
