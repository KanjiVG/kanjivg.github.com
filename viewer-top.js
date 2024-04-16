jQuery(document).ready(function () {
	urlVars = getUrlVars();
	var kanji = urlVars["kanji"];
	if (kanji == null) {
		kanji = jQuery('#kanji').val();
	} else {
		jQuery('#kanji').val(kanji);
	}
	var file = urlVars["file"];
	var cg = getShowGroups();
	if (cg) {
		jQuery('#colorGroups').prop('checked', true);
	}
	var rad = getShowRadicals();
	if (rad) {
		jQuery('#radicals').prop('checked', true);
	}
	var noso = getNoShowSO();
	if (noso) {
		// This is on by default.
		jQuery('#displayOrders').prop('checked', false);
	}
	KanjiViewer.initialize(
		"kanjiViewer",
		jQuery('#displayOrders:checked').val(),
		jQuery('#radicals:checked').val(),
		jQuery('#colorGroups:checked').val(),
		kanji,
		file,
		urlVars
	);
	jQuery('#kanjiViewerParams').submit(runKanjiViewer);
});

function runKanjiViewer() {
	KanjiViewer.setStrokeOrdersVisible(jQuery('#displayOrders:checked').val());
	KanjiViewer.setRadicals(jQuery('#radicals:checked').val());
	KanjiViewer.setColorGroups(jQuery('#colorGroups:checked').val());
	KanjiViewer.setKanji(jQuery('#kanji').val());
	KanjiViewer.refreshKanji();
	return false;
}
