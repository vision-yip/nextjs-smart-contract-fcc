import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    Moralis.onAccountChanged((_account) => {
      console.log(`changed account to ${_account}`);
      if (_account === null) {
        window.localStorage.removeItem('connected');
        deactivateWeb3();
        console.log('deactive account');
      }
    });
  }, []);

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('connected')) {
        enableWeb3();
      }
    }
    console.log(isWeb3Enabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled]);

  const Connect = async () => {
    await enableWeb3();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('connected', 'injected');
    }
  };
  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <button onClick={Connect} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </div>
  );
}

export default ManualHeader;
