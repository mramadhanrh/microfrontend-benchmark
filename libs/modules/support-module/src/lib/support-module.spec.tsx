import { render } from '@testing-library/react';

import SupportModule from './support-module';

describe('SupportModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SupportModule />);
    expect(baseElement).toBeTruthy();
  });
});
