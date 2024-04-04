import { useRef } from "react";

interface RequirementsTableProps {
  requirements: string[];
  setRequirements: React.Dispatch<React.SetStateAction<string[]>>;
}

const RequirementsTable = ({
  requirements,
  setRequirements,
}: RequirementsTableProps) => {
  const requirementInputRef = useRef<HTMLInputElement>(null);

  const handleAddRequirement = () => {
    const requirement = requirementInputRef.current?.value;

    if (requirement) {
      setRequirements((prevRequirements) => [...prevRequirements, requirement]);
      requirementInputRef.current.value = "";
    }
  };

  return (
    <div className="w-1/5 relative overflow-x-auto mr-12 mt-12">
      <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            >
              <td className="px-6 py-4">{requirement}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <label
          htmlFor="prompt_input"
          className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
        >
          Add a requirement here
        </label>
        <input
          type="text"
          id="requirement_input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4"
          placeholder="Type your requirement here..."
          ref={requirementInputRef}
        />
        <button
          className="bg-black text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleAddRequirement}
        >
          Add Requirement
        </button>
      </div>
    </div>
  );
};

export default RequirementsTable;
