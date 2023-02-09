jQuery(document).ready(function () {

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
