/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS para carregar as funções TypeScript no runner nativo. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
// Executa as funções puras do app sem adicionar um runner ao projeto.
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
};
const { suggestSlots } = require("../app/rotina/_lib/scheduling.ts");
const {
  parseAppointment,
  overlaps,
  plannedHours,
  INITIAL_ENTRIES,
  REPORT_RESERVATION,
} = require("../app/rotina/_lib/data.ts");
const defaults = {
  duration: 180,
  split: true,
  deadlineDay: 4,
  deadlineTime: 1380,
  busy: [],
  hours: [0, 0, 0, 0, 0, 0, 0],
  maxHours: 5,
  shutdown: 1380,
  lightDay: 5,
};
test("sugestões respeitam conflitos, pausas, duração, prazo e limite diário", () => {
  const busy = [{ day: 2, start: 960, end: 1080, title: "Estágio" }];
  const slots = suggestSlots({ ...defaults, busy });
  assert.equal(
    slots.reduce((s, b) => s + b.end - b.start, 0),
    180,
  );
  for (const slot of slots) {
    assert.ok(slot.end - slot.start <= 90);
    assert.ok(slot.end <= 1380);
    assert.ok(!busy.some((b) => overlaps(slot, b)));
  }
  for (let i = 1; i < slots.length; i++)
    if (slots[i].day === slots[i - 1].day)
      assert.ok(slots[i].start - slots[i - 1].end >= 10);
  assert.deepEqual(
    suggestSlots({ ...defaults, hours: [5, 5, 5, 5, 5, 5, 5] }),
    [],
  );
  assert.deepEqual(
    suggestSlots({ ...defaults, deadlineDay: 2, deadlineTime: 970 }),
    [],
  );
  assert.deepEqual(
    suggestSlots({ ...defaults, deadlineDay: 2, lightDay: 2 }),
    [],
  );
  assert.deepEqual(suggestSlots({ ...defaults, split: false }), []);
});
test("parser reconhece dias, horários, recorrência e campos ausentes", () => {
  assert.deepEqual(parseAppointment("Dentista quinta às 15h"), {
    title: "Dentista",
    day: 3,
    start: 900,
    repeat: false,
    type: "Pessoal",
  });
  assert.equal(parseAppointment("Reunião do PET toda terça 19h").repeat, true);
  assert.equal(parseAppointment("estudar física sábado de manhã").start, 540);
  assert.equal(parseAppointment("Dentista").day, null);
  assert.equal(parseAppointment("Dentista").start, null);
});
test("confirmar reserva não duplica horas, desfazer restitui a estimativa", () => {
  const before = plannedHours(INITIAL_ENTRIES);
  const confirmed = [
    ...INITIAL_ENTRIES,
    ...[2, 3].map((day) => ({
      day,
      start: 1200,
      end: 1260,
      id: String(day),
      batch: "batch",
      reservationId: REPORT_RESERVATION.id,
      kind: "study",
      title: "Relatório",
      detail: "",
    })),
  ];
  assert.deepEqual(plannedHours(confirmed), before);
  assert.deepEqual(
    plannedHours(confirmed.filter((e) => e.batch !== "batch")),
    before,
  );
});
