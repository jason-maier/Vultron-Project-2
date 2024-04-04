"use client";

import { useEffect, useState } from "react";
import AnalysisTable from "@/components/AnalysisTable";
import RequirementsTable from "@/components/RequirementsTable";

export interface Analysis {
  title: string;
  prompt: string;
  answers: string[];
}

export default function Home() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis) => ({
        ...analysis,
        answers: [...analysis.answers, ""],
      }))
    );
  }, [requirements]);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl">Requirement Analysis Generator</h1>
      <div className="flex flex-row overflow-x-auto">
        <RequirementsTable
          requirements={requirements}
          setRequirements={setRequirements}
        />
        <AnalysisTable
          analyses={analyses}
          requirements={requirements}
          setAnalyses={setAnalyses}
        />
      </div>
    </main>
  );
}
