import type { ServerBoundary } from "@/types/boundary";

export function BoundaryList({
  boundaries,
}: {
  boundaries: readonly ServerBoundary[];
}) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {boundaries.map((boundary) => (
        <li key={boundary.id} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
          <span className="font-medium">{boundary.id}</span>
          <span className="text-muted">{boundary.purpose}</span>
        </li>
      ))}
    </ul>
  );
}
