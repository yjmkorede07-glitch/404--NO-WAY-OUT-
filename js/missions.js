const MISSION_DATA = [
  {
    "id": "M01",
    "phase": 1,
    "title": "A City That Forgot",
    "type": "intro",
    "hours": 0.5,
    "win": "Finish the opening sequence and reach Darius's safehouse."
  },
  {
    "id": "M02",
    "phase": 1,
    "title": "404 \u2014 THEY FOUND ME",
    "type": "story",
    "hours": 0.5,
    "win": "Inspect the first 404 clue and survive the encounter."
  },
  {
    "id": "M03",
    "phase": 2,
    "title": "Back on the Street",
    "type": "core",
    "hours": 0.6,
    "win": "Reach Veyron Central, learn movement/interactions, and meet Malik."
  },
  {
    "id": "M04",
    "phase": 2,
    "title": "The Missing Name",
    "type": "investigation",
    "hours": 1.0,
    "win": "Talk to Malik and Amara, compare their information, and collect the first confirmed clue."
  },
  {
    "id": "M05",
    "phase": 3,
    "title": "Veyron Central",
    "type": "world",
    "hours": 0.7,
    "win": "Visit the bank, market, police HQ exterior, and safehouse without triggering a wanted level."
  },
  {
    "id": "M06",
    "phase": 3,
    "title": "North Hills, Quiet Money",
    "type": "investigation",
    "hours": 0.8,
    "win": "Photograph the target building and leave without being identified."
  },
  {
    "id": "M07",
    "phase": 3,
    "title": "Iron District",
    "type": "investigation",
    "hours": 0.8,
    "win": "Trace the shipment number to its industrial origin."
  },
  {
    "id": "M08",
    "phase": 3,
    "title": "The Port Doesn't Sleep",
    "type": "stealth",
    "hours": 1.0,
    "win": "Follow a container from the port to the hidden warehouse and escape unseen."
  },
  {
    "id": "M09",
    "phase": 4,
    "title": "People Remember",
    "type": "social",
    "hours": 0.8,
    "win": "Raise Malik's trust enough to unlock his workshop network."
  },
  {
    "id": "M10",
    "phase": 4,
    "title": "Amara's Rule",
    "type": "social",
    "hours": 0.8,
    "win": "Help Amara verify three independent records without lying to her."
  },
  {
    "id": "M11",
    "phase": 4,
    "title": "The Witness",
    "type": "investigation",
    "hours": 1.0,
    "win": "Find the witness, earn their trust, and obtain a description of the missing brother's last known contact."
  },
  {
    "id": "M12",
    "phase": 4,
    "title": "No One Saw Anything",
    "type": "social",
    "hours": 1.0,
    "win": "Identify which witnesses are scared, which are bribed, and which genuinely saw nothing."
  },
  {
    "id": "M13",
    "phase": 5,
    "title": "Workshop Wheels",
    "type": "vehicle",
    "hours": 0.8,
    "win": "Acquire and repair the first usable vehicle."
  },
  {
    "id": "M14",
    "phase": 5,
    "title": "Bad Tire, Worse Timing",
    "type": "vehicle",
    "hours": 0.8,
    "win": "Complete the tire-failure chase and get the vehicle to Malik's workshop."
  },
  {
    "id": "M15",
    "phase": 5,
    "title": "Night Run",
    "type": "driving",
    "hours": 1.0,
    "win": "Deliver the package across Veyron without destroying the vehicle or gaining more than 1 wanted level."
  },
  {
    "id": "M16",
    "phase": 5,
    "title": "The Driver",
    "type": "driving",
    "hours": 1.0,
    "win": "Identify the organization\u2019s professional driver by tracking routes rather than confronting them."
  },
  {
    "id": "M17",
    "phase": 6,
    "title": "A Witness Called It In",
    "type": "police",
    "hours": 1.0,
    "win": "Escape the search area before dispatch identifies Darius."
  },
  {
    "id": "M18",
    "phase": 6,
    "title": "Heat",
    "type": "police",
    "hours": 0.9,
    "win": "Reduce wanted level to zero without being arrested."
  },
  {
    "id": "M19",
    "phase": 6,
    "title": "The Warehouse Job",
    "type": "crime",
    "hours": 1.2,
    "win": "Retrieve the ledger, avoid unnecessary casualties, and escape with the evidence."
  },
  {
    "id": "M20",
    "phase": 6,
    "title": "The Cost of Being Seen",
    "type": "consequence",
    "hours": 1.0,
    "win": "Repair the damage caused by the warehouse job by clearing witnesses and restoring a damaged relationship."
  },
  {
    "id": "M21",
    "phase": 7,
    "title": "Three Angles",
    "type": "character-switch",
    "hours": 1.0,
    "win": "Complete the same investigation from Darius, Malik, and Amara's perspectives."
  },
  {
    "id": "M22",
    "phase": 7,
    "title": "False Delivery",
    "type": "heist",
    "hours": 1.3,
    "win": "Swap the marked package for the real one using the correct team member at each stage."
  },
  {
    "id": "M23",
    "phase": 7,
    "title": "The Long Chase",
    "type": "chase",
    "hours": 1.2,
    "win": "Keep the target vehicle in sight, preserve evidence, and reach the safe observation point."
  },
  {
    "id": "M24",
    "phase": 7,
    "title": "A Door That Wasn't There",
    "type": "puzzle",
    "hours": 1.0,
    "win": "Use clues from previous missions to locate the hidden entrance."
  },
  {
    "id": "M25",
    "phase": 7,
    "title": "The Empty Office",
    "type": "stealth",
    "hours": 1.2,
    "win": "Extract the encrypted files without setting off the alarm."
  },
  {
    "id": "M26",
    "phase": 8,
    "title": "First Investment",
    "type": "economy",
    "hours": 0.8,
    "win": "Purchase a legitimate income source and finish its first profitable cycle."
  },
  {
    "id": "M27",
    "phase": 8,
    "title": "Safehouse",
    "type": "property",
    "hours": 0.8,
    "win": "Acquire the first safehouse and install a secure evidence cache."
  },
  {
    "id": "M28",
    "phase": 8,
    "title": "Pressure on the Books",
    "type": "economy",
    "hours": 1.0,
    "win": "Follow suspicious transactions and identify the shell company funding the organization."
  },
  {
    "id": "M29",
    "phase": 9,
    "title": "The Brother's Trail",
    "type": "story",
    "hours": 1.2,
    "win": "Reconstruct the missing brother's final 72 hours from physical and digital clues."
  },
  {
    "id": "M30",
    "phase": 9,
    "title": "They Found Me",
    "type": "story",
    "hours": 1.2,
    "win": "Survive the coordinated attack and determine who knew Darius was investigating."
  },
  {
    "id": "M31",
    "phase": 9,
    "title": "404",
    "type": "revelation",
    "hours": 1.5,
    "win": "Connect the missing-person case, criminal network, corrupt businesses, and secret operation to the meaning of 404."
  },
  {
    "id": "M32",
    "phase": 10,
    "title": "The Choice",
    "type": "finale",
    "hours": 1.3,
    "win": "Choose which alliance and evidence route to trust before the final operation."
  },
  {
    "id": "M33",
    "phase": 10,
    "title": "No Way Out",
    "type": "finale",
    "hours": 1.5,
    "win": "Complete the final operation, keep the chosen evidence intact, and survive the escape."
  },
  {
    "id": "M34",
    "phase": 10,
    "title": "After 404",
    "type": "ending",
    "hours": 0.8,
    "win": "Finish the chosen ending and resolve the consequences for all three protagonists."
  }
];
const SIDE_ACTIVITIES = [
  "Street racing",
  "Time trials",
  "Sports",
  "Swimming",
  "Diving",
  "Parachuting",
  "Hiking",
  "Fishing",
  "Shooting ranges",
  "Driving challenges",
  "Vehicle challenges",
  "Collectibles",
  "Treasure hunting",
  "Photography",
  "Arcade activities",
  "Social activities",
  "Random events"
];
