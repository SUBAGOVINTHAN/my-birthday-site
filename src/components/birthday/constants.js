// Shared constants for the Birthday Quest experience.
// EDIT THESE:
//  - CORRECT_PASSWORD (below)
//  - Every "[bracket]" placeholder text
//  - WISHES array, LETTER_TEXT, category captions
//  - Replace dummy photo boxes with real <img> tags in the screen files
//  - Add his favorite song file where marked (screens/CategoriesScreen.jsx)

export const CORRECT_PASSWORD = "iloveyou"; // change this! case-insensitive

// Order of steps in the quest. Each id maps to the route /quest/:id
export const ORDER = [
  "gift",
  "password",
  "message",
  "game",
  "cake",
  "categories",
  "balloons",
  "puzzle",
  "scratch",
  "letter",
];

export const COLORS = {
  cream: "#fbf1e2",
  creamDeep: "#f0dcbc",
  rust: "#8b2c1f",
  rustSoft: "#c1442e",
  brown: "#4a2c1c",
  brownSoft: "#8a5d3f",
  sage: "#6b9270",
  gold: "#c68a3d",
  line: "rgba(94,70,50,0.15)",
};

export const WISHES = [
  "you make ordinary days feel special",
  "I'm so proud of who you are",
  "here's to more adventures together",
  "you're my favorite person",
  "thank you for loving me the way you do",
  "this year is going to be your best one yet",
];

export const BALLOON_COLORS = [
  COLORS.rust,
  COLORS.rustSoft,
  COLORS.sage,
  COLORS.gold,
  "#b5716a",
  "#7c8f6f",
];

export const PUZZLE_EMOJIS = ["🎂", "🎁", "💌", "🌸", "✨", "🎈"];

export const LETTER_TEXT = `Happy Birthday Papu,

Happy Birthday to my love!

On your special day, I just want to wish you a life full of happiness, success, peace, and everything your heart wishes for. I hope every dream you have comes true, and I hope I get to be beside you through all of it.

You deserve all the happiness in this world, papu. ❤️ And no matter where life takes us, I always want to see you happy, smiling, and achieving everything you dream of.

I still remember the very first time I noticed you. It wasn't your face that caught my attention first…it was your voice 😂

You were comparing in our college auditorium. When I heard your voice, I thought, “Cha… not bad, our college boys are actually comparing like this!” 😂 At that time, I never imagined that the same voice would one day become so special to me.

Then, another day in the auditorium, I was sitting next to Afrose. She told me to say Hi to you. Before I could even think about what to do, you suddenly said Hi And I immediately looked down. 😂❤️

And that's how our story started.

That same evening, you sent me an Instagram request. And then came our very first message… you said,Hope you don't block me 😂 and i replied, I also hope u r a good person.

Who would have thought that such a small conversation would eventually become such a beautiful part of our lives? ❤️

Little by little, we started talking… laughing… teasing each other… fighting… and somewhere between all those little moments, you became one of the most important people in my life.

Sometimes I still wonder how someone who was once just a voice in our college auditorium became my favourite person, my comfort, my happiness, and also my biggest headache at the same time. 😂❤️

The distance between us is much shorter than the distance between me and the moon. Yet, I can see the moon… but somehow, I still can't see you.🥺❤️

No matter how crazy I behave sometimes, you always know how to control me. 😂❤️

These two years haven't always been easy. We've had so many fights, misunderstandings, anger, tears, and difficult moments. But after everything, *our love is still continuing.* ❤️

And that's what makes it so special to me.

Our relationship isn't perfect, and neither are we. But somehow, when we're together, everything feels right.

No matter how many fights we have or how angry we get, somehow we always find our way back to each other. And I think that's the most beautiful thing about our love. ❤️

I want this love to continue *until my last breath.* No matter what problems come our way, no matter how difficult life gets, I want us to end up together.

I want to create so many more memories with you. I want to travel with you, laugh with you, fight with you, annoy you, make you smile, and spend so many more beautiful moments together. 😂❤️

And finally…

*Please come and take me with you soon.* 🥺❤️
I've been waiting for you for so long.

I don't just want you on my birthdays or on special days. I want you every year, every phase of my life, until my last breath.❤️

Once again, *Happy Birthday, my love.* 🎂❤️

Thank you for coming into my life.
Thank you for staying.
And most importantly…

*Thank you for being you.* 🫶🏻

I may not always know how to express everything I feel, but one thing will always remain the same…

*I love you more than words can ever explain. ❤️*

With love,
[suba] ♡`;

// Each memory now points at a real photo in /public/images/.
// `image` is the path served from the public folder — keep the
// leading slash. `caption` shows under the photo, same as before.
export const MEMORY_SLIDES = [
  { image: "/images/memory-1.jpg", caption: "little you, before I knew you ♡" },
  { image: "/images/memory-2.jpg", caption: "chasing the sky, always reaching higher" },
  { image: "/images/memory-3.jpg", caption: "graduation day — so proud of you" },
  { image: "/images/memory-4.jpg", caption: "just you, being effortlessly you" },
];

export const PUZZLE_REVEAL_MESSAGE = "this year is going to be your best one yet 🤍";

export const CATEGORIES = [
  { id: "childhood", label: "Memories", caption: "[From 2002-2026]" },
  // { id: "family", label: "family", caption: "[a line about his college days]" },
  // { id: "friends", label: "friends", caption: "[a line about him at work]" },
  //  { id: "us", label: "us", caption: "[a line about him at work]" },
  // { id: "song", label: "Fav Song", caption: null },
];

export function nextBirthday() {
  const now = new Date();
  const y = now.getFullYear();
  let t = new Date(y, 8, 10, 0, 0, 0); // Sep 10
  if (t < now) t = new Date(y + 1, 8, 10, 0, 0, 0);
  return t;
}