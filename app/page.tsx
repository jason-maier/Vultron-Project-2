"use client";

import { useEffect, useState } from "react";
import AnalysisTable from "@/components/AnalysisTable";
import RequirementsTable from "@/components/RequirementsTable";
import { useCompletion } from "ai/react";

export interface Analysis {
  title: string;
  prompt: string;
  answers: string[];
}

// given the requirement ${requirement}, ${analysis.prompt}

export default function Home() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stringsToAssign, setStringsToAssign] = useState<string[]>([]);

  const { complete } = useCompletion({
    api: "/api/completion",
  });

  const generateAnalyses = async (prompt: string[]) => {
    const response = await complete(prompt);

    if (response) {
      const parsedResponse = JSON.parse(response);
      setStringsToAssign(
        parsedResponse.choices.map((choice: any) => choice.text)
      );
      return parsedResponse.choices.map((choice: any) => choice.text);
    }
  };

  console.log(stringsToAssign, "<<<< STRINGS TO ASSIGN");

  useEffect(() => {
    const analysis = generateAnalyses([
      "Provide some good names for coffee shops",
      "Provide some good names for electronics stores",
    ]);
  }, []);

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
