import { Screen } from "../_components/ui";

export default function AgendaLayout({ children }: LayoutProps<"/agenda">) {
  return (
    <div className="flex flex-1 flex-col bg-surface">
      <Screen tone="light">{children}</Screen>
    </div>
  );
}
