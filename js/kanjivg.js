var debug=true;
function msg(s) {
	if (! debug) {
		return;
	}
	console.log(s);
}

// Convert kanji into a hexadecimal
function kanjiToHex(kanji) {
	var kcode = kanji.codePointAt(0)
	var hex = kcode.toString(16);
	var zeros = 5 - hex.length;
	hex = "0".repeat(zeros) + hex;
	return hex;
}

// Returns the github URL of a kanji specified by a string. Only the
// first kanji in the string is used.
function kanjiURL(kanji) {
	var hex = kanjiToHex(kanji); 
	return 'kanjivg/kanji/' + hex + '.svg'
}

var index;

function loadIndex() {
	msg("Loading index");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "kanjivg/kvg-index.json", false);
	xhr.onload = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			try {
				index = JSON.parse(xhr.responseText);
				msg("Index loaded OK " + index["感"]);
			} catch {
				console.log("Failed to parse JSON");
			}
		}
	}
	xhr.send("");
}

function urldecode(str) {
	return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

// Return the variables in the URL
function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = urldecode(hash[1]);
	}
	return vars;
}
