import { OutputData } from "@/types/output";
import { useEffect, useState } from "react";

interface Props {
  errorHighlighting: boolean;
  aggressiveErrorHighlighting: boolean;
  output: OutputData;
}

const Console = ({errorHighlighting, aggressiveErrorHighlighting, output}: Props) => {
  const errorsRegEx = [
    /Traceback \(most recent call last\):/,
    /File ".*", line .*/,
    /.*Error: .*/,
  ]; // we have to use regex because the json stderr stuff from python is a bit weird (only one line is marked as an error etc...)
  const [isSetup, setIsSetup] = useState(window.setup);
  const handleLoad = () => {
    setIsSetup(true);
  };
  useEffect(() => {
    window.addEventListener("pyodideLoad", handleLoad)
    return () => {
      window.removeEventListener("pyodideLoad", handleLoad);
    }
  }, []);
  return (
    <pre id={"output"} className={
      "text-sm font-mono bg-black text-white p-4 rounded-lg overflow-x-auto border-1 border-gray-200 w-full resize-y h-[10vh]"
    }>
                {!isSetup && (
                  <>
                    <p>Setting up, please wait...</p>
                  </>
                )}
      {output && output.out && (
        // {"out": ["Hello, World!", "Traceback (most recent call last):", " File \"<exec>\", line 16, in run_code", " File \"<string>\", line 2, in <module>", "NameError: name 'error' is not defined"], "errors": [2]}
        output.out.map((line: string) => {
          //(A)console.log(output)
          // check if the line is an error
          // TODO: optimize this code
          if (errorHighlighting && (output.errors && output.errors.includes(output.out.indexOf(line)) || errorsRegEx.some((regEx) => regEx.test(line))
            // check if the line starts with 4 spaces, and the previous line was an error
            || aggressiveErrorHighlighting && ((output.out.indexOf(line) > 0 && output.errors && line.startsWith("    ") && (output.errors.includes(output.out.indexOf(line) - 1) || errorsRegEx.some((regEx) => regEx.test(output.out[output.out.indexOf(line) - 1]))))
              // check if 3 lines above was an error and this line (trimmed) is just (1 or multiple) carets VERY JANK
              || (output.out.indexOf(line) > 1 && output.errors && output.errors.includes(output.out.indexOf(line) - 3) && line.trim().length > 0 && line.trim().split("").every((char) => char === "^"))
            ))){
            return (
              <span style={{color: "red"}} key={Math.random().toString()}>{line}<br/></span>
            );
          }
          return (
            <span key={Math.random().toString()}>
                                {line}
              <br/>
                            </span>
          );
        })
      )}
            </pre>
  );
};

export default Console;
