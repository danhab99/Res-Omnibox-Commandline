
// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
function(text, suggest)
{
	text = text.split('/')
	if (text[0] == 'r') {
		suggest('	Go to a specific subreddit')
		return
	}
	if (text[0] == 'u') {
		suggest('Go to a specific user')
		return
	}
	if (text[0] == 'm' && text[1] != '') {
		suggest('Go to your multireddit')
		return
	}
	if (text[0] == 'm') {
		suggest('Go to messages')
		return
	}
	if (text[0] == 'mm') {
		suggest('Go to modmail')
		return
	}

	let isMe = text[0] == 'me'
	let mecompare = param => text[1] == param[1] || text[1] == param
	if (isMe && text[1] == 'sub' || text[1] == 'submissions') {
		suggest('Go to your submissions')
		return
	}
	if (isMe && mecompare('saved')) {
		suggest('Go to your saves')
		return
	}
	if (isMe && mecompare('comments')) {
		suggest('Go to your comments')
		return
	}
	if (isMe && mecompare('gilded')) {
		suggest('Go to your gilded')
		return
	}
	if (isMe && mecompare('likes')) {
		suggest('Go to your likes')
		return
	}
	if (isMe && mecompare('dislikes')) {
		suggest('Go to your dislikes')
		return
	}
	if (isMe && mecompare('hidden')) {
		suggest('Go to posts you hid')
		return
	}

	if (text[0] == 'post') {
		suggest('Submit a new post')
		return
	}
	if (text[0] == 'qm') {
		suggest('Sends a quick message to a user')
		return
	}
	if (text[0] == 'help') {
		suggest('Go to the help page')
		return
	}
	if (text[0] == 'discuss') {
		suggest('Go to r/RESOmniLine')
		return
	}
	if (text[0] == 'source') {
		suggest("Go to the extension's source")
		return
	}
});

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
	// TODO: Figure out how to do settings
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
