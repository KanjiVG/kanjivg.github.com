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

// This function is called back after a successful load of a kanji
// image.
function loadKanjiVG(el, kanji) {
	var img = document.getElementById("kanji-image");
	img.innerHTML = '';
	img.appendChild(el.documentElement);
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
	var displayOrdersEl = document.getElementById("displayOrders");
	var doc = displayOrdersEl.checked;
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
		// You might also want to check for xhr.readyState/xhr.status here
		loadKanjiVG(xhr.responseXML, kanji);
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
