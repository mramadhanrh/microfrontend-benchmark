import { render } from '@testing-library/react';

import DashboardModule from './dashboard-module';

describe('DashboardModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DashboardModule />);
    expect(baseElement).toBeTruthy();
  });
});
