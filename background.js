var TRANSPARENT_MODE = false;
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
		case "help":
			recomend("Open to help page");
			break;
		case "discuss":
			recomend("Go to this extension's subreddit");
			break;
		case "f":
		case "front":
			reccomend("Go to front page");
			break;
		case "source":
			reccomend("Go to source page on GitHub");
			break;
		case "qm":
			reccomend("Send a quick message");
			break;
	}
}

//Do
function Do(text)
{
	console.log(text);
	switch(text[0])
	{
		case "m":
			if(text.length >= 2)
			{
				//Open my multireddit
				openMe("/m/" + text[1]);
			}
			else
			{
				openBlank("message/unread/");
			}
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
		case "help":
			//alert("Not yet implimented");
			openBlank("r/RESOmniLine/wiki/index");
			break;
		case "discuss":
			openSub("RESOmniLine");
			//openSub("OmniboxRES");
			break;
		case "f":
		case "front":
			openBlank("");
			break;
		case "source":
			chrome.tabs.create({ url: "https://github.com/danhab99/Res-Omnibox-Commandline" });
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
			openMe();
			break;
		case 2:
			switch(subs[1])
			{
				case "s":
				case "saved":
					openMe("/saved");
					break;
				case "sub":
				case "submitted":
					openMe("/submitted");
					break;
				case "c":
				case "comments":
					openMe("/comments");
					break;
				case "g":
				case "gilded":
					openMe("/gilded");
					break;
				case "l":
				case "liked":
					openMe("/liked");
					break;
				case "d":
				case "disliked":
					openMe("/disliked");
					break;
				case "h":
				case "hidden":
					openMe("/hidden");
					break;
			}
			break;
		default:
			alert("switch error: " + subs);
			break;
	}
}

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

function openMe(ext)
{
	if(ext != undefined)
	{
		openUser("me/" + ext);
	}
	else
	{
		openUser("me");
	}
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

function quickMessage(data)
{
	var to = data[1];
	var body;
	
	for (var i = 0; i > data.length - 2; i++)
	{
		body = body + data[i] + "%20";
	}
	
	openBlank("message/compose?to=" + to + "&subject=&message=" + body);
}

function post(data)
{
	var sub = data[1];
	var title = data[2];
	var url = data[3];
	
	openBlank("r/" + sub + "/submit?title=" + title + "&url=" + url);
}