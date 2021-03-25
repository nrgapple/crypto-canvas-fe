import { useState } from "react";
import { fromEvent } from "file-selector";

export type FilePickerReturnTypes = [File[], () => void];

export interface ImageDims {
  minImageWidth?: number;
  maxImageWidth?: number;
  minImageHeight?: number;
  maxImageHeight?: number;
}

export interface UseFilePickerConfig {
  multiple?: boolean;
  accept?: string | string[];
}

function useFilePicker({
  accept = "*",
  multiple = true,
}: UseFilePickerConfig): FilePickerReturnTypes {
  const [files, setFiles] = useState<File[]>([]);

  const openFileSelector = () => {
    const fileExtensions = accept instanceof Array ? accept.join(",") : accept;
    openFileDialog(fileExtensions, multiple, (evt) => {
      fromEvent(evt).then((files) => {
        setFiles(files.map((f) => f as File) as File[]);
      });
    });
  };

  return [files, openFileSelector];
}

export default useFilePicker;

function openFileDialog(
  accept: string,
  multiple: boolean,
  callback: (arg: any) => void
) {
  // this function must be called from  a user
  // activation event (ie an onclick event)

  // Create an input element
  var inputElement = document.createElement("input");
  // Set its type to file
  inputElement.type = "file";
  // Set accept to the file types you want the user to select.
  // Include both the file extension and the mime type
  inputElement.accept = accept;
  // Accept multiple files
  inputElement.multiple = multiple;
  // set onchange event to call callback when user has selected file
  inputElement.addEventListener("change", callback);
  // dispatch a click event to open the file dialog
  inputElement.dispatchEvent(new MouseEvent("click"));
}

//Const values
const BYTES_PER_MEGABYTE = 1000000;
