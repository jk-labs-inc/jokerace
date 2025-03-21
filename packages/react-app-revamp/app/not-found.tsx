"use client";

export const metadata = {
  title: "Page not found - JokeRace",
  description: "JokeRace - contests for communities to run, grow, and monetize",
};

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container m-auto sm:text-center animate-appear">
      <h1 className="text-[40px] font-black mb-3 text-neutral-11 font-sabo">Page not found</h1>
      <p className="text-neutral-11 mb-6 text-[16px]">
        sorry! the page you are looking for was deleted or it doesn't exist.
      </p>
      <button
        onClick={handleGoBack}
        className="px-4 py-2 bg-neutral-10 text-neutral-1 rounded-md hover:bg-neutral-11 transition-colors"
      >
        go back
      </button>
    </div>
  );
};

export default NotFoundPage;
