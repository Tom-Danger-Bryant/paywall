import React from 'react';
import { render } from '@testing-library/react';
import withTurnkey  from '../withTurnkey'
import { useTurnkey } from '@turnkey/sdk-react';

jest.mock('@turnkey/sdk-react', () => ({
  useTurnkey: () => ({
    turnkey: { someKey: 'someValue' }, // Dummy turnkey object
    authIframeClient: { someClientKey: 'someClientValue' } // Dummy authIframeClient object
  })
}));

const MockComponent = ({ turnkey, authIframeClient }: any) => (
  <div>
    Wrapped Component
    <div data-testid="turnkey">{JSON.stringify(turnkey)}</div>
    <div data-testid="authIframeClient">{JSON.stringify(authIframeClient)}</div>
  </div>
);

describe('withTurnkey HOC', () => {
  it('passes turnkey and authIframeClient props to the wrapped component', () => {
    // Step 3: Wrap the Dummy Component
    const WrappedComponent = withTurnkey(MockComponent);

    // Step 4: Render the Wrapped Component
    const { getByTestId } = render(<WrappedComponent />);

    // Step 5: Assertions
    expect(getByTestId('turnkey').textContent).toBe(JSON.stringify({ someKey: 'someValue' }));
    expect(getByTestId('authIframeClient').textContent).toBe(JSON.stringify({ someClientKey: 'someClientValue' }));
  });
});