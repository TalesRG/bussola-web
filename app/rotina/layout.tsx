import { Screen } from "../_components/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Screen tone="light">{children}</Screen>;
}
