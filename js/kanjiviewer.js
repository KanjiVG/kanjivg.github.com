// These colours are used to colour the different groups of the kanji.
var colours = Array("red", "orange", "green", "blue", "goldenrod");

const kanjiSVGID = "kanji-svg";

function displayOrders() {
	var displayOrdersEl = document.getElementById("displayOrders");
	var doc = displayOrdersEl.checked;
	return doc;
}

function colorGroups() {
	var displayOrdersEl = document.getElementById("colorGroups");
	var doc = displayOrdersEl.checked;
	return doc;
}

const showGroups = "show-groups";

function getShowGroups() {
	var sg = localStorage.getItem(showGroups);
	if (sg === "on") {
		return true;
	}
	return false;
}

function setShowGroups(onOff) {
	localStorage.setItem(showGroups, onOff);
}


function groups() {
	var img = document.getElementById("group-images");
	return img;
}

function removeGroups() {
	groups().innerHTML = '';
}

const noElement = "No element";

// Given svg data, find the groups within it, and return an object
// where the keys are the kanji of the elements, and the values are
// arrays consisting of the groups of svg which contain that kanji.
function findSVGGroups(svg) {
	var kanji2group = new Object();
	const gs = svg.getElementsByTagName("g");
	for (var group of gs) {
		if (group.id.match(/kvg:Stroke(Numbers|Paths)/)) {
			continue;
		}
		var element = group.getAttribute("kvg:element");
		if (! element) {
			element = noElement;
		}
		if (! kanji2group[element]) {
			kanji2group[element] = new Array;
		}
		kanji2group[element].push(group.id);
	}
	return kanji2group;
}

function addImage(gs, k, svgCopy) {
	msg("kanji is " + k + " in index: " + index[k]);
	var top;
	top = document.createElement("div");
	var figure = document.createElement("figure");
	figure.appendChild(svgCopy);
	svgCopy.classList.add("group-svg");
	var figCaption = document.createElement("figcaption");
	figCaption.appendChild(document.createTextNode(k));
	figure.appendChild(figCaption);
	top = document.createElement("div");
	if (k == noElement || ! index[k]) {
		// Don't add links if this doesn't have an element.
		top.appendChild(figure);
		gs.insertBefore(top, gs.children[0]);
	} else {
		// Add a link.

		// When the index of kanjivg is added, here we will add a
		// check that the kanji actually does exist within
		// KanjiVG.
		var link = document.createElement("a");
		link.href = "?kanji=" + k;
		link.appendChild(figure);
		top.appendChild(link);
		gs.appendChild(top);
	}
	top.classList.add("group-image");
}

// Display the groups within the character. This creates copies of the
// SVG with the group highlighted using a different colour.
function displayGroups(svg, kanji) {
	// If the user happens to input a long string of characters,
	// extract the first one only.
	kanji = Array.from(kanji)[0];
	msg("displaying groups of "+kanji);
	var gs = groups();
	gs.innerHTML = '';
	var kanji2group = findSVGGroups(svg);
	var elePart = new Object();
	for (var k in kanji2group) {
		// Don't display the group if it is the kanji itself. This is
		// the case for the top level group.
		if (k == kanji) {
			msg("k==kanji "+ k + " == " + kanji);
			continue;
		}
		
		var svgcopy = svg.cloneNode(true);
		addImage(gs, k, svgcopy);
		var gps = kanji2group[k];
		var cNum = -1;
		for (let i in gps) {
			// Find the group within the copy of the SVG using
			// getElementById.
			var g = svgcopy.getElementById(gps[i]);
			if (! g) {
				continue;
			}
			// Here we should be checking the part as well as the
			// element. If the element has two parts, they should
			// receive the same colour.
			var element = g.getAttribute("kvg:element");
			var part = g.getAttribute("kvg:part");
			var cont = false;
			if (element && part) {
				var p = parseInt(part);
				msg("elem = "+element+" part= "+part);
				prevPart = elePart[element];
				if (prevPart && prevPart < p) {
					msg("continuing");
					cont = true;
				}
				elePart[element] = p;
			}
			if (! cont) {
				cNum++;
			}
			g.style.stroke = colours[cNum];
			const texts = svgcopy.getElementsByTagName("text");
			for (var text of texts) {
				text.style.display = "none";
			} 
		}
	}
}

// Not totally white colours
const dark = 12;
// This returns a random colour which is not completely white.
function randomColour() {
	var colour = new String();
	for (var i = 0; i < 3; i++) {
		var r = Math.floor(Math.random() * dark);
		colour = colour.concat(r.toString(16).toUpperCase());
	}
	return colour;
}

