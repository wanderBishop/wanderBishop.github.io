var articles = [];

var displayedArticles = [];		
console.log("importing main.js");
function Article(releaseDate, title, link, source, publicationDate, category, tags, quote, id) {
	this.releaseDate = releaseDate,
	this.title = title,
	this.link = link,
	this.source = source,
	this.pubDate = publicationDate,
	this.category = category,
	this.tags = tags,
	this.quote = quote,
	this.id = id,
	this.searchVal = 0;
}

var importFile = function() {
	console.log("started import");
	var file = "articles.txt";
	console.log(file);
	$.get(file, function(data) {
		console.log("got"+$.isPlainObject(data));
		var lines = data.split("\n");
		for(var id = 0; id < lines.length; id++) {
			parseLine(lines[id]);
		}	
		console.log("done parsing.");
		displayedArticles = articles;
		console.log(displayedArticles);
	}, "text");
	console.log("done getting");
};

importFile();

var parseLine = function(line, id) {
	if(line.length<1) return;
	var elements = line.split(",");
	if(elements[2]!="x") return;
	console.log(elements);
	elements = rejoin(elements);
	//if(elements[2].startsWith("\"")) elements[2]=elements[2].slice(1,elements[2].length-1)
	//if(elements[7].startsWith("\"")) elements[7]=elements[7].slice(1,elements[7].length-1);
	if(elements[8].endsWith("\"") && elements[8].length>2) elements[8]=elements[8].slice(0,elements[8].length-1);
	//console.log(elements);
	var elem = new Article(elements[0], elements[3], elements[4], elements[5], elements[6], elements[7], elements[8], elements[10], id);
	displayArticle(elem);
	articles.push(elem);
	console.log("added an element.");
}

var rejoin = function(elements) {
	for(var i = 0; i<elements.length; i++) {
		if(elements[i].startsWith("\"") && !elements[i].endsWith("\"")) {
			var j=1;
			while(!elements[i+j].endsWith("\"") && i+j<elements.length-1) {
				elements[i]+=","+elements[i+j];
				j++;
			}
			elements[i]+=","+elements[i+j];
			
			elements[i]=elements[i].slice(1,elements[i].length-1);
			elements.splice(i+1,j);
		}
	}
	return elements;
}

var search = function() {
	console.log("searching");
	articles.forEach(function(elem) {
		elem.searchVal = 0;
	});
	var terms = $("input:text").val().toLowerCase();
	var item = document.getElementById("searchType").selectedIndex;
	console.log(terms);
	var termArray = terms.split(" ");
	console.log(termArray);
	var articleArray = [];
	for(var i = 0; i< articles.length; i++) {
		for(var j = 0; j<termArray.length; j++) {
			switch (item) {
				
				case 0:
					if(articles[i].title.toLowerCase().contains(termArray[j])) {
						console.log("article: "+articles[i].title);
						var found = false;
						for(var k = 0; k<articleArray.length;k++) {
							if(articleArray[k].title === articles[i].title) {
								console.log("repeat");
								articleArray[k].searchVal++;
								found = true;
							}
						}
						if(!found) {
							articleArray.push(articles[i]);
						}
					}
					break;
			
				case 1:
					if(articles[i].quote.toLowerCase().contains(termArray[j])) {
						console.log("article: "+articles[i].title);
						var found = false;
						for(var k = 0; k<articleArray.length;k++) {
							if(articleArray[k].quote === articles[i].quote) {
								console.log("repeat");
								articleArray[k].searchVal++;
								found = true;
							}
						}
						if(!found) {
							articleArray.push(articles[i]);
						}
					}
					break;
			
				case 2:
					if(articles[i].tags===termArray[j].toLowerCase()) {
						console.log("article: "+articles[i].title);
						var found = false;
						for(var k = 0; k<articleArray.length;k++) {
							if(articleArray[k].tags === articles[i].tags) {
								console.log("repeat");
								articleArray[k].searchVal++;
								found = true;
							}
						}
						if(!found) {
							articleArray.push(articles[i]);
						}
					}
					break;
					
				case 3:
					var src = termArray.join(" ");
					if(articles[i].source.toLowerCase()===src.toLowerCase()) {
						console.log("article: "+articles[i].title);
						var found = false;
						for(var k = 0; k<articleArray.length;k++) {
							if(articleArray[k].source === articles[i].source) {
								console.log("repeat");
								articleArray[k].searchVal++;
								found = true;
							}
						}
						if(!found) {
							articleArray.push(articles[i]);
						}
					}
					break;
				
				default:
					console.log("error: " +item);
					return;
			}
		}
	}
	articleArray.sort(function(a,b) { return b.searchVal-a.searchVal});
	console.log(articleArray);
	display(articleArray);
}	

var display = function(arr) {
	console.log("displaying");
	$("#results").empty();
	console.log("cleared?");	
	arr.forEach(function(elem) {
		displayArticle(elem)
	});
	displayedArticles = arr;
}

var sort = function() {
	console.log("sorting");
	var item = document.getElementById("sortType").selectedIndex;
	displayedArticles.sort(function(a,b) {
		switch(item) {
			case 0:
				console.log("relevance");
				return  b.searchVal - a.searchVal;
				
			case 1:
				console.log("date");
				var Ainfo = a.pubDate.split("/");
				var Binfo = b.pubDate.split("/");
				var aDate = new Date();
				aDate.setFullYear("20"+Ainfo[2],Ainfo[0]-1,Ainfo[1]);
				var bDate = new Date();
				bDate.setFullYear("20"+Binfo[2],Binfo[0]-1,Binfo[1]);
				return bDate - aDate;
				
			case 2:
				console.log("source");
				if(a.source.toLowerCase()>b.source.toLowerCase()) return 1;
				if(a.source.toLowerCase()<b.source.toLowerCase()) return -1;
				return 0;
				
			default:
				console.log("error")
				return 0;
		}
	});
	$("#results").empty();
	display(displayedArticles);
}
	
var autoSearcher = function(categoryIndex, terms) {
	$("input:text").value = terms;
	document.getElementById("searchType").selectedIndex = categoryIndex;
	search();
}

var displayArticle = function(elem) {
	$("#results").append('<div class="result"><div id="first-line"><a href="'+elem.link+'">'+elem.title+'</a><p>'+elem.releaseDate+'</p></div><div id="source-line"><p>'+elem.source+'</p><p> '+elem.pubDate+'</p></div><div id="quote">'+elem.quote+'</div><div id="tags">'+elem.tags+'</div></div>');
}
	
console.log("more checks");

		
