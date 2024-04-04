"use client";

import { useState } from "react";
import RequirementsTable from "@/components/RequirementsTable";

export default function Home() {
  const [requirements, setRequirements] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl">Requirement Analysis Generator</h1>
      <RequirementsTable
        requirements={requirements}
        setRequirements={setRequirements}
      />
    </main>
  );
}
