import { Analysis, Coordinate } from "@/app/page";
import { useEffect } from "react";

interface AnalysisTableProps {
  analyses: Analysis[];
  coordinates: Coordinate[];
  heights: number[];
  isLoading: boolean;
  requirements: string[];
  setAnalyses: React.Dispatch<React.SetStateAction<Analysis[]>>;
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinate[]>>;
  setHeights: React.Dispatch<React.SetStateAction<number[]>>;
}

const spinner = `<div role="status">
<svg aria-hidden="true" class="m-auto w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
<span class="sr-only">Loading...</span>
</div>`;

const AnalysisTable = ({
  analyses,
  coordinates,
  heights,
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
          td.innerHTML = spinner;
        }
      }
    });
  }, [isLoading]);

  const toggleActive = (e: React.MouseEvent<HTMLTableCellElement>) => {
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
    <div className="max-w-8xl relative overflow-x-scroll mt-12 rounded-lg">
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-48 table-fixed">
        <thead className="uppercase">
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
              style={{ height: `${heights[index]}px` }}
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
                  <div className="hidden">{analysis.title}</div>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            {analyses.map((analysis, index) => (
              <td key={index} className="prompt-section px-6">
                <label
                  htmlFor="prompt_input"
                  className="block mt-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Add Prompt
                </label>
                <textarea
                  id="prompt_input"
                  className="border rounded-lg mt-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  value={analysis.prompt}
                  onChange={(e) => {
                    handleUpdatePrompt(index, e.target.value);
                  }}
                  placeholder={`Write your prompt for ${analysis.title} here...`}
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
