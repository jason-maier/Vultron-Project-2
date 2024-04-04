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

export default function Home() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  const { complete } = useCompletion({
    api: "/api/completion",
  });

  useEffect(() => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis) => ({
        ...analysis,
        answers: [...analysis.answers, ""],
      }))
    );
  }, [requirements]);

  const generateAnalyses = async (prompt: string[]) => {
    // TODO: Fix this type
    const response = await complete(prompt as unknown as string);

    if (response) {
      const parsedResponse = JSON.parse(response);
      return parsedResponse.choices.map((choice: any) => choice.text);
    }
  };

  const generateAnalysis = async () => {
    const prompts = coordinates.map((coordinate) => {
      const requirement = requirements[coordinate.index];
      const analysis = analyses.find(
        (analysis) => analysis.title === coordinate.title
      );
      return `given the requirement ${requirement}, ${analysis?.prompt} limit to 25 words`;
    });

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

    const tds = document.querySelectorAll("td");
    tds.forEach((td) => {
      td.classList.remove("active");
    });

    setCoordinates([]);
  };

  const handleAddAnalysis = () => {
    const answerArray = requirements.map(() => "");
    setAnalyses((prevAnalyses) => [
      ...prevAnalyses,
      {
        title: `Example Title ${prevAnalyses.length + 1}`,
        prompt: "Write your prompt here...",
        answers: answerArray,
      },
    ]);
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="flex flex-row">
        <h1 className="text-3xl">Requirement Analysis Generator</h1>
        <button
          className="bg-black text-white font-bold ml-4 py-2 px-4 rounded flex flex-row items-center h-12 min-w-36"
          onClick={generateAnalysis}
        >
          Generate AI Analyses
          <svg
            className="w-6 h-6 text-white ml-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"
            />
          </svg>
        </button>
        <button
          className="bg-black text-white font-bold py-2 px-4 rounded ml-4 h-12 min-w-36"
          onClick={handleAddAnalysis}
        >
          Add Analysis
        </button>
      </div>
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
      </div>
    </main>
  );
}
