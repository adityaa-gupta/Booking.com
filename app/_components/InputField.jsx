import React from 'react';

const InputField = React.forwardRef(
  ({ label, name, type, placeholder, icon, error, ...rest }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center border-2 border-[#99BC85] rounded-full overflow-hidden">
          <div className="p-3 bg-[#E4EFE7] text-[#99BC85]">{icon}</div>
          <input
            type={type}
            id={name}
            name={name}
            ref={ref}
            className="px-4 py-2 w-full text-[#443627] font-semibold text-sm border-none outline-none"
            placeholder={placeholder || `Enter ${label}`}
            {...rest}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
