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
    <div className="w-2/3 overflow-x-auto flex flex-row">
      <div className="mt-12 flex flex-row">
        <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-48">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {analyses.map((analysis, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {analysis.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Determine the number of table rows using the length of answers */}
            {/* Iterate through analyses to get each individual analysis */}
            {requirements.map((requirement, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                {analyses.map((analysis, i) => (
                  <td
                    key={i}
                    className="px-6 py-4"
                    onClick={() =>
                      handleSelectOrUnselectCoordinate(analysis.title, index)
                    }
                  >
                    {analysis.answers[index]
                      ? analysis.answers[index]
                      : "Click to add analysis..."}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

{
  /* <AnalysisInputs
            analysis={analysis}
            index={index}
            handleUpdatePrompt={handleUpdatePrompt}
            handleUpdateTitle={handleUpdateTitle}
          /> */
}
