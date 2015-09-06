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