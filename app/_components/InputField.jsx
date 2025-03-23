import React from "react";

const InputField = ({ label, name, type, placeholder, icon, required }) => {
  // const  = field;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center border-2 border-[#99BC85] rounded-full overflow-hidden  ">
        <div className="p-3 bg-[#E4EFE7] text-[#99BC85] ">{icon}</div>
        <input
          type={type}
          id={name}
          name={name}
          required={required}
          className="px-4 py-2 w-full text-[#443627] font-semibold text-sm  border-none outline-none "
          placeholder={placeholder || `Enter ${label}`}
        />
      </div>
    </div>
  );
};

export default InputField;
