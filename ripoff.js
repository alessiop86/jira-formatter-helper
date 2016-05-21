function formatBlock(tag) {
    document.execCommand('formatBlock', false, '<'+tag+'>');
}
function format2(formatStyle) {
    document.execCommand(formatStyle, false, null);
}
function printTags(section,tags) {
    for (var i=0;i<tags.length;i++) {
        var buttonHtml = "<button onclick=\"formatBlock('"+tags[i]+"');\">"+tags[i].toUpperCase()+"</button>";
        $(section).append(buttonHtml);
    }
}


function printFormat(section,format) {
    var buttonHtml = "<button onclick=\"format2('"+format+"');\">"+format.toUpperCase()+"</button>";
    $(section).append(buttonHtml);
}

function insertHTML(html) {
    document.execCommand('insertHTML', true, html);
}

$(document).ready(function() {
    var tags = [ 'h1', 'h2', 'h3', 'h4', 'h5','h6'];
    printTags("#buttons_1",tags);
    printFormat("#buttons_2",'underline');
    printFormat("#buttons_2",'bold');
    printFormat("#buttons_2",'italic');


	var html1='<div>ajdjajd<h1>jds</h1></div>';
    //var html1 = '<div style=\x22margin: 10px 0 10px 0; border-style: dashed; border-width: 1px; border-color: #ccc; \x22><div style=\x22border-style: dashed; border-width: 0 0 1px 0; border-color: #ccc; background-color: #F7D6C1; padding: 3px;\x22><b>My Title</b></div><div style=\x22padding: 5px; background-color: #FFFFCE; \x22>a block of text surrounded with a <b>panel</b><br>yet <em class=\x22emphasis\x22>another</em> line</div></div>';

    $("#buttons_2").append("<button onclick=\"insertHTML('"+html1+"');\">panel</button>");
});

    //displays HTML of the output
    function displayhtml()
    {
        //set textContent of pre tag to the innerHTML of editable div. textContent can take any form of text and display it as it is without browser interpreting it. It also preserves white space and new line characters.
        document.getElementsByClassName("htmloutput")[0].textContent = document.getElementsByClassName("editor")[0].innerHTML;
    }
	
    function displayJiraMarkoutSource()
    {        
         var html= document.getElementsByClassName("editor")[0].innerHTML;
		 var jiraMarkoutSource = jiraMarkoutSourceParser(html);
		 document.getElementsByClassName("htmloutput")[0].textContent = jiraMarkoutSource;
    }
	
	
	function jiraMarkoutSourceParser(str) {
		str = parseNewlines(str);
		str = parseHeadings(str);
		str = parseFormats(str);		
		return str;
	}
	
	var headingsRegex = new RegExp("<(h[1-6])>(.*?)</h[1-6]>", "gi");		
	function parseHeadings(str) {		
		return str.replace(headingsRegex, function($fullmatch, $1,$2,$3){
			return "." + $1 + " " + $2 + '\n';		
		});		
	}
	
	/*var patterns = ['<div><span style="font-style: italic;">(.*?)</span></div>', 
						'<div><span style="font-weight: bold;">(.*?)</span></div>', 
						'<div><span style="text-decoration: underline;">(.*?)</span></div>',
						'<div><span style="font-weight: bold; font-style: italic;">(.*?)</span></div>',
						'<div><span style="font-weight: bold; text-decoration: underline;">(.*?)</span></div>',
						'<div><span style="font-style: italic; text-decoration: underline;">(.*?)</span></div>',
						'<div><span style="font-style: italic; font-weight: bold; text-decoration: underline;">(.*?)</span></div>'];*/
	var patterns = ['<span style="font-style: italic;">(.*?)</span>', 
						'<span style="font-weight: bold;">(.*?)</span>', 
						'<span style="text-decoration: underline;">(.*?)</span>',
						'<span style="font-weight: bold; font-style: italic;">(.*?)</span>',
						'<span style="font-weight: bold; text-decoration: underline;">(.*?)</span>',
						'<span style="font-style: italic; text-decoration: underline;">(.*?)</span>',
						'<span style="font-style: italic; font-weight: bold; text-decoration: underline;">(.*?)</span>'];
	var replacements = ['_', '*', '+', '*_', '*+', '_+', '+*_'];	
	function parseFormats(str) {	
		for (var i=0;i<patterns.length;i++) {
			var re = new RegExp(patterns[i],"g");
			str = str.replace(re, function(matched,$1){			
			  return replacements[i] + $1 + replacements[i];
			});
		}
		return str;
	}
	
	function parseNewlines(str) {	
		return 	str.replace(/<br>/g,'').replace(/<div>/g,'').replace(/<\/div>/g,'\n');
	}
