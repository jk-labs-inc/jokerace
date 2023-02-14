import { useState, useEffect } from "react"

const FUN_FACTS = [
  "Jokerace is building its own treasury, with winning entries minted as NFTs.",
  "If you vote on the winning rank, you'll win more $JOKE, proportionate to your votes.",
  "If you submit the winning joke, it will be minted as an NFT with 20% going to the joke creator, 20% to charity, and 60% to Jokedao.",
  "Jokedao is a revolutionary platform that puts the power of decision-making in the hands of the community!",
  "No more waiting for a central team to propose ideas - with Jokedao, communities can vote on their own ideas!",
  "Jokedao is the real deal when it comes to decentralized governance!",
  "With Jokedao, the possibilities are endless! You can use it for grants, endorsements, bounties, user-generated roadmaps, idea generation, curation, contests, and even giveaways!",
  "If you're a content creator, imagine having your fans submit and vote on the content they want you to create - that's Jokedao!",
  "Jokedao is the parent company, while Jokerace is a contest held on Jokedao's platform.",
  "$JOKE is the token of Jokedao, while joke NFTs are the tokens of Jokerace.",
  "Want to get your hands on $JOKE? Try playing the Jokerace or find it on http://app.uniswap.org by entering the token address!",
  "With Jokedao and Jokerace, the future of community building and decision-making is in your hands!",
  "Get ready to laugh, learn, and earn with Jokedao and Jokerace!",
  "Jokedao: making decision-making a laughing matter!",
  "Step up, take control, and join the joke-tastic world of Jokedao!",
  "In the world of Jokedao and Jokerace, every vote counts!",
  "Discover a world of endless possibilities with Jokedao!",
  "Bring a smile to the world of decentralized governance with Jokedao!",
  "Get ready to make some jokes, have some fun, and make some serious decisions with Jokedao!",
  "Get ready to become a laugh king with $JOKE, giving you the power to rule over jokeraces, bring new ideas to the table, and manage the treasury with a swipe of your finger!",
  "JokeDAO's on-chain governance is a novel approach to community-building and decentralized decision-making.",
  "JokeDAO allows fans to submit and vote on the content they want their favorite content creators to make.",

]

export default function FunFact() {
  const [randomFact, setRandomFact] = useState(FUN_FACTS[0])
  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * FUN_FACTS.length)
    setRandomFact(FUN_FACTS[randomIndex])
  }

  useEffect(() => {
    getRandomFact()
  }, [])

  return (
    <div className="flex flex-col text-center items-center mt-5">
      <div className="text-xs text-neutral-10">
        Here is some fun fact!
      </div>
      <div className="text-xs max-w-screen-2xs text-neutral-12">
        {randomFact}
      </div>
    </div>
  )
}
