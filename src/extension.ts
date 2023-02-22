import * as vscode from "vscode";

function swap() {
  const editor = vscode.window.activeTextEditor;
  const selections = editor!.selections;

  if (selections.length < 2) {
    return vscode.window.showErrorMessage(`Too few selected points (need 2)`);
  }

  if (selections.length > 2) {
    return vscode.window.showErrorMessage(`Too many selected points (need 2)`);
  }

  const selectionAndTextArray = selections
    .map((selection, i) => {
      const idx = i === 0 ? 1 : 0;
      return {
        selection: selections[idx],
        text: editor!.document.getText(selection)
      };
    })
    .filter(({ text }) => {
      return text;
    });

  if (selectionAndTextArray.length !== 2) {
    return vscode.window.showErrorMessage("There's no selected texts to swap");
  }

  return editor!.edit((builder) => {
    selectionAndTextArray.forEach(({ selection, text }) =>
      builder.replace(selection, text)
    );
  });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("Swapper.swap", () => {
      swap();
    })
  );
}

export function deactivate() {}
