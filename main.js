$(document).ready(function () {
	init();
});

var caseIgnore = false;	//true
var highlightedKeywords = {};

function init () {
	$('#input').on('keyup', function () {		
		displayWords();
	});
	
	$('#input').on('paste', function () {		
		setTimeout(function () {
			cleanContent();
		}, 500);
	});

	$('.keyword').live('click', function () {
		highlightKeyword($(this));
	});
	
	$('#input').attr('contenteditable', 'true').focus();
}

function cleanContent () {
	var content = $('#input').html();
	
	// remove ms-word comments
	content = content.replace(/<!--[\s\S]*?-->/g, '');

	// remove all tags
	content = content.replace(/<\/?[^>]+>/gi, '');
	
	// remove double space	
	content = content.replace(/&nbsp;/gi, ' ');
	content = content.replace(/\s{2,}/g, ' ');

	
	$('#input').html(content);
}

function displayWords () {
	var wordsArray = getWordsFromText();

	var sortedWordsArray = sortWordsArray(wordsArray);
	
	outputWordsArray(sortedWordsArray);
}

function getWordsFromText () {
	var content = $('#input').html();

	content = content.replace(/&nbsp;/gi, ' ');
	content = content.replace(/(<\/?[^>]+>)/gi, ' ');
	
	//content = content.replace(/\d/g, '');
	content = content.replace(/[^\w\säöüÄÖÜß\-áàéèóòúùÁÀÉÈÓÒÚÙ]/g, '');
	
	if (caseIgnore) {
		content = content.toLowerCase();
	}

	var wordsArray = content.match(/\S+/g);

	return wordsArray;
}

function sortWordsArray (unSortedWordsArray) {
	var sortedWordsArray = {};

	$.each(unSortedWordsArray, function (key, value) {
		if (sortedWordsArray[value] === undefined) {
			sortedWordsArray[value] = 1;
		} else {
			sortedWordsArray[value]++;
		}
	});
	
	var tempWordsArray = sortedWordsArray;
	sortedWordsArray = {};
	var keys = [];
	for (var prop in tempWordsArray) {
	    keys.push(prop);
	}
	keys.sort();
	for (var i = 0; i < keys.length; i++) {
		sortedWordsArray[keys[i]] = tempWordsArray[keys[i]];
	}
	
	return sortedWordsArray;
}

function outputWordsArray (sortedWordsArray) {
	var listString = '';
	
	$.each(sortedWordsArray, function (key, value) {
		listString += '<li><input class="keyword" type="button" value="'+key+'"> ('+value+')</li>';
	});

	$('#wordlist').html(listString);
}

function highlightKeyword (button) {
	var keyword = button.val();
	
	var regExpString;
	var htmlContent = $('#input').html();
	
	if (button.hasClass('active')) {
		regExpString = new RegExp('<span class="highlight">'+keyword+'</span>', 'g');
		htmlContent = htmlContent.replace(regExpString, keyword);
	} else {
		regExpString = new RegExp('\\b('+keyword+')\\b', 'g');
		htmlContent = htmlContent.replace(regExpString, '<span class="highlight">'+keyword+'</span>');
	}
	
	$('#input').html(htmlContent);
	
	button.toggleClass('active');
}

function unHighlightKeyword (keyword) {
	
}
