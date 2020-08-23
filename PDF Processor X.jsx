/*
	PDF Processor X
	August 2020, Paul Chiorean

	A modified version of 'PDF Processor for CS3 II' by Paul MR, Wed Aug 08, 2012
	https://web.archive.org/web/20150511194417/https://www.ps-scripts.com/bb/viewtopic.php?f=10&t=1882&sid=a87e6a1cbc6fec5b38abbfc402e624ac
*/

#target photoshop
app.bringToFront();

if (app.version.match(/\d+/) < 10) {
	alert('Sorry, this script needs CS3 or better.');
} else {
	main();
}


function main() {
	var win = new Window("dialog", "PDF Processor X");
		win.orientation = "row";
		win.alignChildren = ["fill","top"];

	// Main group
	win.p1 = win.add("group", undefined, {name: "p1"});
	win.p1.orientation = "column";
	win.p1.alignChildren = ["fill","center"];

	// Panel 1: Mode & cropping
	win.g9 = win.p1.add("panel", undefined, "Mode & cropping", {name: "g9"});
	win.g9.orientation = "column";
	win.g9.alignChildren = "left";
	win.g10 = win.g9.add("group", undefined, {name: "g10"});
	win.g10.orientation = "row";
	win.g10.st1 = win.g10.add("statictext", undefined, "Color mode:", {name: "st1"});
	win.g10.st1.preferredSize.width = 90;
	win.g10.dd1 = win.g10.add("dropdownlist", undefined, undefined, {name: "dd1", items: ['CMYK Color', 'RGB Color', 'Grayscale', 'Lab Color']});
	win.g10.dd1.selection = 0;
	win.g10.st2 = win.g10.add("statictext", undefined, "Bit depth:", {name: "st2"});
	win.g10.dd2 = win.g10.add("dropdownlist", undefined, undefined, {name: "dd2", items: [8, 16]});
	win.g10.dd2.selection = 0;
	win.g10.st3 = win.g10.add("statictext", undefined, "Resolution:", {name: "st3"});
	win.g10.et1 = win.g10.add('edittext {properties: {name: "et1"}}');
	win.g10.et1.text = "300";
	win.g10.et1.preferredSize.width = 40;
	win.g10.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}

	win.g11 = win.g9.add("group", undefined, {name: "g11"});
	win.g11.orientation = "row";
	var Crops = ['Bounding Box', 'Media Box', 'Crop Box', 'Bleed Box', 'Trim Box', 'Art Box'];
	win.g11.st4 = win.g11.add("statictext", undefined, "Crop to:", {name: "st4"});
	win.g11.st4.preferredSize.width = 90;
	win.g11.dd3 = win.g11.add("dropdownlist", undefined, undefined, {name: "dd3", items: Crops});
	win.g11.dd3.selection = 1;
	win.g11.cb1 = win.g11.add("checkbox", undefined, "Flatten document", {name: "cb1"});
	win.g11.cb1.value = true;

	// Panel 2: Range
	win.g20 = win.p1.add("panel", undefined, "Pages to process", {name: "g20"});
	win.g20.orientation = "row";
	win.g20.alignChildren = "left";

	win.g20.rb1 = win.g20.add("radiobutton", undefined, "First page only", {name: "rb1"});
	win.g20.rb2 = win.g20.add("radiobutton", undefined, "All pages", {name: "rb2"});
	win.g20.rb3 = win.g20.add("radiobutton", undefined, "Range", {name: "rb3"});
	win.g20.rb1.value = true;
	win.g20.st2 = win.g20.add("statictext", undefined, "From:", {name: "st2"});
	win.g20.et1 = win.g20.add('edittext {properties: {name: "et1"}}');
	win.g20.et1.preferredSize.width = 40;
	win.g20.st3 = win.g20.add("statictext", undefined, "To:", {name: "st3"});
	win.g20.et2 = win.g20.add('edittext {properties: {name: "et2"}}');
	win.g20.et2.preferredSize.width = 40;
	win.g20.rb1.onClick = win.g20.rb2.onClick = win.g20.rb3.onClick = function() {
		if (win.g20.rb3.value == true) {
			win.g20.et1.enabled = true;
			win.g20.et2.enabled = true;
			win.g20.st2.visible = true;
			win.g20.et1.visible = true;
			win.g20.st3.visible = true;
			win.g20.et2.visible = true;
		} else {
			win.g20.et1.enabled = false;
			win.g20.et2.enabled = false;
			win.g20.st2.visible = false;
			win.g20.et1.visible = false;
			win.g20.st3.visible = false;
			win.g20.et2.visible = false;
		}
	}
	win.g20.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}
	win.g20.et2.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}
	win.g20.rb3.onClick();

	// Panel 3: Source & destination
	win.g21 = win.p1.add("panel", undefined, "Source & destination", {name: "g21"});
	win.g21.orientation = "column";
	win.g21.alignChildren = "left";
	win.g25 = win.g21.add("group", undefined, {name: "g25"});
	win.g25.orientation = "row";
	win.g25.rb1 = win.g25.add("radiobutton", undefined, "Single file", {name: "rb1"});
	win.g25.rb2 = win.g25.add("radiobutton", undefined, "Folder", {name: "rb2"});
	win.g25.rb3 = win.g25.add("radiobutton", undefined, "Folder and subfolders", {name: "rb3"});
	win.g25.rb2.value = true;

	win.g30 = win.g21.add("group", undefined, {name: "g30"});
	win.g30.orientation = "row";
	win.g30.st1 = win.g30.add("statictext", undefined, "Source:", {name: "st1"});
	win.g30.st1.preferredSize.width = 90;
	win.g30.et1 = win.g30.add('edittext {properties: {name: "et1"}}');
	win.g30.et1.preferredSize.width = 312;
	win.g30.bu1 = win.g30.add("button", undefined, "Browse", {name: "bu1"});
	var topLevelFolder = '';
	win.g30.bu1.onClick = function() {
		if (win.g25.rb1.value == true) {
			topLevelFolder = File.openDialog('Please select PDF file', 'PDF File:*.pdf');
		} else {
			topLevelFolder = Folder.selectDialog('Please select the source folder');
		}
		if (topLevelFolder != null) {
			win.g30.et1.text = decodeURI(topLevelFolder.fsName);
		}
	}
	win.g25.rb1.onChange = win.g25.rb2.onChange = win.g25.rb3.onChange = function() {
		if (win.g25.rb1.value == true) {
			if (topLevelFolder instanceof Folder) {
				topLevelFolder = '';
				win.g30.et1.text = '';
			}
		} else {
			if (topLevelFolder instanceof File) {
				topLevelFolder = '';
				win.g30.et1.text = '';
			}
		}
	}

	win.g40 = win.g21.add("group", undefined, {name: "g40"});
	win.g40.orientation = "row";
	win.g40.st1 = win.g40.add("statictext", undefined, "Destination:", {name: "st1"});
	win.g40.st1.preferredSize.width = 90;
	win.g40.et1 = win.g40.add('edittext {properties: {name: "et1"}}');
	win.g40.et1.preferredSize.width = 312;
	win.g40.bu1 = win.g40.add("button", undefined, "Browse", {name: "bu1"});
	win.g40.bu1.onClick = function() {
		outputFolder = Folder.selectDialog('Please select the output folder');
		if (outputFolder != null) {
			win.g40.et1.text = decodeURI(outputFolder.fsName);
		}
	}

	win.g35 = win.g21.add("group", undefined, {name: "g35"});
	win.g35.orientation = "row";
	win.g35.cb1 = win.g35.add("checkbox", undefined, "Save to original folder", {name: "cb1"});
	win.g35.cb1.onClick = function() {
		if (win.g35.cb1.value) {
			win.g40.et1.enabled = false;
			win.g40.bu1.enabled = false;
		} else {
			win.g40.et1.enabled = true;
			win.g40.bu1.enabled = true;
		}
	}

	// Panel 4: Filename
	win.g99 = win.p1.add("panel", undefined, "Filename options", {name: "g99"});
	win.g99.orientation = "column";
	win.g99.alignChildren = "left";

	win.g150 = win.g99.add("group", undefined, {name: "g150"});
	win.g150.orientation = "row";
	win.g150.cb1 = win.g150.add("checkbox", undefined, "Rename to:", {name: "cb1"});
	win.g150.cb1.preferredSize.width = 90;
	win.g150.et1 = win.g150.add('edittext {properties: {name: "et1"}}');
	win.g150.et1.preferredSize.width = 408;
	win.g150.cb1.onClick = function() {
		if (win.g150.cb1.value) {
			win.g150.et1.enabled = true;
			win.g150.et1.active = true;
		} else {
			win.g150.et1.enabled = false;
		}
	}
	win.g150.et1.enabled = false;

	win.g100 = win.g99.add("group", undefined, {name: "g100"});
	win.g100.orientation = "row";
	win.g100.cb1 = win.g100.add("checkbox", undefined, "Add sequence numbers", {name: "cb1"});
	win.g100.st2 = win.g100.add("statictext", undefined, "Start at:", {name: "st2"});
	win.g100.et1 = win.g100.add('edittext {properties: {name: "et1"}}');
	win.g100.et1.text = "1";
	win.g100.et1.preferredSize.width = 40;
	win.g100.st3 = win.g100.add("statictext", undefined, "Length:", {name: "st3"});
	var numbers = [1, 2, 3, 4, 5];
	win.g100.dd2 = win.g100.add("dropdownlist", undefined, undefined, {name: "dd2", items: numbers});
	win.g100.dd2.selection = 2;
	win.g100.st2.visible = false;
	win.g100.et1.visible = false;
	win.g100.st3.visible = false;
	win.g100.dd2.visible = false;
	win.g100.et1.enabled = false;
	win.g100.dd2.enabled = false;
	win.g100.cb1.onClick = function() {
		if (win.g100.cb1.value) {
			win.g100.st2.visible = true;
			win.g100.et1.visible = true;
			win.g100.st3.visible = true;
			win.g100.dd2.visible = true;
			win.g100.et1.enabled = true;
			win.g100.et1.active = true;
			win.g100.dd2.enabled = true;
		} else {
			win.g100.st2.visible = false;
			win.g100.et1.visible = false;
			win.g100.st3.visible = false;
			win.g100.dd2.visible = false;
			win.g100.et1.enabled = false;
			win.g100.dd2.enabled = false;
		}
	}
	win.g100.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}

	// Panel 5: Processing
	win.g44 = win.p1.add("panel", undefined, "Processing", {name: "g44"});
	win.g44.orientation = "column";
	win.g44.alignChildren = "left";
	win.g50 = win.g44.add("group", undefined, {name: "g50"});
	win.g50.orientation = "row";
	win.g50.cb1 = win.g50.add("checkbox", undefined, "Run action:", {name: "cb1"});
	win.g50.cb1.preferredSize.width = 90;
	win.g50.dd1 = win.g50.add("dropdownlist", undefined, undefined, {name: "dd1"});
	win.g50.dd2 = win.g50.add("dropdownlist", undefined, undefined, {name: "dd2"});
	var actionSets = getActionSets();
	for (var i in actionSets) {
		win.g50.dd1.add('item', actionSets[i]);
	}
	win.g50.dd1.selection = 0;
	var actions = getActions(actionSets[0]);
	for (var i in actions) {
		win.g50.dd2.add('item', actions[i]);
	}
	win.g50.dd2.selection = 0;
	win.g50.dd1.onChange = function() {
		win.g50.dd2.removeAll();
		actions = getActions(actionSets[this.selection.index]);
		for (var i in actions) {
			win.g50.dd2.add('item', actions[i]);
		}
		win.g50.dd2.selection = 0;
	}
	win.g50.cb1.onClick = function() {
		if (win.g50.cb1.value) {
			win.g50.dd1.enabled = true;
			win.g50.dd2.enabled = true;
		} else {
			win.g50.dd1.enabled = false;
			win.g50.dd2.enabled = false;
		}
	}
	win.g50.cb1.onClick();

	win.g45 = win.g44.add("group", undefined, {name: "g45"});
	win.g45.orientation = "row";
	win.g45.cb1 = win.g45.add("checkbox", undefined, "Resize to fit", {name: "cb1"});
	win.g45.cb1.preferredSize.width = 90;
	win.g45.st1 = win.g45.add("statictext", undefined, "Width:", {name: "st1"});
	win.g45.et1 = win.g45.add('edittext {properties: {name: "et1"}}');
	win.g45.et1.preferredSize.width = 50;
	win.g45.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}
	win.g45.st2 = win.g45.add("statictext", undefined, "px", {name: "st2"});
	win.g45.st3 = win.g45.add("statictext", undefined, "Height:", {name: "st3"});
	win.g45.et2 = win.g45.add('edittext {properties: {name: "et2"}}');
	win.g45.et2.preferredSize.width = 50;
	win.g45.et2.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) {
			this.text = this.text.replace(/[^\-\.\d]/g, '');
		}
	}
	win.g45.st4 = win.g45.add("statictext", undefined, "px", {name: "st4"});
	var beforeAfter = ["Before action", "After action"];
	win.g45.dd1 = win.g45.add("dropdownlist", undefined, undefined, {name: "dd1", items: beforeAfter});
	win.g45.dd1.selection = 0;
	win.g45.cb1.onClick = function() {
		if (win.g45.cb1.value) {
			win.g45.et1.enabled = true;
			win.g45.et1.active = true;
			win.g45.et2.enabled = true;
			win.g45.dd1.enabled = true;
		} else {
			win.g45.et1.enabled = false;
			win.g45.et2.enabled = false;
			win.g45.dd1.enabled = false;
		}
	}
	win.g45.cb1.onClick();

	// Panel 6: Save options
	win.g159 = win.p1.add("panel", undefined, "Save options", {name: "g159"});
	win.g159.orientation = "column";
	win.g159.alignChildren = "left";
	win.g260 = win.g159.add("group", undefined, {name: "g260"});
	win.g260.orientation = "row";
	win.g260.cb1 = win.g260.add("checkbox", undefined, "TIFF:", {name: "cb1"});
	var tiffOptions = ['LZW', 'ZIP', 'JPG', 'None'];
	win.g260.dd1 = win.g260.add("dropdownlist", undefined, undefined, {name: "dd1", items: tiffOptions});
	win.g260.dd1.selection = 0;
	win.g260.dd1.enabled = false;
	win.g260.cb1.onClick = function() {
		if (win.g260.cb1.value) {
			win.g260.dd1.enabled = true;
		} else {
			win.g260.dd1.enabled = false;
		}
	}

	win.g260.cb2 = win.g260.add("checkbox", undefined, "PSD", {name: "cb2"});

	win.g260.cb3 = win.g260.add("checkbox", undefined, "PNG:", {name: "cb3"});
	win.g260.dd2 = win.g260.add("dropdownlist", undefined, undefined, {name: "dd2"});
	for (var a = 0; a < 101; a++) {
		win.g260.dd2.add('item', a);
	}
	win.g260.dd2.selection = 80;
	win.g260.dd2.enabled = false;
	win.g260.cb3.onClick = function() {
		if (win.g260.cb3.value) {
			win.g260.dd2.enabled = true;
		} else {
			win.g260.dd2.enabled = false;
		}
	}

	win.g260.cb4 = win.g260.add("checkbox", undefined, "JPG:", {name: "cb4"});
	var jpgQuality = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	win.g260.dd3 = win.g260.add("dropdownlist", undefined, undefined, {name: "dd3", items: jpgQuality});
	win.g260.dd3.selection = 7;
	win.g260.dd3.enabled = false;
	win.g260.cb4.onClick = function() {
		if (win.g260.cb4.value) {
			win.g260.dd3.enabled = true;
			win.g270.cb1.value = false;
			win.g270.dd1.enabled = false;
		} else {
			win.g260.dd3.enabled = false;
		}
	}

	win.g260.cb5 = win.g260.add("checkbox", undefined, "PDF", {name: "cb5"});

	win.g270 = win.g159.add("group", undefined, {name: "g270"});
	win.g270.orientation = "row";
	win.g270.cb1 = win.g270.add("checkbox", undefined, "Save For Web:", {name: "cb1"});
	win.g270.dd1 = win.g270.add("dropdownlist", undefined, undefined, {name: "dd1"});
	for (var a = 1; a < 101; a++) {
		win.g270.dd1.add('item', a);
	}
	win.g270.dd1.selection = 79;
	win.g270.dd1.enabled = false;
	win.g270.cb1.onClick = function() {
		if (win.g270.cb1.value) {
			win.g270.dd1.enabled = true;
			win.g260.cb4.value = false;
			win.g260.dd2.enabled = false;
		} else {
			win.g270.dd1.enabled = false;
		}
	}

	// Ok/Cancel group
	win.g2150 = win.add("group", undefined, {name: "g2150"});
	win.g2150.orientation = "column";
	win.g2150.alignChildren = "fill";
	win.g2150.bu1 = win.g2150.add("button", undefined, "Process", {name: "ok"});
	win.g2150.bu2 = win.g2150.add("button", undefined, "Cancel", {name: "cancel"});

	// Process all PDFs
	win.g2150.bu1.onClick = function() {
		if (win.g30.et1.text == '') {
			alert("No file or folder has been selected.");
			return;
		}
		if (win.g35.cb1.value == false && win.g40.et1.text == '') {
			alert("No output folder has been selected.");
			return;
		}
		if (win.g45.cb1.value == true && win.g45.et1.text == '') {
			alert("No resize width value has been entered.");
			return;
		}
		if (win.g45.cb1.value == true && win.g45.et2.text == '') {
			alert("No resize height value has been entered.");
			return;
		}
		if (win.g150.cb1.value == true && win.g150.et1.text == '') {
			alert("New document name has not been entered.");
			return;
		}
		if (win.g20.rb3.value == true) {
			if (win.g20.et1.text == '') {
				alert("No number has been entered in the 'From' field.");
				return;
			}
			if (win.g20.et2.text == '') {
				alert("No number has been entered in the 'To' field.");
				return;
			}
			if (Number(win.g20.et1.text) > Number(win.g20.et1.text)) {
				alert("To field should be greater than the 'From' field.");
				return;
			}
		}
		var saveFiles = 0;
		if (win.g260.cb1.value) saveFiles++;
		if (win.g260.cb2.value) saveFiles++;
		if (win.g260.cb3.value) saveFiles++;
		if (win.g260.cb4.value) saveFiles++;
		if (win.g260.cb5.value) saveFiles++;
		if (win.g270.cb1.value) saveFiles++;
		if (saveFiles == 0) {
			alert("No save format has been selected.");
			return;
		}
		win.close(0);
		var folders = [];
		app.displayDialogs = DialogModes.NO;
		var strtRulerUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		if (win.g25.rb1.value == true) {
			processPDF(topLevelFolder); // single file
		}
		if (win.g25.rb2.value == true) { // folder of PDFs
			folders[0] = Folder(topLevelFolder);
			var fileList = folders[0].getFiles("*.pdf");
			for (var f in fileList) {
				processPDF(fileList[f]);
			}
		}
		if (win.g25.rb3.value == true) { // folder and sub folders of PDFs
			folders = FindAllFolders(topLevelFolder, folders);
			folders.unshift(topLevelFolder);
			for (var z in folders) {
				var fileList = folders[z].getFiles("*.pdf");
				for (var k in fileList) {
					processPDF(fileList[k]);
				}
			}
		}
		app.preferences.rulerUnits = strtRulerUnits;

		function processPDF(pdfFile) {
			var noOfDocs = app.documents.length;
			if (win.g20.rb1.value == true) { // one page only
					pageStart = 1;
					pageEnd = 2;
			}
			if (win.g20.rb2.value == true) { // all pages
					pageStart = 1;
					pageEnd = 9999;
			}
			if (win.g20.rb3.value == true) { // range of pages
					pageStart = Number(win.g20.et1.text);
					pageEnd = (Number(win.g20.et2.text) + 1);
			}
			fileCount = (Number(win.g100.et1.text) - 1);
			if (win.g35.cb1.value) outputFolder = pdfFile.path;
			if (win.g150.cb1.value == true) {
				var Name = win.g150.et1.text.toString().replace(/\.[^\.]+$/, '');
			} else {
				var Name = decodeURI(pdfFile.name.replace(/\.[^\.]+$/, ''));
			}
			var seqLength = Number(win.g100.dd2.selection.text);
			for (var a = pageStart; a < pageEnd; a++) {
				var res = Number(win.g10.et1.text);
				var modes = ['ECMY', 'RGBC', 'Grys', 'LbCl'];
				var mode = modes[win.g10.dd1.selection.index];
				var bits = [8, 16];
				var BitDepth = bits[win.g10.dd2.selection.index];
				var cropTo = ['boundingBox', 'mediaBox', 'cropBox', 'bleedBox', 'trimBox', 'artBox'];
				var cropto = cropTo[win.g11.dd3.selection.index];
				rasterizePDF(a, res, mode, BitDepth, cropto, pdfFile);
				if (app.documents.length == noOfDocs) return; // no document opened
				fileCount++;
				if (win.g11.cb1.value) app.activeDocument.flatten();
				if (win.g100.cb1.value == true || 
					win.g20.rb2.value == true || win.g20.rb3.value == true) {
					var saveFile = outputFolder + "/" + Name + "#" + zeroPad(fileCount, seqLength);
				} else {
					var saveFile = outputFolder + "/" + Name;
				}
				if (win.g45.cb1.value == true && win.g45.dd1.selection.index == 0) {
					FitImage(Number(win.g45.et1.text), Number(win.g45.et2.text));
				}
				if (win.g50.cb1.value) {
					doAction(win.g50.dd2.selection.text.toString(), win.g50.dd1.selection.text.toString());
				}
				if (win.g45.cb1.value == true && win.g45.dd1.selection.index == 1) {
					FitImage(Number(win.g45.et1.text), Number(win.g45.et2.text));
				}
				// Save files
				if (win.g260.cb1.value) { // tif
					tifsaveFile = File(saveFile + ".tif");
					if (tifsaveFile.exists) {
						tifsaveFile = File(tifsaveFile.toString().replace(/\.tif$/, '') + "_" + time() + ".tif");
					}
					SaveTIFF(saveFile, win.g260.dd1.selection.index);
				}
				if (win.g260.cb2.value) { // psd
					psdsaveFile = File(saveFile + ".psd");
					if (psdsaveFile.exists) {
						psdsaveFile = File(psdsaveFile.toString().replace(/\.psd$/, '') + "_" + time() + ".psd");
					}
					SavePSD(psdsaveFile);
				}
				if (win.g260.cb3.value) { // png
					pngsaveFile = File(saveFile + ".png");
					if (pngsaveFile.exists) {
						pngsaveFile = File(pngsaveFile.toString().replace(/\.png$/, '') + "_" + time() + ".psd");
					}
					sfwPNG24(pngsaveFile, (win.g260.dd2.selection.index + 1));
				}
				if (win.g260.cb4.value) { // jpg
					jpgsaveFile = File(saveFile + ".jpg");
					if (jpgsaveFile.exists) {
						jpgsaveFile = File(jpgsaveFile.toString().replace(/\.jpg$/, '') + "_" + time() + ".jpg");
					}
					SaveJPEG(jpgsaveFile, (win.g260.dd3.selection.index + 1));
				}
				if (win.g260.cb5.value) { // pdf
					pdfsaveFile = File(saveFile + ".pdf");
					if (pdfsaveFile.exists) {
						pdfsaveFile = File(pdfsaveFile.toString().replace(/\.pdf$/, '') + "_" + time() + ".pdf");
					}
					SavePDF(pdfsaveFile);
				}
				if (win.g270.cb1.value) { // sfw jpg
					sfwsaveFile = File(saveFile + ".jpg");
					if (sfwsaveFile.exists) {
						sfwsaveFile = File(sfwsaveFile.toString().replace(/\.jpg$/, '') + "_" + time() + ".jpg");
					}
					SaveForWeb(sfwsaveFile, (win.g270.dd1.selection.index + 1));
				}
				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
			} // end from to
		} // end processPDF
	} // end process
	win.center();
	win.show();
}

