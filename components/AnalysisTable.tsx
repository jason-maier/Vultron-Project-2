import { Analysis, Coordinate } from "@/app/page";

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
        title: "Example Title",
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

  const handleUpdateTitle = (index: number, title: string) => {
    setAnalyses((prevAnalyses) =>
      prevAnalyses.map((analysis, i) =>
        i === index ? { ...analysis, title } : analysis
      )
    );
  };
  return (
    <>
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
    </>
  );
};

export default AnalysisTable;
