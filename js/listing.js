function listing() {
	loadIndex();
	listEl = document.getElementById("kanji-listing");
	for (var k in index) {
		knode = document.createElement("a");
		ktext = document.createTextNode(k);
		knode.appendChild(ktext);
		knode.href = "viewer.html?kanji=" + k;
		listEl.appendChild(knode);
	}
}