function SaveTIFF(saveFile, Comp) {
	tiffSaveOptions = new TiffSaveOptions();
	tiffSaveOptions.embedColorProfile = true;
	tiffSaveOptions.transparency = true;
	tiffSaveOptions.interleaveChannels = true;
	tiffSaveOptions.alphaChannels = false;
	switch (Number(Comp)) {
		case 0:
			tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
			break;
		case 1:
			tiffSaveOptions.imageCompression = TIFFEncoding.TIFFZIP;
			break;
		case 2:
			tiffSaveOptions.imageCompression = TIFFEncoding.JPEG;
			break;
		case 3:
			tiffSaveOptions.imageCompression = TIFFEncoding.NONE;
			break;
		default:
			break;
	}
	activeDocument.saveAs(File(saveFile + ".tif"), tiffSaveOptions, true, Extension.LOWERCASE);
}

function SavePSD(saveFile) {
	psdSaveOptions = new PhotoshopSaveOptions();
	psdSaveOptions.embedColorProfile = true;
	psdSaveOptions.alphaChannels = true;
	psdSaveOptions.layers = true;
	activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
}

function SavePDF(saveFile) {
	pdfSaveOptions = new PDFSaveOptions();
	activeDocument.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
}

function SaveJPEG(saveFile, Quality) {
	var doc = activeDocument;
	if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
	jpgSaveOptions = new JPEGSaveOptions()
	jpgSaveOptions.embedColorProfile = true
	jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
	jpgSaveOptions.matte = MatteType.NONE
	jpgSaveOptions.quality = Quality;
	activeDocument.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE)
}

