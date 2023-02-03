var colours = Array("red", "orange", "green", "aliceblue", "goldenrod");
// Convert kanji into a hexadecimal
function kanjiToHex(kanji) {
	return '0' + kanji.charCodeAt(0).toString(16);
}
// Returns the github URL of a kanji specified by a string. Only the
// first kanji in the string is used.
function kanjiURL(kanji) {
	return 'kanjivg/kanji/0' + kanji.charCodeAt(0).toString(16) + '.svg'
}

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

// This function is called back after a successful load of a kanji
// image.
function loadKanjiVG(el, kanji) {
	var img = document.getElementById("kanji-image");
	img.innerHTML = '';
	var stuff = el.documentElement;
	img.appendChild(stuff.cloneNode(true));
	var svg = img.lastChild;
	svg.id = kanjiSVGID;
	var hk = kanjiToHex(kanji);
	var baseID = "kvg:" + hk;
	var baseEl = document.getElementById(baseID);
	baseEl.style.stroke = "#FC8";
    const paths = baseEl.getElementsByTagName("path");
	textBaseID = "kvg:StrokeNumbers_" + hk;
	var textBaseEl = document.getElementById(textBaseID);
	const texts = textBaseEl.getElementsByTagName("text");
	var doc = displayOrders(); 
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
		displayGroups(stuff, kanji);
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

function findSVGGroups(stuff) {
	var kanji2group = new Object();
	const gs = stuff.getElementsByTagName("g");
	for (var group of gs) {
		if (group.id.match(/kvg:Stroke(Numbers|Paths)/)) {
			continue;
		}
		var element = group.getAttribute("kvg:element");
		if (! element) {
			element = "No element";
		}
		if (! kanji2group[element]) {
			kanji2group[element] = new Array;
		}
		kanji2group[element].push(group.id);
	}
	return kanji2group;
}

function displayGroups(stuff, kanji) {
	var gs = groups();
	gs.innerHTML = '';
	var kanji2group = findSVGGroups(stuff);
	for (var k in kanji2group) {
		if (k == kanji) {
			continue;
		}
		var img;
		if (k == "No element") {
			img = document.createElement("div");
		} else {
			img = document.createElement("a");
		}
		img.href = "?kanji=" + k;
		img.appendChild(stuff.cloneNode(true));
		img.classList.add("group-image");
		gs.appendChild(img);
		var svg = img.lastChild;
		var gps = kanji2group[k];
		for (let i in gps) {
			var g = svg.getElementById(gps[i]);
			if (! g) {
				console.log("Nothing for "+gps[i]);
				continue;
			}
			g.style.stroke = colours[i];
			const texts = svg.getElementsByTagName("text");
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

// Get the kanjiVG data from the submodule
function getKanjiVG(kanji) {
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
		// You might also want to check for xhr.readyState/xhr.status here
	};
	xhr.send("");
}

KanjiViewer = {
    initialize:function (divName, strokeWidth, fontSize, zoomFactor, displayOrders, colorGroups, kanji) {
        this.kanji = kanji;
        this.fetchNeeded = true;
        this.refreshKanji();
		this.animate = new KanjivgAnimate("#animate");
    },
    setZoom:function (zoomFactor) {
        this.zoom = zoomFactor;
    },
    setStrokeWidth:function (strokeWidth) {
        this.strokeWidth = strokeWidth;
    },
    setFontSize:function (fontSize) {
        this.fontSize = fontSize;
    },
    setStrokeOrdersVisible:function (visible) {
        this.displayOrders = visible;
    },
    setColorGroups:function (colorGroups) {
        this.colorGroups = colorGroups;
    },
    setKanji:function (kanji) {
        if (kanji != this.kanji && kanji != '' && kanji != undefined) {
            this.kanji = kanji;
            this.fetchNeeded = true;
        }
    },
    refreshKanji:function () {
        if (this.fetchNeeded && this.kanji != "") {
			getKanjiVG(this.kanji);
        }
    },
};
function changeBox() {
	runKanjiViewer();
}
