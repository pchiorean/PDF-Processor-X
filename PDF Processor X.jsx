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
	win.main = win.add("group", undefined);
	win.main.orientation = "column";
	win.main.alignChildren = ["fill","center"];

	// Panel 1: Mode & cropping
	win.gMode = win.main.add("panel", undefined, "Mode & cropping");
	win.gMode.orientation = "column";
	win.gMode.alignChildren = "left";

	win.gMode.g1 = win.gMode.add("group", undefined);
	win.gMode.g1.orientation = "row";
	win.gMode.g1.st1 = win.gMode.g1.add("statictext", undefined, "Color mode:");
	win.gMode.g1.st1.preferredSize.width = 90;
	win.gMode.g1.dd1 = win.gMode.g1.add("dropdownlist", undefined, undefined, 
		{items: ['CMYK Color', 'RGB Color', 'Grayscale', 'Lab Color']});
	win.gMode.g1.dd1.selection = 0;
	win.gMode.g1.st2 = win.gMode.g1.add("statictext", undefined, "Bit depth:");
	win.gMode.g1.dd2 = win.gMode.g1.add("dropdownlist", undefined, undefined, {items: [8, 16]});
	win.gMode.g1.dd2.selection = 0;
	win.gMode.g1.st3 = win.gMode.g1.add("statictext", undefined, "Resolution:");
	win.gMode.g1.et1 = win.gMode.g1.add('edittext {properties: {name: "et1"}}');
	win.gMode.g1.et1.preferredSize.width = 40;
	win.gMode.g1.et1.text = "300";
	win.gMode.g1.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) this.text = this.text.replace(/[^\-\.\d]/g, '');
	}

	win.gMode.g2 = win.gMode.add("group", undefined);
	win.gMode.g2.orientation = "row";
	win.gMode.g2.st1 = win.gMode.g2.add("statictext", undefined, "Crop to:");
	win.gMode.g2.st1.preferredSize.width = 90;
	win.gMode.g2.dd1 = win.gMode.g2.add("dropdownlist", undefined, undefined, 
		{items: ['Bounding Box', 'Media Box', 'Crop Box', 'Bleed Box', 'Trim Box', 'Art Box']});
	win.gMode.g2.dd1.selection = 1;
	win.gMode.g2.cb1 = win.gMode.g2.add("checkbox", undefined, "Flatten document");
	win.gMode.g2.cb1.value = true;

	// Panel 2: Range
	win.gPages = win.main.add("panel", undefined, "Pages to process");
	win.gPages.orientation = "row";
	win.gPages.alignChildren = "left";
	win.gPages.rb1 = win.gPages.add("radiobutton", undefined, "First page only");
	win.gPages.rb2 = win.gPages.add("radiobutton", undefined, "All pages");
	win.gPages.rb3 = win.gPages.add("radiobutton", undefined, "Range");
	win.gPages.rb2.value = true;
	win.gPages.st1 = win.gPages.add("statictext", undefined, "From:");
	win.gPages.et1 = win.gPages.add('edittext {properties: {name: "et1"}}');
	win.gPages.et1.preferredSize.width = 40;
	win.gPages.st2 = win.gPages.add("statictext", undefined, "To:");
	win.gPages.et2 = win.gPages.add('edittext {properties: {name: "et2"}}');
	win.gPages.et2.preferredSize.width = 40;
	win.gPages.rb1.onClick = win.gPages.rb2.onClick = win.gPages.rb3.onClick = function() {
		if (win.gPages.rb3.value == true) {
			win.gPages.et1.enabled = win.gPages.et2.enabled = true;
			win.gPages.st1.visible = win.gPages.st2.visible = true;
			win.gPages.et1.visible = win.gPages.et2.visible = true;
		} else {
			win.gPages.et1.enabled = win.gPages.et2.enabled = false;
			win.gPages.st1.visible = win.gPages.st2.visible = false;
			win.gPages.et1.visible = win.gPages.et2.visible = false;
		}
	}
	win.gPages.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) this.text = this.text.replace(/[^\-\.\d]/g, '');
	}
	win.gPages.et2.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) this.text = this.text.replace(/[^\-\.\d]/g, '');
	}
	win.gPages.rb3.onClick();

	// Panel 3: Source & destination
	win.gIO = win.main.add("panel", undefined, "Source & destination");
	win.gIO.orientation = "column";
	win.gIO.alignChildren = "left";

	win.gIO.g1 = win.gIO.add("group", undefined);
	win.gIO.g1.orientation = "row";
	win.gIO.g1.rb1 = win.gIO.g1.add("radiobutton", undefined, "Single file");
	win.gIO.g1.rb2 = win.gIO.g1.add("radiobutton", undefined, "Folder");
	win.gIO.g1.rb3 = win.gIO.g1.add("radiobutton", undefined, "Folder and subfolders");
	win.gIO.g1.rb2.value = true;

	win.gIO.g2 = win.gIO.add("group", undefined);
	win.gIO.g2.orientation = "row";
	win.gIO.g2.st1 = win.gIO.g2.add("statictext", undefined, "Source:");
	win.gIO.g2.st1.preferredSize.width = 90;
	win.gIO.g2.et1 = win.gIO.g2.add("edittext");
	win.gIO.g2.et1.preferredSize.width = 312;
	win.gIO.g2.bu1 = win.gIO.g2.add("button", undefined, "Browse");
	var topLevelFolder = '';
	win.gIO.g2.bu1.onClick = function() {
		if (win.gIO.g1.rb1.value == true) {
			topLevelFolder = File.openDialog('Please select PDF file', 'PDF File:*.pdf');
		} else {
			topLevelFolder = Folder.selectDialog('Please select the source folder');
		}
		if (topLevelFolder != null) win.gIO.g2.et1.text = decodeURI(topLevelFolder.fsName);
	}
	win.gIO.g1.rb1.onChange =
	win.gIO.g1.rb2.onChange =
	win.gIO.g1.rb3.onChange = function() {
		if (win.gIO.g1.rb1.value == true) {
			if (topLevelFolder instanceof Folder) { topLevelFolder = ''; win.gIO.g2.et1.text = '' }
		} else {
			if (topLevelFolder instanceof File) { topLevelFolder = ''; win.gIO.g2.et1.text = '' }
		}
	}

	win.gIO.g3 = win.gIO.add("group", undefined);
	win.gIO.g3.orientation = "row";
	win.gIO.g3.st1 = win.gIO.g3.add("statictext", undefined, "Destination:");
	win.gIO.g3.st1.preferredSize.width = 90;
	win.gIO.g3.et1 = win.gIO.g3.add('edittext {properties: {name: "et1"}}');
	win.gIO.g3.et1.preferredSize.width = 312;
	win.gIO.g3.bu1 = win.gIO.g3.add("button", undefined, "Browse");
	win.gIO.g3.bu1.onClick = function() {
		outputFolder = Folder.selectDialog('Please select the output folder');
		if (outputFolder != null) win.gIO.g3.et1.text = decodeURI(outputFolder.fsName);
	}

	win.gIO.g4 = win.gIO.add("group", undefined);
	win.gIO.g4.orientation = "row";
	win.gIO.g4.cb1 = win.gIO.g4.add("checkbox", undefined, "Save to original folder");
	win.gIO.g4.cb1.onClick = function() {
		if (win.gIO.g4.cb1.value) {
			win.gIO.g3.et1.enabled = false;
			win.gIO.g3.bu1.enabled = false;
		} else {
			win.gIO.g3.et1.enabled = true;
			win.gIO.g3.bu1.enabled = true;
		}
	}

	// Panel 4: Processing
	win.gProc = win.main.add("panel", undefined, "Processing");
	win.gProc.orientation = "column";
	win.gProc.alignChildren = "left";

	win.gProc.g1 = win.gProc.add("group", undefined);
	win.gProc.g1.orientation = "row";
	win.gProc.g1.cb1 = win.gProc.g1.add("checkbox", undefined, "Run action:");
	win.gProc.g1.cb1.preferredSize.width = 90;
	win.gProc.g1.dd1 = win.gProc.g1.add("dropdownlist", undefined, undefined);
	win.gProc.g1.dd2 = win.gProc.g1.add("dropdownlist", undefined, undefined);
	var actionSets = getActionSets();
	for (var i in actionSets) win.gProc.g1.dd1.add('item', actionSets[i]);
	win.gProc.g1.dd1.selection = 0;
	var actions = getActions(actionSets[0]);
	for (var i in actions) win.gProc.g1.dd2.add('item', actions[i]);
	win.gProc.g1.dd2.selection = 0;
	win.gProc.g1.dd1.onChange = function() {
		win.gProc.g1.dd2.removeAll();
		actions = getActions(actionSets[this.selection.index]);
		for (var i in actions) win.gProc.g1.dd2.add('item', actions[i]);
		win.gProc.g1.dd2.selection = 0;
	}
	win.gProc.g1.cb1.onClick = function() {
		if (win.gProc.g1.cb1.value) {
			win.gProc.g1.dd1.enabled = win.gProc.g1.dd2.enabled = true;
		} else {
			win.gProc.g1.dd1.enabled = win.gProc.g1.dd2.enabled = false;
		}
	}
	win.gProc.g1.cb1.onClick();

	win.gProc.g2 = win.gProc.add("group", undefined);
	win.gProc.g2.orientation = "row";
	win.gProc.g2.cb1 = win.gProc.g2.add("checkbox", undefined, "Resize to fit");
	win.gProc.g2.cb1.preferredSize.width = 90;
	win.gProc.g2.st1 = win.gProc.g2.add("statictext", undefined, "Width:");
	win.gProc.g2.et1 = win.gProc.g2.add("edittext");
	win.gProc.g2.et1.preferredSize.width = 50;
	win.gProc.g2.st2 = win.gProc.g2.add("statictext", undefined, "px");
	win.gProc.g2.st3 = win.gProc.g2.add("statictext", undefined, "Height:");
	win.gProc.g2.et2 = win.gProc.g2.add("edittext");
	win.gProc.g2.et2.preferredSize.width = 50;
	win.gProc.g2.st4 = win.gProc.g2.add("statictext", undefined, "px");
	win.gProc.g2.dd1 = win.gProc.g2.add("dropdownlist", undefined, undefined, 
		{items: ["Before action", "After action"]});
	win.gProc.g2.dd1.selection = 0;
	win.gProc.g2.et1.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) this.text = this.text.replace(/[^\-\.\d]/g, '');
	}
	win.gProc.g2.et2.onChanging = function() {
		if (this.text.match(/[^\-\.\d]/)) this.text = this.text.replace(/[^\-\.\d]/g, '');
	}
	win.gProc.g2.cb1.onClick = function() {
		if (win.gProc.g2.cb1.value) {
			win.gProc.g2.et1.enabled = win.gProc.g2.et1.active = true;
			win.gProc.g2.et2.enabled = true;
			win.gProc.g2.dd1.enabled = true;
		} else {
			win.gProc.g2.et1.enabled = win.gProc.g2.et2.enabled = false;
			win.gProc.g2.dd1.enabled = false;
		}
	}
	win.gProc.g2.cb1.onClick();

	// Panel 5: Output options
	win.gSave = win.main.add("panel", undefined, "Output options");
	win.gSave.orientation = "column";
	win.gSave.alignChildren = "left";

	win.gSave.g1 = win.gSave.add("group", undefined);
	win.gSave.g1.orientation = "row";
	win.gSave.g1.cb1 = win.gSave.g1.add("checkbox", undefined, "TIFF:");
	win.gSave.g1.dd1 = win.gSave.g1.add("dropdownlist", undefined, undefined, 
		{items: ['LZW', 'ZIP', 'JPG', 'None']});
	win.gSave.g1.dd1.selection = 0;
	win.gSave.g1.dd1.enabled = false;
	win.gSave.g1.cb1.onClick = function() {
		if (win.gSave.g1.cb1.value) {
			win.gSave.g1.dd1.enabled = true;
		} else {
			win.gSave.g1.dd1.enabled = false;
		}
	}

	win.gSave.g1.cb2 = win.gSave.g1.add("checkbox", undefined, "PSD");

	win.gSave.g1.cb3 = win.gSave.g1.add("checkbox", undefined, "PNG:");
	win.gSave.g1.dd2 = win.gSave.g1.add("dropdownlist", undefined, undefined);
	for (var a = 0; a < 101; a++) win.gSave.g1.dd2.add('item', a);
	win.gSave.g1.dd2.selection = 80;
	win.gSave.g1.dd2.enabled = false;
	win.gSave.g1.cb3.onClick = function() {
		if (win.gSave.g1.cb3.value) {
			win.gSave.g1.dd2.enabled = true;
		} else {
			win.gSave.g1.dd2.enabled = false;
		}
	}

	win.gSave.g1.cb4 = win.gSave.g1.add("checkbox", undefined, "JPG:");
	win.gSave.g1.dd3 = win.gSave.g1.add("dropdownlist", undefined, undefined, 
		{items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]});
	win.gSave.g1.dd3.selection = 7;
	win.gSave.g1.dd3.enabled = false;
	win.gSave.g1.cb4.onClick = function() {
		if (win.gSave.g1.cb4.value) {
			win.gSave.g1.dd3.enabled = true;
			win.gSave.g2.cb1.value = false;
			win.gSave.g2.dd1.enabled = false;
		} else {
			win.gSave.g1.dd3.enabled = false;
		}
	}
	win.gSave.g1.cb4.value = true;

	win.gSave.g1.cb5 = win.gSave.g1.add("checkbox", undefined, "PDF");

	win.gSave.g2 = win.gSave.add("group", undefined);
	win.gSave.g2.orientation = "row";
	win.gSave.g2.cb1 = win.gSave.g2.add("checkbox", undefined, "Save For Web JPG:");
	win.gSave.g2.dd1 = win.gSave.g2.add("dropdownlist", undefined, undefined);
	for (var a = 1; a < 101; a++) win.gSave.g2.dd1.add('item', a);
	win.gSave.g2.dd1.selection = 79;
	win.gSave.g2.dd1.enabled = false;
	win.gSave.g2.cb1.onClick = function() {
		if (win.gSave.g2.cb1.value) {
			win.gSave.g1.cb4.value = false;
			win.gSave.g1.dd2.enabled = false;
			win.gSave.g2.dd1.enabled = true;
		} else {
			win.gSave.g2.dd1.enabled = false;
		}
	}

	// Ok/Cancel group
	win.gOkCancel = win.add("group", undefined);
	win.gOkCancel.orientation = "column";
	win.gOkCancel.alignChildren = "fill";
	win.gOkCancel.bu1 = win.gOkCancel.add("button", undefined, "Ok", {name: "ok"});
	win.gOkCancel.bu2 = win.gOkCancel.add("button", undefined, "Cancel", {name: "cancel"});

	// Process all PDFs
	win.gOkCancel.bu1.onClick = function() {
		if (win.gIO.g2.et1.text == '') { alert("No file or folder has been selected."); return }
		if (win.gIO.g4.cb1.value == false && win.gIO.g3.et1.text == '') { alert("No output folder has been selected."); return }
		if (win.gProc.g2.cb1.value == true && win.gProc.g2.et1.text == '') { alert("No resize width value has been entered."); return }
		if (win.gProc.g2.cb1.value == true && win.gProc.g2.et2.text == '') { alert("No resize height value has been entered."); return }
		if (win.gPages.rb3.value == true) {
			if (win.gPages.et1.text == '') { alert("No number has been entered in the 'From' field."); return }
			if (win.gPages.et2.text == '') { alert("No number has been entered in the 'To' field."); return }
			if (Number(win.gPages.et1.text) > Number(win.gPages.et1.text)) { alert("To field should be greater than the 'From' field."); return }
		}
		var saveFiles = 0;
		if (win.gSave.g1.cb1.value) saveFiles++;
		if (win.gSave.g1.cb2.value) saveFiles++;
		if (win.gSave.g1.cb3.value) saveFiles++;
		if (win.gSave.g1.cb4.value) saveFiles++;
		if (win.gSave.g1.cb5.value) saveFiles++;
		if (win.gSave.g2.cb1.value) saveFiles++;
		if (saveFiles == 0) { alert("No save format has been selected."); return }
		win.close(0);
		var folders = [];
		app.displayDialogs = DialogModes.NO;
		var strtRulerUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		if (win.gIO.g1.rb1.value == true) processPDF(topLevelFolder) // Single file
		if (win.gIO.g1.rb2.value == true) { // Folder of PDFs
			folders[0] = Folder(topLevelFolder);
			var fileList = folders[0].getFiles("*.pdf");
			for (var f in fileList) processPDF(fileList[f]);
		}
		if (win.gIO.g1.rb3.value == true) { // Folder and sub folders of PDFs
			folders = FindAllFolders(topLevelFolder, folders);
			folders.unshift(topLevelFolder);
			for (var z in folders) {
				var fileList = folders[z].getFiles("*.pdf");
				for (var k in fileList) processPDF(fileList[k]);
			}
		}
		app.preferences.rulerUnits = strtRulerUnits;

		function processPDF(pdfFile) {
			var noOfDocs = app.documents.length;
			if (win.gPages.rb1.value == true) { pageStart = 1; pageEnd = 2 } // One page only
			if (win.gPages.rb2.value == true) { pageStart = 1; pageEnd = 9999 } // All pages
			if (win.gPages.rb3.value == true) { // Range of pages
					pageStart = Number(win.gPages.et1.text);
					pageEnd = (Number(win.gPages.et2.text) + 1);
			}
			var fileCount = 0;
			if (win.gIO.g4.cb1.value) outputFolder = pdfFile.path;
			var Name = decodeURI(pdfFile.name.replace(/\.[^\.]+$/, ''));
			for (var a = pageStart; a < pageEnd; a++) {
				var res = Number(win.gMode.g1.et1.text);
				var modes = ['ECMY', 'RGBC', 'Grys', 'LbCl'];
				var mode = modes[win.gMode.g1.dd1.selection.index];
				var bits = [8, 16];
				var BitDepth = bits[win.gMode.g1.dd2.selection.index];
				var cropTo = ['boundingBox', 'mediaBox', 'cropBox', 'bleedBox', 'trimBox', 'artBox'];
				var cropto = cropTo[win.gMode.g2.dd1.selection.index];
				rasterizePDF(a, res, mode, BitDepth, cropto, pdfFile);
				if (app.documents.length == noOfDocs) return; // No document opened
				fileCount++;
				if (win.gMode.g2.cb1.value) app.activeDocument.flatten();
				var saveFile = outputFolder + "/" + Name;
				if (fileCount != 1 &&
					(win.gPages.rb2.value == true || // All pages
					win.gPages.rb3.value == true)) { // Range
					saveFile = saveFile + "-" + zeroPad(fileCount, 1);
				}
				if (win.gProc.g2.cb1.value == true && win.gProc.g2.dd1.selection.index == 0)
					FitImage(Number(win.gProc.g2.et1.text), Number(win.gProc.g2.et2.text));
				if (win.gProc.g1.cb1.value) 
					doAction(win.gProc.g1.dd2.selection.text.toString(), win.gProc.g1.dd1.selection.text.toString());
				if (win.gProc.g2.cb1.value == true && win.gProc.g2.dd1.selection.index == 1)
					FitImage(Number(win.gProc.g2.et1.text), Number(win.gProc.g2.et2.text));
				// Save files
				if (win.gSave.g1.cb1.value) {
					tifsaveFile = File(saveFile + ".tif");
					SaveTIFF(saveFile, win.gSave.g1.dd1.selection.index);
				}
				if (win.gSave.g1.cb2.value) {
					psdsaveFile = File(saveFile + ".psd");
					SavePSD(psdsaveFile);
				}
				if (win.gSave.g1.cb3.value) {
					pngsaveFile = File(saveFile + ".png");
					sfwPNG24(pngsaveFile, (win.gSave.g1.dd2.selection.index + 1));
				}
				if (win.gSave.g1.cb4.value) {
					jpgsaveFile = File(saveFile + ".jpg");
					SaveJPEG(jpgsaveFile, (win.gSave.g1.dd3.selection.index + 1));
				}
				if (win.gSave.g1.cb5.value) {
					pdfsaveFile = File(saveFile + ".pdf");
					SavePDF(pdfsaveFile);
				}
				if (win.gSave.g2.cb1.value) { // Safe For Web JPG
					sfwsaveFile = File(saveFile + ".jpg");
					SaveForWeb(sfwsaveFile, (win.gSave.g2.dd1.selection.index + 1));
				}
				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
			} // End From/To
		} // End processPDF
	} // End process
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
		case 0: tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW; break;
		case 1: tiffSaveOptions.imageCompression = TIFFEncoding.TIFFZIP; break;
		case 2: tiffSaveOptions.imageCompression = TIFFEncoding.JPEG; break;
		case 3: tiffSaveOptions.imageCompression = TIFFEncoding.NONE; break;
		default: break;
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
		try { desc = executeActionGet(ref) } catch (e) { break } finally { $.level = lvl }
		if (desc.hasKey(charIDToTypeID('Nm  '))) {
			var set = {}
			set.index = i;
			set.name = desc.getString(charIDToTypeID('Nm  '));
			set.toString = function() { return this.name }
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
	if (!aset) { throw 'Action set must be specified' }
	while (true) {
		var ref = new ActionReference();
		ref.putIndex(charIDToTypeID('ASet'), i);
		var desc;
		try { desc = executeActionGet(ref) } catch (e) { break }
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
