// Convert kanji into a hexadecimal
function kanjiToHex(kanji) {
	return '0' + kanji.charCodeAt(0).toString(16);
}
// Returns the github URL of a kanji specified by a string. Only the
// first kanji in the string is used.
function kanjiURL(kanji) {
	return 'kanjivg/kanji/0' + kanji.charCodeAt(0).toString(16) + '.svg'
}

function loadKanjiVG(img, el, kanji) {
	img.innerHTML = '';
	img.appendChild(el.documentElement);
	var hk = kanjiToHex(kanji);
	var baseID = "kvg:" + hk;
	console.log(baseID);
	var baseEl = document.getElementById(baseID);
	console.log(baseEl);
	baseEl.style.stroke = "#FC8";
    const paths = baseEl.getElementsByTagName("path");
	console.log(paths);
	textBaseID = "kvg:StrokeNumbers_" + hk;
	var textBaseEl = document.getElementById(textBaseID);
	const texts = textBaseEl.getElementsByTagName("text");
	console.log(texts);
	var i = 0;
	for (var path of paths) {
		var colour = "#" + randomColour();
		path.style.stroke = colour;
		console.log(" path = "+path + " colour = " + colour);
		texts[i].style.fill = colour;
		i++;
	}
}

function randomColour() {
	var colour = new String();
	for (var i = 0; i < 3; i++) {
		var random16 = Math.floor (Math.random() * 16);
		colour = colour.concat (random16.toString(16).toUpperCase());
	}
	return colour;
}


function getKanjiVG(kanji) {
	var xhr = new XMLHttpRequest();
	var url = kanjiURL(kanji);
	xhr.open("GET", url, false);
	// Following line is just to be on the safe side;
	// not needed if your server delivers SVG with correct MIME type
	xhr.overrideMimeType("image/svg+xml");
	xhr.onload = function(e) {
		// You might also want to check for xhr.readyState/xhr.status here
		loadKanjiVG(img, xhr.responseXML, kanji);
	};
	xhr.send("");
}

function setKanjiDrawing(kanji) {
	console.log("kanji is "+kanji);
	img = document.getElementById("kanji-image");
	console.log(img);
	getKanjiVG(kanji);
}
KanjiViewer = {
    initialize:function (divName, strokeWidth, fontSize, zoomFactor, displayOrders, colorGroups, kanji) {
		this.img = document.getElementById("kanji-image");
        this.paper = new Raphael(divName, '100%', '100%');
        this.strokeWidth = strokeWidth;
        this.fontSize = fontSize;
        this.displayOrders = displayOrders;
        this.colorGroups = colorGroups;
        this.kanji = kanji;
        this.fetchNeeded = true;
        this.setZoom(zoomFactor);
        this.refreshKanji();
    },
    setZoom:function (zoomFactor) {
        this.paper.setViewBox(0, 0, 109, 109);
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
			setKanjiDrawing(this.kanji);
/*
			var kanji = this.kanji;
			var url = kanjiURL(this.kanji);
            var parent = this;
            this.paper.clear();
            var loader = this.paper.text(0, 0, 'Loading ' + this.kanji);
            loader.attr({
                'x':50,
                'y':50,
                'fill':'black',
                'font-size':18,
                'text-anchor':'start'
            });
            jQuery.ajax({
                url:url,
                dataType:'xml',
                success:function (results) {
                    parent.fetchNeeded = false;
                    parent.xml = results;
                    parent.drawKanji();
					setKanjiDrawing(kanji);
                },
                statusCode:{
                    404:function () {
                        parent.paper.clear();
                        var error = parent.paper.text(0, 0, parent.kanji + ' not found');
                        error.attr({
                            'x':50,
                            'y':50,
                            'fill':'black',
                            'font-size':18,
                            'text-anchor':'start'
                        });
                    }
                }
            });
        } else {
            this.drawKanji();
*/
        }
    },
/*
    createStroke:function (path, color) {
        var stroke = this.paper.path(jQuery(path).attr('d'));
        stroke['initialColor'] = color;
        stroke.attr({
            'stroke':color,
            'stroke-width':this.strokeWidth,
            'stroke-linecap':'round',
            'stroke-linejoin':'round'
        });
        return stroke;
    },
    createHover:function (stroke) {
        var onEnteredAnim = Raphael.animation({stroke:'black'}, 300);
        var onLeftAnim = Raphael.animation({stroke:stroke['initialColor']}, 300);
        stroke.hover(
                function () {
                    this.animate(onEnteredAnim);
                }, function () {
                    this.animate(onLeftAnim);
                }
        );
    },
    createHovers:function (strokes) {
        var parent = this;
        var onEnteredAnim = Raphael.animation({stroke:'black'}, 300);
        var onLeftAnim = Raphael.animation({stroke:strokes[0]['initialColor']}, 300);
        for (var i = 0; i < strokes.length; i++) {
            var stroke = strokes[i];
            stroke.hover(
                    function () {
                        for (var j = 0; j < strokes.length; j++) {
                            stroke = strokes[j];
                            stroke.attr({
                                'cursor':'pointer'
                            });
                            stroke.animate(onEnteredAnim);
                        }
                    },
                    function () {
                        for (var j = 0; j < strokes.length; j++) {
                            stroke = strokes[j];
                            stroke.animate(onLeftAnim);
                        }
                    }
            );
            stroke.click(function () {
                parent.setKanji(strokes['element']);
                parent.refreshKanji();
            });
        }
    },
    drawKanji:function () {
        var parent = this;
        this.paper.clear();
        Raphael.getColor.reset();
        var groups = jQuery(this.xml).find('svg > g > g > g');
        if (!this.colorGroups || groups.length == 0) {
            jQuery(this.xml).find('path').each(function () {
                var color = Raphael.getColor();
                var stroke = parent.createStroke(this, color);
                parent.createHover(stroke);
            });
        } else {
            groups.each(function () {
                var color = Raphael.getColor();
                parent.paper.setStart();
                jQuery(this).find('path').each(function () {
                    parent.createStroke(this, color);
                });
                var set = parent.paper.setFinish();
                var element = jQuery(this).attr('kvg:element');
                if (element == undefined) {
                    var inners = jQuery(this).find('g');
                    for (var i = 0; i < inners.length; i++) {
                        element = jQuery(inners[i]).attr('kvg:element');
                        if (element !== undefined) {
                            set['element'] = element;
                            break;
                        }
                    }
                } else {
                    set['element'] = element;
                }
                parent.createHovers(set);
            });
        }
        jQuery(this.xml).find('text').each(function () {
            var color = Raphael.color('#000');
            var text = jQuery(this).text();
            var transform = jQuery(this).attr('transform');
            var x = transform.split(' ')[4];
            var y = transform.split(' ')[5].replace(')', '');
            var order = parent.paper.text(x, y, text);
            order.attr({
                'fill':color,
                'font-size':parent.fontSize,
            });
            if (!parent.displayOrders) {
                order.hide();
            }
        });
    }
*/
};
function changeBox() {
	runKanjiViewer();
}
