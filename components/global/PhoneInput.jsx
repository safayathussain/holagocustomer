import React, { useEffect } from "react";
import phoneCountry from "@/public/data/phoneCountry.json";
import { getCountryCode } from "@/utils/functions";

const PhoneInput = ({
  label,
  id,
  name,
  type = "text",
  className,
  placeholder,
  rounded = "full",
  onChange = () => {},
  value = "",
  disabled = false,
  ...etc
}) => {
  const [countryCode, setCountryCode] = React.useState("+88"); // Default country code (for example, Bangladesh)
  const [phoneNumber, setPhoneNumber] = React.useState(value);
  useEffect(() => {
    const code = getCountryCode(phoneNumber);
    if (code) {
      setCountryCode(code);
    }
  }, []);
  useEffect(() => {
    // Combine country code and phone number and notify the parent component
    onChange(`${countryCode}${phoneNumber?.replace(countryCode, "")}`);
  }, [countryCode, phoneNumber, onChange]);

  return (
    <div>
      <div>
        <label htmlFor={id} className="block text-gray-800 font-medium text-sm">
          {label}
        </label>
        <div className="mt-0.5 flex items-center">
          <div
            className={`border border-r-0 rounded-l-full !rounded-l-${rounded} p-[8px]`}
          >
            <select
              name="code"
              id={`code-${id}`}
              className="text-sm focus:outline-none bg-[#F6F6F6] rounded-full"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={disabled}
            >
              {phoneCountry.map((item) => (
                <option key={item.shortname} value={item.phone_code}>
                  {item.shortname} ({item.phone_code})
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder={placeholder}
            id={id}
            type={type}
            name={name}
            spellCheck="false"
            className={`block w-full bg-white placeholder:text-sm md:placeholder:text-base rounded-${rounded} p-2 border-[1.5px] border-l-0 rounded-l-none border-gray-200 focus:border-gray-300 focus:outline-none focus:border-[1.5px] focus:ring-0 ${className}`}
            value={phoneNumber?.replace(countryCode, "")}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={disabled}

            {...etc}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
