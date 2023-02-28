// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as plantUml from 'node-plantuml'

const style = path.resolve(__dirname, '.plantstyles');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "plantumlautogenerator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('plantumlautogenerator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from plantumlautogenerator!');
		
		generateDiagram(vscode.window.activeTextEditor?.document.fileName);

	});

	context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
export function deactivate() { }


/**
 * Logs a dated message to the console.
 * @param {string} message - The message to log.
 */
function log(message: string) {
	const now = new Date();
	console.log(`[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}] ${message}`);
}

/**
 * Generates/regenerates a diagram based on a PlantUML file.
 * @param {string} pathToFile - The absolute file path to the PlantUML file.
 */
function generateDiagram(pathToFile: string) {
	cleanupDiagram(pathToFile);
	const diagramPath = calculateDiagramPath(pathToFile);
	log("Generating " + diagramPath);
	try {
		const gen = plantUml.generate(pathToFile, { format: "png", config: style });
		gen.out.pipe(fs.createWriteStream(diagramPath));
	} catch (error) {
		console.error(error);
	}
}

/**
 * Removes a diagram based on a PlantUML file.
 * @param {string} pathToFile - The absolute file path to the PlantUML file.
 */
function cleanupDiagram(pathToFile: string) {
	const diagramPath = calculateDiagramPath(pathToFile);
	try {
		if (fs.existsSync(diagramPath)) {
			log("Removing " + diagramPath);
			fs.unlinkSync(diagramPath);
		}
	} catch (error) {
		console.error(error);
	}
}

/**
 * Determines the path to the generated visual diagram based on the
 * location of a PlantUML file.
 * @param {string} pathToFile - The absolute file path to the PlantUML file.
 * @return {string} The absolute path to the diagram associated with the PlantUML file.
 */
function calculateDiagramPath(pathToFile: string) {
	const filename = path.basename(pathToFile, ".puml") + ".png";
	return path.join(path.dirname(pathToFile), filename);
}
