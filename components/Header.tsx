import { ConnectButton } from 'web3uikit';

function Header() {
  return (
    <div className="p-2 border-b-2 flex flex-row mb-4">
      <h1 className="p-4 font-blog text-3xl">decentralized Lottery</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}

export default Header;
