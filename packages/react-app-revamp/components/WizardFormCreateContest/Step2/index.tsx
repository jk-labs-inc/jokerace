import Form from "./Form";
export const Step2 = () => {
  return (
    <>
      <div className="tracking-wide pb-5">
        <h2 className="sr-only">Step 2: Mint a token</h2>
        <p className="font-bold text-lg mb-3">Let’s start by minting a token your community will use to vote.</p>
        <p className="text-neutral-11 text-xs">
          You can use your own, but it needs to be compatible with our contest contracts, so we *strongly* recommend
          minting it here.
        </p>
      </div>

      <Form />
    </>
  );
};

export default Step2;