function SaveForWeb(saveFile, Quality) {
	var doc = activeDocument;
	var tmpName = File(File(saveFile).path + "/SFW_TEMP.jpg");
	if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
	var sfwOptions = new ExportOptionsSaveForWeb();
	sfwOptions.format = SaveDocumentType.JPEG;
	sfwOptions.includeProfile = false;
	sfwOptions.interlaced = 0;
	sfwOptions.optimized = true;
	sfwOptions.quality = Quality;
	activeDocument.exportDocument(tmpName, ExportType.SAVEFORWEB, sfwOptions);
	tmpName.rename(decodeURI(File(saveFile).name));
}

function sfwPNG24(saveFile, Quality) {
	var doc = activeDocument;
	if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
	var pngOpts = new ExportOptionsSaveForWeb;
	pngOpts.format = SaveDocumentType.PNG;
	pngOpts.PNG8 = false;
	pngOpts.transparency = true;
	pngOpts.interlaced = false;
	pngOpts.quality = Quality;
	activeDocument.exportDocument(new File(saveFile), ExportType.SAVEFORWEB, pngOpts);
}

function getActionSets() {
	var i = 1;
	var sets = [];
	while (true) {
		var ref = new ActionReference();
		ref.putIndex(charIDToTypeID('ASet'), i);
		var desc;
		var lvl = $.level;
		$.level = 0;
		try {
			desc = executeActionGet(ref);
		} catch (e) {
			break;
		} finally {
			$.level = lvl;
		}
		if (desc.hasKey(charIDToTypeID('Nm  '))) {
			var set = {}
			set.index = i;
			set.name = desc.getString(charIDToTypeID('Nm  '));
			set.toString = function() {
				return this.name;
			}
			set.count = desc.getInteger(charIDToTypeID('NmbC'));
			set.actions = [];
			for (var j = 1; j <= set.count; j++) {
				var ref = new ActionReference();
				ref.putIndex(charIDToTypeID('Actn'), j);
				ref.putIndex(charIDToTypeID('ASet'), set.index);
				var adesc = executeActionGet(ref);
				var actName = adesc.getString(charIDToTypeID('Nm  '));
				set.actions.push(actName);
			}
			sets.push(set);
		}
		i++;
	}
	return sets;
}

