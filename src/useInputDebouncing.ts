import { useState, useRef } from "react";
/**
 * A hook for inputs when a request should be triggered with debouncing in effect.
 * @returns [input, debouncedInput, onChange]
 */
export const useInputDebouncing = (): [
  string,
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void
] => {
  const currInput = useRef("");
  const [input, setInput] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.currentTarget.value;
    currInput.current = inputString;
    setInput(inputString);
    setTimeout(() => {
      if (currInput.current === inputString) {
        setDebouncedInput(inputString);
      }
    }, 300);
  };
  return [input, debouncedInput, onChange];
};