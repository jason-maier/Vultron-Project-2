"use client";

import { useEffect, useState } from "react";
import RequirementsTable from "@/components/RequirementsTable";

interface Analysis {
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

  const handleAddAnalysis = () => {
    const answerArray = requirements.map(() => "");
    setAnalyses((prevAnalyses) => [
      ...prevAnalyses,
      {
        title: "Example Title",
        prompt: "Example Prompt",
        answers: answerArray,
      },
    ]);
  };

  const handleUpdateTitle = (index: number, title: string) => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis, i) =>
        i === index ? { ...analysis, title } : analysis
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl">Requirement Analysis Generator</h1>
      <div className="flex flex-row overflow-x-auto">
        <RequirementsTable
          requirements={requirements}
          setRequirements={setRequirements}
        />
        {analyses.map((analysis, index) => (
          <div key={index} className="mt-12">
            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {analysis.title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.answers.map((answer, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 min-h-12"
                  >
                    <td className="px-6 py-4">
                      {answer.length
                        ? answer
                        : "Click to select for fill in..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label
              htmlFor="title_input"
              className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              Update your title here
            </label>
            <input
              type="text"
              id="title_input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4"
              placeholder="Type your title here..."
              value={analysis.title}
              onChange={(e) => {
                handleUpdateTitle(index, e.target.value);
              }}
            />

            <label
              htmlFor="prompt_input"
              className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              Update your prompt here
            </label>
            <textarea
              id="prompt_input"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type your prompt here..."
              value={analysis.prompt}
            ></textarea>
          </div>
        ))}
        <button
          className="bg-black text-white font-bold py-2 px-4 rounded ml-4 mt-12 h-12"
          onClick={handleAddAnalysis}
        >
          Add Analysis
        </button>
      </div>
    </main>
  );
}
