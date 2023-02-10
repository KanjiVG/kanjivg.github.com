// These colours are used to colour the different groups of the kanji.
var colours = Array("red", "orange", "green", "aliceblue", "goldenrod");

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


// This function is called back after a successful load of a kanji
// image.
function loadKanjiVG(el, kanji) {
	document.title = kanji + " - KanjiVG";
	var img = document.getElementById("kanji-image");
	img.innerHTML = '';
	var svg = el.documentElement;
	// Use svg.cloneNode here because it contains a reference, so if
	// we append it then we cannot reuse it for the group display. The
	// "true" argument makes a deep copy.
	img.appendChild(svg.cloneNode(true));
	// Add an ID to the SVG element in img so we can apply styles to
	// it.
	img.lastChild.id = kanjiSVGID;
	var hk = kanjiToHex(kanji);
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
		if (doc) {
			texts[i].style.fill = colour;
		} else {
			texts[i].style.fill = "none";
		}
		i++;
	}
	if (cg) {
		displayGroups(svg, kanji);
	} else {
		removeGroups();
	}
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
	for (var k in kanji2group) {
		// Don't display the group if it is the kanji itself. This is
		// the case for the top level group.
		if (k == kanji) {
			msg("k==kanji "+ k + " == " + kanji);
			continue;
		}
		var img;
		msg("kanji is " + k + " in index: " + index[k]);
		if (k == noElement || ! index[k]) {
			// Don't add links if this doesn't have an element.
			img = document.createElement("div");
			img.appendChild(svg.cloneNode(true));
			gs.insertBefore(img, gs.children[0]);
		} else {
			// Add a link.

			// When the index of kanjivg is added, here we will add a
			// check that the kanji actually does exist within
			// KanjiVG.
			img = document.createElement("a");
			img.href = "?kanji=" + k;
			img.appendChild(svg.cloneNode(true));
			gs.appendChild(img);
		}
		img.classList.add("group-image");
		var svgcopy = img.lastChild;
		var gps = kanji2group[k];
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
			g.style.stroke = colours[i];
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

// Get the kanjiVG data from the submodule. This starts a request for
// the data, then loads it when ready using loadKanjiVG.
function getKanjiVG(kanji) {
	msg("Getting " + kanji);
	var xhr = new XMLHttpRequest();
	var url = kanjiURL(kanji);
	xhr.open("GET", url, false);
	// Following line is just to be on the safe side;
	// not needed if your server delivers SVG with correct MIME type
	xhr.overrideMimeType("image/svg+xml");
	xhr.onload = function(e) {
		if (this.readyState == 4 && this.status == 200) {
			loadKanjiVG(xhr.responseXML, kanji);
		}
	};
	xhr.send("");
}

KanjiViewer = {
	initialize:function (divName, strokeWidth, fontSize, zoomFactor, displayOrders, colorGroups, kanji) {
		loadIndex();
		this.kanji = kanji;
		this.refreshKanji();
		this.animate = new KanjivgAnimate("#animate");
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
		msg("refreshKanji: " + this.kanji);
		if (this.kanji) {
			getKanjiVG(this.kanji);
		}
	},
};

function changeColorGroups() {
	var cg = jQuery('#colorGroups:checked').val();
	setShowGroups(cg);
}

function changeBox() {
	runKanjiViewer();
}
