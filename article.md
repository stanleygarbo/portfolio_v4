1. It all started in early July, I was freelancing as a web developer building this e-commerce website and I was paid very lowly for it. $200 for a month of working on that e-commerce website. That was the very first project that I landed too, at first I was excited but as time went by, it felt like I was being overworked in exchange for very little compensation. Then me and a friend were having a conversation over messenger and she talked about how she might drop out and just play this play-to-earn blockchain game. at Hearing this I was intrigued, a game where you can make money by just playing it. I thought about it for a while and wondered how this game worked, so I did some research. There was one video I found, he talked about how you can invest in the game (buy some playable assets/NFTs) and become a "manager" to then hire "scholars" which will play the game using the assets you bought and earn rewards where then you both can split the rewards and convert them to real money. At some point on the video the guy talked about this one simple tool that helps you keep track of the earnings of your "scholars". As I saw the tool I thought to myself "ooh, I can develop something a little prettier than that" and so I did. If there is one thing that I've learned in my life, and I've heard it over and over again from tech youtubers and my programming instructor, it's to create a solution for a specific community. Be a big fish in a small pond.
2. When I developed my tracking website, I kept taking a look at the tool and wondered how I can make mine better so I can gain users. One of the issues that I found with the tool (or just for me atleast) was the very basic user interface. Now I'm not a UI/UX expert but I can definitely say it was not very pretty. At that time, there were a lot of people getting their crypto wallets hacked, and so the community was getting wary of using these third party tracking tools. So i had to find ways in order to get the communty members' trust. In order for the "managers" to be able to track the earnings of their "scholars" they need to enter the name of the particular scholar and wallet address to add. With these entered, the earnings, PVP ranking and daily statistics of the "scholar" should be rendered in a table. Now normally your way to implement this would be to add some form of authentication and insert each row of "scholars" to a table that has a foreign key linked to the unique id of the "manager". But then again these "managers" have trust issues and are worried of being hacked. However we can just add passwordless login through sending magic links to the manager's email upon logging in or signing up, that way we dont have to store hashed passwords. Problem solved! Unfortunately I didn't know how to do that back then. So my solution was to not have some form of authentication and just save the list of scholars on the browser's local storage. The downside of this approach was that the data could not be persisted across devices of the same user.

---

In the explosion of interest in cryptocurrencies in 2020-2021, combined with the COVID-19 pandemic keeping the majority of people indoors and unemployed, blockchain games became quite popular in the Philippines as it allowed people to earn real money while playing a game.