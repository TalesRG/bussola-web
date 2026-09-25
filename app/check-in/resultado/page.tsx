import type { Level } from "@/app/home/data";
import { EXAMPLES } from "../_lib/quiz";
import { ResultView } from "./result-view";

// Q05–Q07 · Resultado. `?exemplo=leves|alerta|fortes` mostra os exemplos do Figma.
export default async function Resultado(props: PageProps<"/check-in/resultado">) {
  const { exemplo } = await props.searchParams;
  const example =
    typeof exemplo === "string" && exemplo in EXAMPLES ? (exemplo as Level) : undefined;

  return <ResultView example={example} />;
}
