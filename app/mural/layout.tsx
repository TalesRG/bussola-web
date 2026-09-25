import { Screen } from "../_components/ui";
import { MuralProvider } from "./_lib/state";

export default function Layout({ children }: LayoutProps<"/mural">) {
  return (
    <Screen tone="light">
      <MuralProvider>{children}</MuralProvider>
    </Screen>
  );
}
