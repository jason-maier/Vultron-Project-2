import { Analysis, Coordinate } from "@/app/page";
import { useEffect } from "react";

interface AnalysisTableProps {
  analyses: Analysis[];
  coordinates: Coordinate[];
  isLoading: boolean;
  requirements: string[];
  setAnalyses: React.Dispatch<React.SetStateAction<Analysis[]>>;
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinate[]>>;
  setHeights: React.Dispatch<React.SetStateAction<number[]>>;
}

const AnalysisTable = ({
  analyses,
  coordinates,
  isLoading,
  requirements,
  setAnalyses,
  setCoordinates,
  setHeights,
}: AnalysisTableProps) => {
  useEffect(() => {
    const trs = document.querySelectorAll(".analysis-table-row");
    const newHeights = Array.from(trs).map((tr) => tr.clientHeight);
    setHeights(newHeights);
  }, [analyses, setHeights]);

  useEffect(() => {
    const tds = document.querySelectorAll("td");

    tds.forEach((td) => {
      if (td.classList.contains("active")) {
        if (isLoading) {
          td.classList.add("loading");
        }
      }
    });
  }, [isLoading]);

  const toggleActive = (e: React.MouseEvent<HTMLTableDataCellElement>) => {
    e.currentTarget.classList.toggle("active");
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
    <div className="w-4/5 overflow-scroll mt-12">
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-48 table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {analyses.map((analysis, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                <input
                  className="border-gray-900 border rounded-lg p-2.5 w-full text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          {requirements.map((requirement, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 analysis-table-row"
            >
              {analyses.map((analysis, i) => (
                <td
                  key={i}
                  className={`${
                    analysis.answers[index]
                      ? "text-slate-500"
                      : "text-slate-300"
                  } px-6 py-4`}
                  onClick={(event) => {
                    toggleActive(event);
                    handleSelectOrUnselectCoordinate(analysis.title, index);
                  }}
                >
                  {analysis.answers[index]
                    ? analysis.answers[index]
                    : "Select to add analysis..."}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {analyses.map((analysis, index) => (
              <td key={index} className="px-6 py-4">
                <textarea
                  className="border-gray-900 border rounded-lg p-2.5 w-full text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={analysis.prompt}
                  onChange={(e) => {
                    handleUpdatePrompt(index, e.target.value);
                  }}
                  placeholder="Write your prompt here..."
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
