export interface MiniRaceVehicle {
  id: string;
  emoji: string;
  flip?: boolean;
}

export interface MiniRaceLane {
  id: string;
  label: string;
  durationSeconds: number;
  phaseSeconds: number;
  mobileVisible: boolean;
  vehicles: MiniRaceVehicle[];
}

export const MINI_RACE_LANES: MiniRaceLane[] = [
  {
    id: "speed",
    label: "SPEED",
    durationSeconds: 8,
    phaseSeconds: 0.7,
    mobileVisible: true,
    vehicles: [
      {
        id: "speed-race",
        emoji: "🏎️",
      },
      {
        id: "speed-car",
        emoji: "🚗",
      },
      {
        id: "speed-moto",
        emoji: "🏍️",
        flip: true,
      },
    ],
  },
  {
    id: "city",
    label: "CITY",
    durationSeconds: 10,
    phaseSeconds: 1.2,
    mobileVisible: true,
    vehicles: [
      {
        id: "city-police",
        emoji: "🚓",
        flip: true,
      },
      {
        id: "city-taxi",
        emoji: "🚕",
        flip: true,
      },
      {
        id: "city-bus",
        emoji: "🚌",
        flip: true,
      },
      {
        id: "city-van",
        emoji: "🚐",
        flip: true,
      },
    ],
  },
  {
    id: "action",
    label: "ACTION",
    durationSeconds: 12,
    phaseSeconds: 2,
    mobileVisible: true,
    vehicles: [
      {
        id: "action-suv",
        emoji: "🚙",
        flip: true,
      },
      {
        id: "action-pickup",
        emoji: "🛻",
        flip: true,
      },
      {
        id: "action-ambulance",
        emoji: "🚑",
        flip: true,
      },
      {
        id: "action-fire",
        emoji: "🚒",
        flip: true,
      },
    ],
  },
  {
    id: "wild",
    label: "WILD",
    durationSeconds: 14,
    phaseSeconds: 2.8,
    mobileVisible: false,
    vehicles: [
      {
        id: "wild-truck",
        emoji: "🚚",
        flip: true,
      },
      {
        id: "wild-tractor",
        emoji: "🚜",
        flip: true,
      },
      {
        id: "wild-scooter",
        emoji: "🛵",
        flip: true,
      },
    ],
  },
];