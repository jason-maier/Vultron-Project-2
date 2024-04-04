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

export interface Coordinate {
  title: string;
  index: number;
}

// given the requirement ${requirement}, ${analysis.prompt}

export default function Home() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stringsToAssign, setStringsToAssign] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

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

  useEffect(() => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis) => ({
        ...analysis,
        answers: [...analysis.answers, ""],
      }))
    );
  }, [requirements]);

  const generateAnalysis = async () => {
    const prompts = coordinates.map((coordinate) => {
      const requirement = requirements[coordinate.index];
      const analysis = analyses.find(
        (analysis) => analysis.title === coordinate.title
      );
      return `given the requirement ${requirement}, ${analysis?.prompt}`;
    });

    console.log(prompts, "<<<< PROMPTS");

    const generatedAnalyses = await generateAnalyses(prompts);

    coordinates.forEach((coordinate, index) => {
      const analysis = generatedAnalyses[index];
      setAnalyses((prevAnalyses) =>
        prevAnalyses.map((prevAnalysis) =>
          prevAnalysis.title === coordinate.title
            ? {
                ...prevAnalysis,
                answers: prevAnalysis.answers.map((answer, i) =>
                  i === coordinate.index ? analysis : answer
                ),
              }
            : prevAnalysis
        )
      );
    });
  };

  console.log(coordinates, "<<<< COORDINATES");

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
          coordinates={coordinates}
          requirements={requirements}
          setAnalyses={setAnalyses}
          setCoordinates={setCoordinates}
        />
        <button onClick={generateAnalysis}>GENERATE</button>
      </div>
    </main>
  );
}
