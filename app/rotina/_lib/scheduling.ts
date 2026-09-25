import { overlaps, type Slot } from "./data";
export type Busy = Slot & { title: string };
export function suggestSlots({
  duration,
  split,
  deadlineDay,
  deadlineTime,
  busy,
  hours,
  maxHours,
  shutdown,
  lightDay,
  startDay = 2,
}: {
  duration: number;
  split: boolean;
  deadlineDay: number;
  deadlineTime: number;
  busy: Busy[];
  hours: number[];
  maxHours: number;
  shutdown: number;
  lightDay: number;
  startDay?: number;
}): Slot[] {
  const count = split ? Math.ceil(duration / 90) : 1;
  const size = duration / count;
  const slots: Slot[] = [];
  const loads = [...hours];
  // Nenhuma sugestão ultrapassa 1h30; uma tarefa maior precisa ser dividida.
  if (size > 90 || size <= 0) return [];
  for (let day = startDay; day <= deadlineDay && slots.length < count; day++) {
    if (day === lightDay) continue;
    for (
      let start = day === startDay ? 960 : 780;
      start + size <=
      Math.min(shutdown, 1380, day === deadlineDay ? deadlineTime : 1440);
      start += 30
    ) {
      const candidate = { day, start, end: start + size };
      if (loads[day] + size / 60 > maxHours) break;
      if (
        busy.some((b) => overlaps(candidate, b)) ||
        slots.some((b) =>
          overlaps(
            { ...candidate, start: start - 10, end: candidate.end + 10 },
            b,
          ),
        )
      )
        continue;
      slots.push(candidate);
      loads[day] += size / 60;
      if (slots.length === count) break;
    }
  }
  return slots.length === count ? slots : [];
}
