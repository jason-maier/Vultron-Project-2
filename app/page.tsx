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
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [heights, setHeights] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);

  const { complete } = useCompletion({
    api: "/api/chat/completion",
  });

  useEffect(() => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis) => ({
        ...analysis,
        answers: [...analysis.answers, ""],
      }))
    );
  }, [requirements]);

  const generateAnalysesInParallel = async () => {
    coordinates.forEach(async (coordinate) => {
      const requirement = requirements[coordinate.index];
      const analysis = analyses.find(
        (analysis) => analysis.title === coordinate.title
      );
      const prompt = `given the requirement ${requirement}, ${analysis?.prompt} limit the response to 35 words`;
      const response = await complete(prompt);
      const parsedResponse = response ? JSON.parse(response) : {};
      const analysisAnswer = parsedResponse.choices[0].message.content;
      setAnalyses((prevAnalyses) =>
        prevAnalyses.map((prevAnalysis) =>
          prevAnalysis.title === coordinate.title
            ? {
                ...prevAnalysis,
                answers: prevAnalysis.answers.map((answer, i) =>
                  i === coordinate.index ? analysisAnswer : answer
                ),
              }
            : prevAnalysis
        )
      );

      const tds = document.querySelectorAll("td");
      tds.forEach((td) => {
        td.classList.remove("active");
        td.classList.remove("loading");
      });
    });

    setCoordinates([]);
  };

  const handleAddAnalysis = () => {
    const answerArray = requirements.map(() => "");
    setAnalyses((prevAnalyses) => [
      ...prevAnalyses,
      {
        title: `Editable Title ${prevAnalyses.length + 1}`,
        prompt: "",
        answers: answerArray,
      },
    ]);
  };

  const handleGenerateButtonClick = async () => {
    setIsLoading(true);
    await generateAnalysesInParallel();
    setIsLoading(false);
  };

  const disableGenerateButton =
    requirements.length === 0 ||
    analyses.length === 0 ||
    coordinates.length === 0 ||
    isLoading;

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">Requirement Analysis Generator</h1>
        <div className="flex flex-row">
          <button
            className="font-bold py-2 px-4 rounded ml-4 h-12 min-w-36"
            disabled={requirements.length === 0}
            onClick={handleAddAnalysis}
          >
            Add Analysis Column
          </button>
          <button
            className="font-bold ml-4 py-2 px-4 rounded flex flex-row items-center h-12 min-w-36"
            onClick={handleGenerateButtonClick}
            disabled={disableGenerateButton}
          >
            <div className={`${isLoading ? "loading" : ""} flex flex-row`}>
              {isLoading ? "Generating AI Analyses" : "Generate AI Analyses"}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-row overflow-x-auto">
        <RequirementsTable
          handleAddAnalysis={handleAddAnalysis}
          heights={heights}
          requirements={requirements}
          setRequirements={setRequirements}
        />
        <AnalysisTable
          analyses={analyses}
          coordinates={coordinates}
          heights={heights}
          isLoading={isLoading}
          requirements={requirements}
          setAnalyses={setAnalyses}
          setCoordinates={setCoordinates}
          setHeights={setHeights}
        />
      </div>
    </main>
  );
}
