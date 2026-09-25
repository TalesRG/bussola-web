import { Screen } from "../_components/ui";

export default function Layout({ children }: LayoutProps<"/check-in">) {
  return (
    <div className="flex flex-1 flex-col bg-surface">
      <Screen tone="light">{children}</Screen>
    </div>
  );
}