KanjiViewer = {
	initialize:function (divName, displayOrders, colorGroups, kanji, file) {
		loadIndex();
		this.file = file;
		this.kanji = kanji;
		this.refreshKanji();
		this.animate = new KanjivgAnimate("#animate");
	},
	getKanjiVGURL: function (url, kanji) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		// Following line is just to be on the safe side;
		// not needed if your server delivers SVG with correct MIME type
		xhr.overrideMimeType("image/svg+xml");
		var self = this;
		xhr.onload = function(e) {
			if (this.readyState == 4 && this.status == 200) {
				self.loadKanjiVG(xhr.responseXML);
			}
		};
		xhr.send("");
	},
	getKanjiVGFile: function () {
		msg("Getting file " + this.file);
		var url = fileToKanjiVG(this.file);
		this.kanji = fileToKanji(this.file);
		this.getKanjiVGURL(url);
	},
	// Get the kanjiVG data from the submodule. This starts a request for
	// the data, then loads it when ready using loadKanjiVG.
	getKanjiVG: function () {
		msg("Getting kanji " + this.kanji);
		var url = kanjiURL(this.kanji);
		this.getKanjiVGURL(url);
	},
	// This function is called back after a successful load of a kanji
	// image.
	loadKanjiVG: function (el) {
		document.title = this.kanji + " - KanjiVG";
		var img = document.getElementById("kanji-image");
		img.innerHTML = '';
		var svg = el.documentElement;
		// Use svg.cloneNode here because it contains a reference, so
		// if we append it then we cannot reuse it for the group
		// display. The "true" argument makes a deep copy.
		img.appendChild(svg.cloneNode(true));
		// Add an ID to the SVG element in img so we can apply styles to
		// it.
		img.lastChild.id = kanjiSVGID;
		var hk = kanjiToHex(this.kanji);
		if (this.file) {
			hk = this.file;
			hk = hk.replace(/\.svg/,"");
		}
		var baseID = "kvg:" + hk;
		var baseEl = document.getElementById(baseID);
		const paths = baseEl.getElementsByTagName("path");
		textBaseID = "kvg:StrokeNumbers_" + hk;
		var textBaseEl = document.getElementById(textBaseID);
		const texts = textBaseEl.getElementsByTagName("text");
		// True if we display the stroke order
		var doc = displayOrders(); 
		// True if we show the groups
		var cg = colorGroups();
		var i = 0;
		for (var path of paths) {
			var colour = "#" + randomColour();
			path.style.stroke = colour;
			if (! texts[i]) {
				console.log("Missing label for stroke "+i);
			} else {
				if (doc) {
					texts[i].style.fill = colour;
				} else {
					texts[i].style.fill = "none";
				}
			}
			i++;
		}
		if (cg) {
			displayGroups(svg, this.kanji);
		} else {
			removeGroups();
		}
		var link = document.createElement("a");
		if (this.file) {
			link.href = github + this.file;
		} else {
			link.href = githubURL(this.kanji);
		}
		link.appendChild(document.createTextNode("Image source"));
		var linkP = document.createElement("p");
		linkP.appendChild(link);
		img.appendChild(linkP);
		var files = index[this.kanji];
		if (files.length > 1) {
			msg("Appending variant files");
			var fileP = document.createElement("p");
			fileTitle = document.createElement("b");
			fileTitle.appendChild(document.createTextNode("Variant files: "));
			fileP.appendChild(fileTitle);
			for (var i in files) {
				fileP.appendChild(document.createTextNode(" "));
				var file = files[i];
				var fileA = document.createElement("a");
				fileA.appendChild(document.createTextNode(file));
				fileA.href = "?file=" + file;
				fileP.appendChild(fileA);
			}
			img.appendChild(fileP);
		}
	},
	setStrokeOrdersVisible:function (visible) {
		this.displayOrders = visible;
	},
	setColorGroups:function (colorGroups) {
		this.colorGroups = colorGroups;
	},
	setKanji:function (kanji) {
		msg("setKanji: " + kanji + " this.kanji=" + this.kanji);
		if (kanji != this.kanji && kanji != '' && kanji != undefined) {
			this.kanji = kanji;
		}
	},
	refreshKanji:function () {
		if (this.file) {
			msg("Loading file " + this.file);
			this.getKanjiVGFile();
			return;
		}
		if (this.kanji) {
			msg("Loading kanji " + this.kanji);
			this.getKanjiVG();
			return;
		}
		msg("No kanji or file is specified at the moment");
	},
};

function changeColorGroups() {
	var cg = jQuery('#colorGroups:checked').val();
	setShowGroups(cg);
}

function changeBox() {
	runKanjiViewer();
}
