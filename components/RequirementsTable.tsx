import { useState } from "react";

interface RequirementsTableProps {
  handleAddAnalysis: () => void;
  heights: number[];
  requirements: string[];
  setRequirements: React.Dispatch<React.SetStateAction<string[]>>;
}

const RequirementsTable = ({
  handleAddAnalysis,
  heights,
  requirements,
  setRequirements,
}: RequirementsTableProps) => {
  const [currentRequirement, setCurrentRequirement] = useState<string>("");

  const handleAddRequirement = () => {
    if (currentRequirement.length > 0) {
      setRequirements((prevRequirements) => [
        ...prevRequirements,
        currentRequirement,
      ]);
      setCurrentRequirement("");
    }

    if (requirements.length === 0) {
      handleAddAnalysis();
    }
  };

  return (
    <div className="w-1/5 relative overflow-x-scroll mr-12 mt-12 rounded-lg">
      {requirements.length != 0 && (
        <table className="min-w-full text-sm text-left rtl:text-right">
          <thead className="uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Requirements
              </th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((requirement, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                style={{ height: `${heights[index]}px` }}
              >
                <td className="px-6 py-4">{requirement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        <label
          htmlFor="requirement_input"
          className="block mt-4 text-sm font-medium text-gray-900 dark:text-white"
        >
          Add Requirement
        </label>
        <textarea
          id="requirement_input"
          className="border rounded-lg mt-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your requirement here..."
          onChange={(e) => setCurrentRequirement(e.target.value)}
          value={currentRequirement}
        />
        <button
          className="font-bold py-2 px-4 rounded mt-4"
          disabled={currentRequirement.length === 0}
          onClick={handleAddRequirement}
        >
          Add Requirement
        </button>
      </div>
    </div>
  );
};

export default RequirementsTable;