function getActions(aset) {
	var i = 1;
	var names = [];
	if (!aset) {
		throw 'Action set must be specified';
	}
	while (true) {
		var ref = new ActionReference();
		ref.putIndex(charIDToTypeID('ASet'), i);
		var desc;
		try {
			desc = executeActionGet(ref);
		} catch (e) {
			break;
		}
		if (desc.hasKey(charIDToTypeID('Nm  '))) {
			var name = desc.getString(charIDToTypeID('Nm  '));
			if (name == aset) {
				var count = desc.getInteger(charIDToTypeID('NmbC'));
				var names = [];
				for (var j = 1; j <= count; j++) {
					var ref = new ActionReference();
					ref.putIndex(charIDToTypeID('Actn'), j);
					ref.putIndex(charIDToTypeID('ASet'), i);
					var adesc = executeActionGet(ref);
					var actName = adesc.getString(charIDToTypeID('Nm  '));
					names.push(actName);
				}
				break;
			}
		}
		i++;
	}
	return names;
}

function FitImage(inWidth, inHeight) {
	var desc = new ActionDescriptor();
	var unitPixels = charIDToTypeID('#Pxl');
	desc.putUnitDouble(charIDToTypeID('Wdth'), unitPixels, inWidth);
	desc.putUnitDouble(charIDToTypeID('Hght'), unitPixels, inHeight);
	var runtimeEventID = stringIDToTypeID('3caa3434-cb67-11d1-bc43-0060b0a13dc4');
	executeAction(runtimeEventID, desc, DialogModes.NO);
}

