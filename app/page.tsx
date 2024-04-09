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

  const generateAnalyses = async (prompt: string[]) => {
    console.log(prompt, "<<<< PROMPT");
    const analysisPromises = prompt.map((prompt) => complete(prompt));
    const responses = await Promise.all(analysisPromises);

    return responses.map((response) => {
      if (!response)
        return JSON.stringify({
          choices: [{ message: { content: "No response" } }],
        });

      const parsedResponse = JSON.parse(response);
      return parsedResponse.choices[0].message.content;
    });
  };

  // create a generateAnalysisInParallel function that takes no arguments
  // this function iterates over the coordinates array to build the correct prompt
  // for each coordinate, it generates a prompt using the requirements array and the analyses array
  // it then calls the complete function with the prompt
  // it uses the response and the coordinate to update the analyses array
  // this function does not use promises.all instead it uses a forEach loop
  // the function should be async and return void
  // the function should be called when the generate button is clicked
  // the function should be defined outside the component
  // the function should be called generateAnalysisInParallel
  // the function should set the isLoading state to true when it starts and false when it ends
  // the function should be called when the generate button is clicked
  // the function after it sets the analysis should remove the active class from the td element that was clicked and only that specific element

  console.log(coordinates, "<<<< COORDINATES");

  const generateAnalysesInParallel = async () => {
    coordinates.forEach(async (coordinate) => {
      const requirement = requirements[coordinate.index];
      const analysis = analyses.find(
        (analysis) => analysis.title === coordinate.title
      );
      const prompt = `given the requirement ${requirement}, ${analysis?.prompt} limit the response to 35 words`;
      const response = await complete(prompt);
      const parsedResponse = JSON.parse(response);
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
        console.log(td.querySelector("div")?.textContent, "<<<< HELLO");

        if (td.querySelector("div")?.textContent === coordinate.title) {
          if (
            Array.from(td.parentElement.children).indexOf(td) ===
            coordinate.index
          ) {
            td.classList.remove("active");
          }
        }
      });
    });

    setCoordinates([]);
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const prompts = coordinates.map((coordinate) => {
        const requirement = requirements[coordinate.index];
        const analysis = analyses.find(
          (analysis) => analysis.title === coordinate.title
        );
        return `given the requirement ${requirement}, ${analysis?.prompt} limit the response to 35 words`;
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
        td.classList.remove("loading");
      });

      setCoordinates([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(analyses, "<<<< ANALYSES");

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

  // this function should first set the state of isLoading to true
  // it should then call the async function generateAnalysesInParallel
  // after the function is called it should set the isLoading state to false and the coordinates state to an empty array
  // the function should be called when the generate button is clicked
  // it should be written so that the order of events is maintained
  const handleGenerateAnalysesButtonClick = () => {
    setIsLoading(true);
    generateAnalysesInParallel();
    setIsLoading(false);
  };

  console.log(
    requirements.length,
    analyses.length,
    coordinates.length,
    isLoading,
    "<<<< REQUIREMENTS, ANALYSES, COORDINATES, ISLOADING"
  );

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
            onClick={handleGenerateAnalysesButtonClick}
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
