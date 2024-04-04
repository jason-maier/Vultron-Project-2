import { Analysis } from "@/app/page";

interface AnalysisInputsProps {
  analysis: Analysis;
  index: number;
  handleUpdatePrompt: (index: number, prompt: string) => void;
  handleUpdateTitle: (index: number, title: string) => void;
}

const AnalysisInputs = ({
  analysis,
  index,
  handleUpdatePrompt,
  handleUpdateTitle,
}: AnalysisInputsProps) => {
  return (
    <div>
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
        onChange={(e) => {
          handleUpdatePrompt(index, e.target.value);
        }}
      ></textarea>
    </div>
  );
};
export default AnalysisInputs;
