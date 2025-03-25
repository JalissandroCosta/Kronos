// src/app/detentos/page.tsx
import { DetentosTable } from "@/components/detentos-table";

export default function DetentosPage() {
  return (
    <div className="container mx-auto py-10">
      <DetentosTable />
    </div>
  );
}