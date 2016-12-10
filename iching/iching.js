
(function (app) {
	var hexagramSet = [
		{ name: 'Earth', character : '\u4DC1' },
		{ name: 'Returning', character : '\u4DD7' },                                         
		{ name: 'Leading', character : '\u4DC6' },
		{ name: 'Nearing', character : '\u4DD2' },
		{ name: 'Humbling', character : '\u4DCE' },
		{ name: 'Darkening of the Light', character : '\u4DE3' },
		{ name: 'Ascending', character : '\u4DED' },                        
		{ name: 'Pervading', character : '\u4DCA' },
		{ name: 'Providing For', character : '\u4DCF' },
		{ name: 'Thunder', character : '\u4DF2' },
		{ name: 'Taking-Apart', character : '\u4DE7' },
		{ name: 'Converting the Maiden', character : '\u4DF5' },                        
		{ name: 'Great Exceeding', character : '\u4DFD' },
		{ name: 'Abounding', character : '\u4DF6' },
		{ name: 'Persevering', character : '\u4DDF' },
		{ name: 'Great Invigorating', character : '\u4DE1' },

		{ name: 'Grouping', character : '\u4DC7' },
		{ name: 'Sprouting', character : '\u4DC2' },                                              
		{ name: 'Water', character : '\u4DDC' },                        
		{ name: 'Articulating', character : '\u4DFB' },                        
		{ name: 'Limping', character : '\u4DE6' },
		{ name: 'Already Fording', character : '\u4DFE' },
		{ name: 'Welling', character : '\u4DEF' },
		{ name: 'Attending', character : '\u4DC4' },                        
		{ name: 'Clustering', character : '\u4DEC' },
		{ name: 'Following', character : '\u4DD0' },
		{ name: 'Confining', character : '\u4DEE' },
		{ name: 'Lake', character : '\u4DF9' },
		{ name: 'Conjoining', character : '\u4DDE' },
		{ name: 'Skinning', character : '\u4DF0' },
		{ name: 'Great Exceeding', character : '\u4DDB' },
		{ name: 'Displacement', character: '\u4DEA' },

		{ name: 'Stripping', character : '\u4DD6' },
		{ name: 'Swallowing', character : '\u4DDA' },                        
		{ name: 'Enveloping', character : '\u4DC3' },                        
		{ name: 'Diminishing', character : '\u4DE8' },                        
		{ name: 'Mountain', character : '\u4DF3' },
		{ name: 'Adorning', character : '\u4DD5' },                        
		{ name: 'Correcting', character : '\u4DD1' },
		{ name: 'Great Accumulating', character : '\u4DD9' },                        
		{ name: 'Prospering', character : '\u4DE2' },
		{ name: 'Gnawing Bite', character : '\u4DD4' },
		{ name: 'Not Yet Fording', character : '\u4DFF' },
		{ name: 'Polarising', character : '\u4DE5' },
		{ name: 'Sojouring', character : '\u4DF7' },
		{ name: 'Fire', character : '\u4DDD' },
		{ name: 'Holding', character : '\u4DF1' },
		{ name: 'Great Possesing', character: '\u4DCD' },

		{ name: 'Viewing', character : '\u4DD3' },
		{ name: 'Augmenting', character : '\u4DE9' },
		{ name: 'Dispersing', character : '\u4DFA' },
		{ name: 'Centre Returning', character : '\u4DFC' },
		{ name: 'Infiltrating', character : '\u4DF4' },
		{ name: 'Dwelling People', character : '\u4DE4' },
		{ name: 'Wind', character : '\u4DF8' },
		{ name: 'Small Accumulating', character: '\u4DC8' },                        
		{ name: 'Obstruction', character : '\u4DCB' },                    
		{ name: 'Without Embroiling', character : '\u4DD8' },
		{ name: 'Arguing', character : '\u4DC5' },
		{ name: 'Treading', character: '\u4DC9' },                        
		{ name: 'Retiring', character : '\u4DE0' },
		{ name: 'Concording People', character: '\u4DCC' },
		{ name: 'Coupling', character: '\u4DEB' },
		{ name: 'Heaven', character: '\u4DC0' }
	]

	function getSumOfYangFor(index) {
		var sum = 0;

		while(index)
		{
			index = index & (index - 1);
			sum += 1;
		}
		return sum;
	}
	
	function getNearestHexagramsTo(index) {
		return [
			index ^ 1,
			index ^ 2,
			index ^ 4,
			index ^ 8,
			index ^ 16,
			index ^ 32                        
		]; 
	}
	
	function initialiseHexagrams() {
		var i = 0;
		
		for (i = 0; i < 64; i += 1) {
			hexagramSet[i].nearestHexagrams = getNearestHexagramsTo(i);                       
		}
	}
	
	// create and return API for this module
	app.createIchingObject = function () {
		initialiseHexagrams();
	
		return {
			hexagrams: hexagramSet,
			getSumOfYangFor: getSumOfYangFor
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
