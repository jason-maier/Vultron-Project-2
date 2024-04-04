import { Analysis, Coordinate } from "@/app/page";
import AnalysisInputs from "./AnalysisInputs";

interface AnalysisTableProps {
  analyses: Analysis[];
  coordinates: Coordinate[];
  requirements: string[];
  setAnalyses: React.Dispatch<React.SetStateAction<Analysis[]>>;
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinate[]>>;
}

const AnalysisTable = ({
  analyses,
  coordinates,
  requirements,
  setAnalyses,
  setCoordinates,
}: AnalysisTableProps) => {
  const handleAddAnalysis = () => {
    const answerArray = requirements.map(() => "");
    setAnalyses((prevAnalyses) => [
      ...prevAnalyses,
      {
        title: `Example Title ${prevAnalyses.length + 1}`,
        prompt: "Example Prompt",
        answers: answerArray,
      },
    ]);
  };

  const handleSelectOrUnselectCoordinate = (title: string, index: number) => {
    const coordinate = { title, index };
    if (
      coordinates.some(
        (existingCoordinate) =>
          existingCoordinate.title === title &&
          existingCoordinate.index === index
      )
    ) {
      setCoordinates((prevCoordinates) =>
        prevCoordinates.filter(
          (existingCoordinate) =>
            existingCoordinate.title !== title ||
            existingCoordinate.index !== index
        )
      );
    } else {
      setCoordinates((prevCoordinates) => [...prevCoordinates, coordinate]);
    }
  };

  const handleUpdatePrompt = (index: number, prompt: string) => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis, i) =>
        i === index ? { ...analysis, prompt } : analysis
      )
    );
  };

  const handleUpdateTitle = (index: number, title: string) => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis, i) =>
        i === index ? { ...analysis, title } : analysis
      )
    );
  };
  return (
    <div className="flex flex-row w-1/5">
      {analyses.map((analysis, index) => (
        <div key={index} className="mt-12">
          <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-48">
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
                  <td
                    className="px-6 py-4"
                    onClick={() =>
                      handleSelectOrUnselectCoordinate(analysis.title, index)
                    }
                  >
                    {answer.length ? answer : "Click to select for fill in..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AnalysisInputs
            analysis={analysis}
            index={index}
            handleUpdatePrompt={handleUpdatePrompt}
            handleUpdateTitle={handleUpdateTitle}
          />
        </div>
      ))}
      <button
        className="bg-black text-white font-bold py-2 px-4 rounded ml-4 mt-12 h-12 min-w-36"
        onClick={handleAddAnalysis}
      >
        Add Analysis
      </button>
    </div>
  );
};

export default AnalysisTable;
