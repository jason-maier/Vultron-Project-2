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
        prompt: "Write your prompt here...",
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
    <div className="w-4/5 overflow-scroll flex flex-row mt-12">
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-48 table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {analyses.map((analysis, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                <input
                  value={analysis.title}
                  onChange={(e) => {
                    handleUpdateTitle(index, e.target.value);
                  }}
                />
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
          {/* Make a row of each of the prompts for the analyses */}
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {analyses.map((analysis, index) => (
              <td key={index} className="px-6 py-4">
                <textarea
                  className="border-gray-900 border rounded-lg p-2.5 w-full text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={analysis.prompt}
                  onChange={(e) => {
                    handleUpdatePrompt(index, e.target.value);
                  }}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
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
