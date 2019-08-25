
const openReddit = (endpoint, args) => {
	// TODO: Implement args
	let url = 'https://reddit.com/' + endpoint.join('/')
	if (args) {
		url += '?'
		for (let key in args) {
			url += key + '=' + args[key] + '&'
		}
	}
	openPage(url)
}

const openPage = url => {
	chrome.storage.sync.get(
		{
			newTab: true
		},
		function(items) {
			if (items.newTab) {
				chrome.tabs.create({ url: url});
			}
			else {
				chrome.tabs.getSelected(null, tab => {			
					//Update the url here.
					chrome.tabs.update(tab.id, {url: url});
				});
			}
		}
	);
}

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
function(text)
{
	text = text.split('/')

	if (text[0] == 'post') {
		let sub = prompt('Enter subreddit name')
		let title = prompt('Enter title')
		let link = prompt('Enter a link')
		openReddit(['r', sub, 'submit'], {
			url: link,
			title: title
		})
		return
	}

	if (text[0] == 'qm') {
		let user = prompt('Enter recipients username')
		let msg = prompt('Write out your message')
		// TODO: Send message
		return
	}

	if (text[0] == 'help') {
		openPage('https://www.reddit.com/r/RESOmniLine/wiki/index')
		return
	}

	if (text[0] == 'source') {
		openPage('https://github.com/danhab99/Res-Omnibox-Commandline')
		return
	}

	if (text[0] == 'discuss') {
		openPage('https://www.reddit.com/r/RESOmniLine/')
		return
	}

	openReddit(text)
});
