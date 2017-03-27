var TRANSPARENT_MODE = false;
var username;
var suggest_source;

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
function(text, suggest)
{
	suggest_source = suggest;
	Reccomend(prepare(text), suggest);
});					 
// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
function(text)
{
	chrome.storage.sync.get("username",
		function(obj)
		{
			username = obj.username;
		});
	
	if (username == null)
	{
		var u = prompt("Please enter your username");
		username = u;
		
		chrome.storage.sync.set({
			username: u,
		  },
		  function() {
			alert("Your username has been saved \nYou can change your username by typing 'settings' into the RES command");
		  });
	}
	
	Do(prepare(text));
});



//Reccomendations
function Reccomend(text, suggest)
{
	console.log(text);
	switch(text[0])
	{
		case "m":
			//Open mail
			recomend("Go to messages");
			break;
		case "mm":
			//Open modmail
			recomend("Go to modmail");
			break;
		case "me":
			//Opperate on me
			recomend("Go to your profile");
			break;
		case "r":
			//Open subreddit
			reccomend("Go to a subreddit", text[1]);
			break;
		case "u":
			//Open user
			if(text.length == 2)
			{
				reccomend("Go to a specific user", text[1]);
			}
			else if (text.length == 4)
			{
				reccomend("Go to a users multireddit", "user: " + text[1] + " multi: " + text[3]);
			}
			break;
		case "settings":
			recomend("Go to settings");
 			break;
		case "help":
			recomend("Open to help page");
			break;
		case "discuss":
			recomend("Go to this extension's subreddit");
			break;
	}	
}

//Do
function Do(text)
{
	console.log(text);
	switch(text[0])
	{
		case text[0] == "m" && text.length == 1:
			//Open mail
			openBlank("message/unread/");
			break;
		case "m":
			//Open my multireddit
			openMulti(username, text[1]);
			break;
		case "mm":
			//Open modmail
			openBlank("message/moderator/");
			break;
		case "me":
			//Opperate on me
			me(text);
			break;
		case "r":
			//Open subreddit
			openSub(text[1]);
			break;
		case "u":
			//Open user
			if(text.length == 2)
			{
				openUser(text[1]);
			}
			else if (text.length == 4)
			{
				openBlank("u/" + text[1] + "m/" + text[3]);
			}
			break;
		case "settings":
			chrome.runtime.openOptionsPage();
 			break;
		case "help":
			//alert("Not yet implimented");
			openBlank("r/RESOmniLine/wiki/index");
			break;
		case "discuss":
			openSub("RESOmniLine");
			//openSub("OmniboxRES");
			break;
		
		default:
			var l = "Error: (" + text + ")";
			alert(l);
			console.log(l);
			break;
	}
}

function me(subs)
{
	var sw = subs.length;
	switch(sw)
	{
		case 1:
			openUser(username);
			break;
		case 2:
			switch(subs[1])
			{
				case "s":
				case "saved":
					openUser(username + "/saved");
					break;
				case "sub":
				case "submitted":
					openUser(username + "/submitted");
					break;
				case "c":
				case "comments":
					openUser(username + "/comments");
					break;
				case "g":
				case "gilded":
					openUser(username + "/gilded");
					break;
				case "l":
				case "liked":
					openUser(username + "/liked");
					break;
				case "d":
				case "disliked":
					openUser(username + "/disliked");
					break;
				case "h":
				case "hidden":
					openUser(username + "/hidden");
					break;
			}
			break;
		default:
			alert("switch error: " + subs);
			break;
	}
}

//Loads Username
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    username: '',
  }, function(items) {
    username = items.username;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);

//These components are for simplified use
function prepare(text)
{
	if (!TRANSPARENT_MODE)
	{
		return text.split(/[ /]+/);
	}
	else
	{
		return text;
	}
}

function openBlank(ext)
{
	chrome.tabs.create({ url: "http://www.reddit.com/" + ext });
}

function openUser(u)
{
	openBlank("user/" + u);
}

function openSub(r)
{
	openBlank("r/" + r);
}

function openMulti(u, m)
{
	openBlank("u/" + u + "/m/" + m);
}

function recomend(c)
{
	reccomend(c,c);
}

function reccomend(c, d)
{
	//alert(c + d);
	suggest_source([
            { content: c, description: d }
        ]);
}