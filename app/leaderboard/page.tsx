'use client';

import NavDesktop from 'components/leaderboard/NavDesktop';
import NavMobile from 'components/leaderboard/NavMobile';
import Table from 'components/leaderboard/Table';

const Leaderboard = () => {

  return (
    <main id="particles" className="w-full p-5">
      <div className="pt-20 lg:pt-0">
        <div className="flex flex-col mt-2 w-full">
          <NavDesktop />
          <NavMobile />
        </div>
        <div className="hidden md:flex">
          <div className="flex flex-col items-center font-chathura mt-9 w-full">
            <h1 className="text-8xl leading-10 font-extrabold tracking-wide">Sparkboard</h1>
            <h2 className="text-4xl mt-2 tracking-wider">Earn $SPARK by helping fund Interchain efforts!</h2>
          </div>
        </div>
        <div className="mt-6 w-full md:mt-9">
          <Table />
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
