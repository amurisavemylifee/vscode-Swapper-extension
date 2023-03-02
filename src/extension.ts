import * as vscode from "vscode";

function swap() {
  const editor = vscode.window.activeTextEditor;

  function getSelectionAndTextArray(
    selectionsParam: readonly vscode.Selection[]
  ) {
    return selectionsParam.map((selection, i) => {
      const idx = i === 0 ? 1 : 0;
      return {
        selection: selectionsParam[idx],
        text: editor!.document.getText(selection)
      };
    });
  }

  if (editor!.selections.length < 2) {
    return vscode.window.showErrorMessage(`Too few points to swap (need 2)`);
  }

  if (editor!.selections.length > 2) {
    return vscode.window.showErrorMessage(`Too many points to swap (need 2)`);
  }

  let selectionAndTextArray = getSelectionAndTextArray(editor!.selections);

  const isBothSelectionsIncludeText =
    selectionAndTextArray.filter((el) => el.text).length === 1;

  const isNoOneSelectionsIncludeText =
    selectionAndTextArray.filter((el) => el.text).length === 0;

  if (isBothSelectionsIncludeText) {
    return vscode.window.showErrorMessage("There's no selected texts to swap");
  }

  if (isNoOneSelectionsIncludeText) {
    const firstLine = editor!.document.lineAt(
      selectionAndTextArray[0].selection.start.line
    );
    const secondLine = editor!.document.lineAt(
      selectionAndTextArray[1].selection.end.line
    );

    editor!.selections = [
      new vscode.Selection(firstLine.range.start, firstLine.range.end),
      new vscode.Selection(secondLine.range.start, secondLine.range.end)
    ];

    selectionAndTextArray = getSelectionAndTextArray(editor!.selections);
  }

  return editor!.edit((builder) => {
    selectionAndTextArray.forEach(({ selection, text }) => {
      builder.replace(selection, text);
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("Swapper.swap", swap)
  );
}

export function deactivate() {}
