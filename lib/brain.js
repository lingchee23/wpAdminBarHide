var wpAdminHide = {

	active: false,

	/*
	 * Adds a domain name to localStorage and switches icon to on position.
	 */
	addD: function(d) {
		localStorage[d] = true;
		console.log(d + " added.");
		wpAdminHide.toggleIcon(true);
	},

	/*
	 * Removes a domain from localStorage and switches icon to off position.
	 */
	remD: function(d){
		localStorage.removeItem(d);
		console.log(d + " removed.");
		wpAdminHide.toggleIcon(false);
	},

	/*
	 * Checks for the existence of a localStorage item that matches the domain passed as the first
	 * argument. Second and third arguments are what to do if there is or isn't a match, respectively.
	 */	
	chkD: function( tabId, pass, fail ) {

		chrome.tabs.get( tabId, function(tab){

			d = tab.url.split("/")[2];

			if (localStorage[d]) {
				pass(d);
			}
			else{
				fail(d);
			}

		})



	},

	removeBar: function( tabId ){
		
		chrome.tabs.insertCSS( 
			tabId, 
			{
				code: "body{display:none;}",
				runAt: "document_start",
				allFrames: true
			}, 
			function(){
				console.log("Bar removed!");
		});

	},

	restoreBar: function( tabId ){
		chrome.tabs.insertCSS( 
			tabId, 
			{
				code: "body{display:inherit;}",
				runAt: "document_start",
				allFrames: true
			}, 
			function(){
				console.log("Bar restored!");
		});
	},

	/*
	 * This could very well become outdated but I'm rolling with it for now. Function takes a boolean 
	 * parameter and switches the icon to on or off while also updating the 'active' variable.
	 */
	toggleIcon: function( state ){
		if(state){
			//Change Icon
	        chrome.browserAction.setIcon({
	            "path": "img/icon19_1.png"
	        	}, function () {
	        		this.active = true;
	        	});
		}
		else{
			chrome.browserAction.setIcon({
            "path": "img/icon19_0.png"
        	}, function () {
        		this.active = false;
        	});
		}
	}

};


/* 
 * Listener for browser action button clickage. Checks the active tab against localstorage and toggles
 * the state of the plugin accordingly
 */
chrome.browserAction.onClicked.addListener(function (tab) {
		wpAdminHide.chkD( 
			tab.id, 
			function(d){
				wpAdminHide.remD(d);
				wpAdminHide.restoreBar(tab.id);
			},
			function(d){
				wpAdminHide.addD(d);
				wpAdminHide.removeBar(tab.id);
			} 
		);
});

/*
 * Keep the icon up to date based on whether or not the domain exists in local storage.
 * Going to assum that the hiding was handled on tab load so this is just for keeping up 
 * appearances.
 */
chrome.tabs.onActivated.addListener(function(tab){
	wpAdminHide.chkD( 
		tab.tabId, 
		function(){
			wpAdminHide.toggleIcon(true)
		}, 
		function(){
			wpAdminHide.toggleIcon(false)
		});

});