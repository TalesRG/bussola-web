import { notFound } from "next/navigation";
import { QUESTIONS } from "../_lib/quiz";
import { QuestionView } from "./question-view";

// Q02–Q04 · Perguntas do check-in (/check-in/1 … /check-in/10)
export default async function Pergunta(props: PageProps<"/check-in/[pergunta]">) {
  const { pergunta } = await props.params;
  const number = Number(pergunta);
  if (!Number.isInteger(number) || number < 1 || number > QUESTIONS.length) notFound();

  return <QuestionView index={number - 1} />;
}
