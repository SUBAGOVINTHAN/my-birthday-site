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

export const LETTER_TEXT = `My dearest Khalifa,

I wanted this last page to feel like I was writing it in front of you,
one word at a time — because that's how I want you to read it. Slowly.

[Write your birthday message here. Talk about what he means to you,
what you're grateful for, an inside joke, anything you want him to
carry with him this year.]

Here's to another year of us.

Yours always,
[your name] ♡`;

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