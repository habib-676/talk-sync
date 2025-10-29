// Shared badges configuration used across the app
// Each badge includes a threshold (number of completed sessions)

export const BADGES = [
  {
    id: "bronze",
    name: "Bronze Speaker",
    desc: "Complete 5 sessions",
    threshold: 5,
    color: "from-yellow-300 to-orange-400",
  },
  {
    id: "silver",
    name: "Silver Speaker",
    desc: "Complete 20 sessions",
    threshold: 20,
    color: "from-slate-200 to-slate-400",
  },
  {
    id: "gold",
    name: "Gold Speaker",
    desc: "Complete 50 sessions",
    threshold: 50,
    color: "from-amber-400 to-yellow-500",
  },
];

export default BADGES;
