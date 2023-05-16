import { Extension } from "@tiptap/core";
import mammoth from "mammoth";

export const DisableEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    };
  },
});

export const convertDocxToHtml = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function (event) {
      let arrayBuffer = event.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then(result => {
            resolve(result.value);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject("Failed to read file");
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
