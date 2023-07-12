import { Extension } from "@tiptap/core";

import mammoth from "mammoth";

export const ShiftEnterCreateExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Shift-Enter": ({ editor }) =>
        editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.splitListItem("listItem"), // This line added
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]),
    };
  },
});

export const DisableEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    };
  },
});
