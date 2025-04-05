import { useClock } from "@/hooks/useClock";

export default function Header() {
  const time = useClock();

  return (
    <header className="flex justify-between items-center px-5 pt-4 bg-transparent">
      <h1 className="text-primary text-6xl font-bold">BeaverPanel</h1>
      <div className="text-primary text-6xl font-bold font-extrabold">{time}</div>
    </header>
  );
}