function rasterizePDF(pageNumber, res, mode, BitDepth, cropto, pdfFile) {
	var desc = new ActionDescriptor();
	var optionsDesc = new ActionDescriptor();
	optionsDesc.putString(charIDToTypeID('Nm  '), 'rasterized page');
	optionsDesc.putEnumerated(charIDToTypeID('Crop'), stringIDToTypeID('cropTo'), stringIDToTypeID(cropto));
	optionsDesc.putUnitDouble(charIDToTypeID('Rslt'), charIDToTypeID('#Rsl'), res);
	optionsDesc.putEnumerated(charIDToTypeID('Md  '), charIDToTypeID('ClrS'), charIDToTypeID(mode));
	optionsDesc.putInteger(charIDToTypeID('Dpth'), BitDepth);
	optionsDesc.putBoolean(charIDToTypeID('AntA'), true);
	optionsDesc.putBoolean(stringIDToTypeID('suppressWarnings'), false);
	optionsDesc.putEnumerated(charIDToTypeID('fsel'), stringIDToTypeID('pdfSelection'), stringIDToTypeID('page'));
	optionsDesc.putInteger(charIDToTypeID('PgNm'), pageNumber);
	desc.putObject(charIDToTypeID('As  '), charIDToTypeID('PDFG'), optionsDesc);
	desc.putPath(charIDToTypeID('null'), File(pdfFile));
	executeAction(charIDToTypeID('Opn '), desc, DialogModes.NO);
}

