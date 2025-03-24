import React from 'react';

const DropDown = ({ options, onChange, value, label }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-[#255F38] font-semibold">{label}</label>}
      <select
        className="border-2 border-[#99BC85] rounded-full px-4 py-2 text-[#255F38] font-semibold outline-none bg-[#FAF1E6] hover:bg-[#E4EFE7] transition duration-200"
        onChange={onChange}
        value={value}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
