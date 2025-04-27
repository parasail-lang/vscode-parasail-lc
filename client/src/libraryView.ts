import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// interface for the library
export interface Library {
	name: string;
	path: string;
}

// class to provide the library paths to the tree view
export class LibraryView implements vscode.TreeDataProvider<Library>{
	private _onDidChangeTreeData: vscode.EventEmitter<Library | null> = new vscode.EventEmitter<Library | null>();
	readonly onDidChangeTreeData: vscode.Event<Library | null> = this._onDidChangeTreeData.event;

	private libraries: Library[] = [];

	// constructor to initialize the library file path
	constructor(private librariesFilePath: string) {
		this.loadLibraryPaths();
	}

	// function to get the tree item
	getTreeItem(element: Library): vscode.TreeItem {
        if (element.path === 'addLibrary') {
            const addLibraryButton = new vscode.TreeItem('Add Library', vscode.TreeItemCollapsibleState.None);
            addLibraryButton.command = {
                command: 'parasail.addLibrary',
                title: 'Add Library'
            };
            return addLibraryButton;
        } else {
            const libraryItem = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.None);
            libraryItem.tooltip = element.path;
            libraryItem.contextValue = 'library';
            return libraryItem;
        }
    }

	//function to get the children of the tree item
    getChildren(element?: Library): Thenable<Library[]> {
        if (!element) {
            const addLibraryButton: Library = { name: 'Add Library', path: 'addLibrary' };
            return Promise.resolve([addLibraryButton, ...this.libraries]);
        }
        return Promise.resolve([]);
    }
	// function to refresh the tree view
	private loadLibraryPaths(): void {
        if (fs.existsSync(this.librariesFilePath)) {
            const rawData = fs.readFileSync(this.librariesFilePath, 'utf-8');
            this.libraries = JSON.parse(rawData);
        } else {
            // Create the file if it doesn't exist
            fs.writeFileSync(this.librariesFilePath, JSON.stringify(this.libraries, null, 2));
        }
	}

	// function to save the library paths to the JSON file
	private saveLibraryPaths(): void {
		fs.writeFileSync(this.librariesFilePath,
			JSON.stringify(this.libraries, null, 2)
		);
	}

	// function to add a library path
	addLibraryPath(library: Library) {
		if (!this.libraries.find(
			(lib) => lib.path === library.path)) {
		this.libraries.push(library);
		this.saveLibraryPaths();
		this._onDidChangeTreeData.fire(null);
		}
		else {
			console.log('Library path already exists');		}
	}

	// function to remove a library path
	removeLibraryPath(library: Library) {
		this.libraries = this.libraries.filter((lib) => lib !== library);
		this.saveLibraryPaths();
		this._onDidChangeTreeData.fire(null);
	}

}
