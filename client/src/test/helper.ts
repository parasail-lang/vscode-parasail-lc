/* --------------------------------------------------------------------------------------------
 * helper.ts: Utilities for integration tests. 
 * 
 * We fix the extension ID to match "parasail-lang.vscode-parasail-lc" (or whatever it is in package.json).
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;

/**
 * Activates the Parasail extension with a given document URI.
 * The extension ID must match your package.json's "publisher.name".
 */
export async function activate(docUri: vscode.Uri) {
  // For example, if "publisher":"parasail-lang" and "name":"vscode-parasail-lc",
  // then extensionId = "parasail-lang.vscode-parasail-lc"
  const extensionId = 'parasail-lang.vscode-parasail-lc'; // <--- REPLACE if needed
  
  // Attempt to get the extension by ID
  const ext = vscode.extensions.getExtension(extensionId);
  if (!ext) {
    throw new Error(`Extension ${extensionId} not found. Is it installed?`);
  }
  
  // Activate the extension
  await ext.activate();
  
  // Now open the doc & show it in the editor
  doc = await vscode.workspace.openTextDocument(docUri);
  editor = await vscode.window.showTextDocument(doc);
  
  // Optionally wait a moment for the language server to initialize
  await sleep(1500);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns an absolute path to a test fixture file.
 */
export const getDocPath = (p: string) => {
  return path.resolve(__dirname, '../../testFixture', p);
};

export const getDocUri = (p: string) => {
  return vscode.Uri.file(getDocPath(p));
};

/**
 * Replaces all content in the currently opened doc with the given content.
 */
export async function setTestContent(content: string): Promise<boolean> {
  const all = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(doc.getText().length)
  );
  return editor.edit(eb => eb.replace(all, content));
}
