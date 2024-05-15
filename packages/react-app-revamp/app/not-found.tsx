/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export const metadata = {
  title: "Page not found - JokeRace",
  description: "JokeRace - contests for communities to run, grow, and monetize",
};

const NotFoundPage = () => {
  return (
    <div className="container m-auto sm:text-center animate-appear">
      <h1 className="text-[40px] font-black mb-3 text-primary-10 font-sabo">Page not found</h1>
      <p className="text-neutral-11 mb-6 text-[16px]">
        Sorry ! The page you are looking for was deleted or it doesn't exist.
      </p>
      <Link href="/">Go back to home page</Link>
    </div>
  );
};

export default NotFoundPage;