function FindAllFolders(srcFolderStr, destArray) {
	var fileFolderArray = Folder(srcFolderStr).getFiles();
	for (var i = 0; i < fileFolderArray.length; i++) {
		var fileFoldObj = fileFolderArray[i];
		if (fileFoldObj instanceof File) {} else {
			destArray.push(Folder(fileFoldObj));
			FindAllFolders(fileFoldObj.toString(), destArray);
		}
	}
	return destArray;
}

function zeroPad(n, s) {
	n = n.toString();
	while (n.length < s) n = '0' + n;
	return n;
}

function time() {
	var date = new Date();
	var d = date.getDate();
	var day = (d < 10) ? '0' + d : d;
	var m = date.getMonth() + 1;
	var month = (m < 10) ? '0' + m : m;
	var yy = date.getYear();
	var year = (yy < 1000) ? yy + 1900 : yy;
	var digital = new Date();
	var hours = digital.getHours();
	var minutes = digital.getMinutes();
	var seconds = digital.getSeconds();
	var amOrPm = "AM";
	if (hours > 11) amOrPm = "PM";
	if (hours > 12) hours = hours - 12;
	if (hours == 0) hours = 12;
	if (minutes <= 9) minutes = "0" + minutes;
	if (seconds <= 9) seconds = "0" + seconds;
	todaysDate = "-" + hours + "_" + minutes + "_" + seconds + amOrPm;
	return todaysDate.toString();
}