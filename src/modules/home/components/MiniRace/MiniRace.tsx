import "./MiniRace.css";

import type {
  CSSProperties,
} from "react";

import {
  MINI_RACE_LANES,
  type MiniRaceLane,
} from "./miniRaceConfig";

type VehicleStyle =
  CSSProperties & {
    "--race-duration": string;
    "--race-delay": string;
    "--race-static-left": string;
  };

function getVehicleStyle(
  lane: MiniRaceLane,
  vehicleIndex: number,
): VehicleStyle {
  const vehicleCount =
    lane.vehicles.length;

  const spacingSeconds =
    lane.durationSeconds /
    vehicleCount;

  const delaySeconds =
    -(
      lane.phaseSeconds +
      vehicleIndex *
        spacingSeconds
    );

  const staticLeft =
    vehicleCount <= 1
      ? 50
      : 10 +
        vehicleIndex *
          (80 /
            (vehicleCount - 1));

  return {
    "--race-duration":
      `${lane.durationSeconds}s`,
    "--race-delay":
      `${delaySeconds}s`,
    "--race-static-left":
      `${staticLeft}%`,
  };
}

export default function MiniRace() {
  return (
    <div
      className="mini-race"
      role="img"
      aria-label="Mini Race escala 1:64 con todos los vehículos avanzando de derecha a izquierda"
    >
      <div className="mini-race-header">
        <span>
          MINI RACE · 1:64
        </span>

        <small>
          PERÚ GP
        </small>
      </div>

      <div
        className="mini-race-start"
        aria-hidden="true"
      >
        🚦
      </div>

      <div
        className="mini-race-finish"
        aria-hidden="true"
      >
        🏁
      </div>

      <div
        className="mini-race-track"
        aria-hidden="true"
      >
        {MINI_RACE_LANES.map(
          (lane, laneIndex) => (
            <div
              key={lane.id}
              className={[
                "mini-race-lane",
                `mini-race-lane--${laneIndex + 1}`,
                lane.mobileVisible
                  ? ""
                  : "mini-race-lane--mobile-hidden",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="mini-race-lane-label">
                {lane.label}
              </span>

              {lane.vehicles.map(
                (
                  vehicle,
                  vehicleIndex,
                ) => (
                  <span
                    key={vehicle.id}
                    className="mini-race-vehicle"
                    style={getVehicleStyle(
                      lane,
                      vehicleIndex,
                    )}
                  >
                    <span
                      className="mini-race-vehicle-emoji mini-race-vehicle-emoji--left"
                    >
                      {vehicle.emoji}
                    </span>
                  </span>
                ),
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}