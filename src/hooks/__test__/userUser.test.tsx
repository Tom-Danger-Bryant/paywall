import { renderHook } from '@testing-library/react-hooks';
import useUser from '../useUser';
import { useTurnkey } from '@turnkey/sdk-react';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const getCurrentUserMock = jest.fn();

jest.mock('@turnkey/sdk-react', () => ({
  useTurnkey: () => ({
    turnkey: {
      getCurrentUser:getCurrentUserMock,
      logoutUser: jest.fn(),
      currentUserSession: jest.fn(),
    },
    authIframeClient: {
      injectCredentialBundle: jest.fn(),
      login: jest.fn(),
    },
    getActiveClient: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({ 
    usePathname : jest.fn(),
    useRouter: jest.fn(),
    useSearchParams : jest.fn(),
})
);

describe('useUser hook', () => {
  
  it('initially has currentUser as null', async () => {
    const { result } = renderHook(() => useUser());
    expect(result.current.currentUser).toBeNull();
    expect(getCurrentUserMock).toHaveBeenCalled();
  });



});