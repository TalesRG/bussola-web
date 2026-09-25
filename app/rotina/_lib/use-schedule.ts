"use client";
import { useAppState } from "../../_lib/state";
import { GRID_HOURS } from "../../agenda/_lib/data";
import { useRoutine } from "./state";
import { plannedHours } from "./data";
import type { Busy } from "./scheduling";
export function useSchedule() {
  const { rhythm, cells, classCells, answers } = useAppState();
  const { routine, setRoutine } = useRoutine();
  const busy: Busy[] = routine.entries
    .filter((e) => e.end > e.start)
    .map((e) => ({ ...e }));
  for (const [key, title] of Object.entries(cells)) {
    const [day, row] = key.split("-").map(Number);
    if (title)
      busy.push({
        day,
        start: GRID_HOURS[row] * 60,
        end: (GRID_HOURS[row] + (title === "Trajeto" ? 1 : 2)) * 60,
        title,
      });
  }
  for (const key of classCells) {
    const [day, row] = key.split("-").map(Number);
    busy.push({
      day,
      start: GRID_HOURS[row] * 60,
      end: (GRID_HOURS[row] + 2) * 60,
      title: "Aula",
    });
  }
  const hours = plannedHours(routine.entries);
  return { busy, hours, rhythm, answers, routine, setRoutine };
}
