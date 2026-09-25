import { Screen } from "../_components/ui";
import { HOME_STATES, type HomeStateKey } from "./data";
import { HomeView } from "./home-view";

// Home · o ciclo na tela inicial. `?estado=check-in` mostra o dia de check-in.
export default async function Home(props: PageProps<"/home">) {
  const { estado } = await props.searchParams;
  const key: HomeStateKey =
    typeof estado === "string" && estado in HOME_STATES
      ? (estado as HomeStateKey)
      : "alerta";

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <Screen tone="light">
        <HomeView state={HOME_STATES[key]} />
      </Screen>
    </div>
  );
}
