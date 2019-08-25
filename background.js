var helplut = [
  {
    form: [/r/, /.*/],
    help: "name	Go to a specific subreddit"
  },
  {
    form: [/u/, /.*/],
    help: "Go to a specific user"
  },
  {
    form: [/u/, /.*/, /m/, /.*/],
    help: "Go to a user's multireddit"
  },
  {
    form: [/m/],
    help: "Go to messages"
  },
  {
    form: [/m/, /.*/],
    help: "Go to your multireddit"
  },
  {
    form: [/mm/],
    help: "Go to modmail"
  },
  {
    form: [/me/],
    help: "Go to your profile"
  },
  {
    form: [/me/, /c(omments|)/],
    help: "Go to your comments"
  },
  {
    form: [/me/, /s(aved|)/],
    help: "Go to your saves"
  },
  {
    form: [/me/, /sub(missions|)/],
    help: "Go to your submissions"
  },
  {
    form: [/me/, /g(ilded|)/],
    help: "Go to your gilded"
  },
  {
    form: [/me/, /l(ikes|)/],
    help: "Go to your likes"
  },
  {
    form: [/me/, /d(islikes|)/],
    help: "Go to your dislikes"
  },
  {
    form: [/me/, /h(idden|)/],
    help: "Go to posts you hid"
  }
];

const openReddit = (endpoint, args) => {
  let url = "https://reddit.com/" + endpoint.join("/");
  if (args) {
    url += "?";
    for (let key in args) {
      url += key + "=" + args[key] + "&";
    }
  }
  openPage(url);
};

const openPage = url => {
  chrome.storage.sync.get(
    {
      newTab: true
    },
    function(items) {
      if (items.newTab) {
        chrome.tabs.create({ url: url });
      } else {
        chrome.tabs.getSelected(null, tab => {
          //Update the url here.
          chrome.tabs.update(tab.id, { url: url });
        });
      }
    }
  );
};

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
	text = text.split("/");

	for (let obj in helplut) {
		obj = helplut[obj]
		if (obj.form.length == text.length) {
			for (let i = 0; i < obj.form.length; i++) {
				let res = obj.form.map((x, i) => x.test(text[i]))
				if (!res.includes(false)) {
					suggest({
						content: '',
						description: obj.help
					})
				}
			}
		}
	}
})

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(text => {
  text = text.split("/");

  if (text[0] == "post") {
    let sub = prompt("Enter subreddit name");
    let title = prompt("Enter title");
    let link = prompt("Enter a link");
    openReddit(["r", sub, "submit"], {
      url: link,
      title: title
    });
    return;
  }

  if (text[0] == "qm") {
    let user = prompt("Enter recipients username");
    let msg = prompt("Write out your message");
    // TODO: Send message
    return;
  }

  if (text[0] == "help") {
    openPage("https://www.reddit.com/r/RESOmniLine/wiki/index");
    return;
  }

  if (text[0] == "source") {
    openPage("https://github.com/danhab99/Res-Omnibox-Commandline");
    return;
  }

  if (text[0] == "discuss") {
    openPage("https://www.reddit.com/r/RESOmniLine/");
    return;
  }

  openReddit(text);
});
