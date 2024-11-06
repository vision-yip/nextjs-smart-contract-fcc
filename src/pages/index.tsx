import Head from 'next/head';
// import ManualHeader from '../../components/ManualHeader';
import Header from '../../components/Header';
import LotteryEntrance from '../../components/LotteryEntrance';

export default function Page() {
  return (
    <div className="px-8">
      <Head>
        <title>smart contract lottly</title>
        <meta name="description" content="smart contract lottly" />
      </Head>
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
    </div>
  );
}
