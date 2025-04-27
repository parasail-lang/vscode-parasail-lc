/* --------------------------------------------------------------------------------------------
 * diagnostics.test.ts: Tests that we get certain diagnostics for a .txt or parasail file.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
// CHANGED: import from updated helper, referencing the correct extension
import { getDocUri, activate } from './helper';

suite('Should get diagnostics', () => {
  const docUri = getDocUri('diagnostics.txt');

  test('Diagnoses uppercase texts', async () => {
    await activate(docUri);

    // In this hypothetical scenario, we expect these warnings on uppercase
    const expectedDiagnostics = [
      { message: 'ANY is all uppercase.', range: toRange(0, 0, 0, 3), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
      { message: 'ANY is all uppercase.', range: toRange(0, 14, 0, 17), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
      { message: 'OS is all uppercase.', range: toRange(0, 18, 0, 20), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' }
    ];

    // We retrieve actual diagnostics from the doc
    const actualDiagnostics = vscode.languages.getDiagnostics(docUri);
    assert.equal(actualDiagnostics.length, expectedDiagnostics.length);

    // Check each
    expectedDiagnostics.forEach((expDiag, i) => {
      const actualDiag = actualDiagnostics[i];
      assert.equal(actualDiag.message, expDiag.message);
      assert.deepEqual(actualDiag.range, expDiag.range);
      assert.equal(actualDiag.severity, expDiag.severity);
    });
  });
});

function toRange(sLine: number, sChar: number, eLine: number, eChar: number) {
  return new vscode.Range(
    new vscode.Position(sLine, sChar),
    new vscode.Position(eLine, eChar)
  );
}
