jQuery(document).ready(function () {
	function urldecode(str) {
		return decodeURIComponent((str + '').replace(/\+/g, '%20'));
	}

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

	var kanji = getUrlVars()["kanji"];
	if (kanji == null) {
		kanji = jQuery('#kanji').val();
	} else {
		jQuery('#kanji').val(kanji);
	}
	var cg = getShowGroups();
	if (cg) {
		jQuery('#colorGroups').prop('checked', true);
	}
	KanjiViewer.initialize(
		"kanjiViewer",
		jQuery('#strokeWidth').val(),
		jQuery('#fontSize').val(),
		jQuery('#zoomFactor').val(),
		jQuery('#displayOrders:checked').val(),
		jQuery('#colorGroups:checked').val(),
		kanji
	);
	jQuery('#kanjiViewerParams').submit(runKanjiViewer);
});

function runKanjiViewer() {
	KanjiViewer.setStrokeOrdersVisible(jQuery('#displayOrders:checked').val());
	KanjiViewer.setColorGroups(jQuery('#colorGroups:checked').val());
	KanjiViewer.setKanji(jQuery('#kanji').val());
	KanjiViewer.refreshKanji();
	return false;
}
