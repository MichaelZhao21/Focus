const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var shift = false,
	ctrl = false,
	before = '';
const titleColor = 'hsl(' + randInt(0, 361) + ', 86%, 89%)';

document.querySelector('body').onload = () => {
	getTodo();
	getPicture();

	document.getElementById('time').style.color = titleColor;

	var millis = setCurrentTimeAndDate();
	setCurrentDate();
	setTimeout(function () {
		setCurrentTimeAndDate();
		setInterval(setCurrentTimeAndDate, 1000);
	}, 1000 - millis);

	document.getElementById('text-display').ondblclick = (event) => {
		shift = false;
		document.getElementById('text-display').style.display = 'none';
		document.getElementById('text-edit').style.display = 'block';
		document.getElementById('submit-button').style.display = 'block';
		before = document.getElementById('text-edit').value;
		document.getElementById('text-edit').focus();
		resetCursor(document.getElementById('text-edit'));
	};

	document.getElementById('submit-button').onclick = save;
	document.getElementById('new-photo').onclick = () => {
		getPicture(true);
	};

	document.getElementById('text-edit').onkeydown = (event) => {
		if (event.keyCode === 16) shift = true;
		if (event.keyCode === 17) ctrl = true;
		else if (event.keyCode === 13 && (shift || ctrl)) {
			shift = false;
			ctrl = false;
			save();
			return false;
		}
		else if (event.keyCode === 9) return tab();
		else if (event.keyCode === 27) {
			document.getElementById('text-edit').value = before;
			exitEdit();
		}
	};

	document.getElementById('text-edit').onkeyup = (event) => {
		if (event.keyCode === 16) shift = false;
		if (event.keyCode === 17) ctrl = false;
	};
};

function resetCursor(txtElement) { 
    if (txtElement.setSelectionRange) { 
        txtElement.focus(); 
        txtElement.setSelectionRange(0, 0); 
    } else if (txtElement.createTextRange) { 
        var range = txtElement.createTextRange();  
        range.moveStart('character', 0); 
        range.select(); 
    } 
}

function getTodo() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		var converter = new showdown.Converter();
		document.getElementById('text-display').innerHTML = converter.makeHtml(this.response);
		document.getElementById('text-edit').value = this.response;
	};
	xhttp.open('GET', 'https://api.michaelzhao.xyz/todo');
	xhttp.send();
}

function getPicture(newPic = false) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		const res = JSON.parse(this.response);
		document.querySelector('body').style.backgroundImage = "url('" + res.urls.full + "')";
		var author = document.getElementById('credits-author');
		author.href = res.user.links.html;
		author.innerHTML = res.user.name;
	};
	xhttp.open('GET', 'https://api.michaelzhao.xyz/photo' + (newPic ? '/new' : ''));
	xhttp.send();
}

function tab() {
	var te = document.getElementById('text-edit');
	// get caret position/selection
	var val = te.value,
		start = te.selectionStart,
		end = te.selectionEnd;

	// set textarea value to: text before caret + tab + text after caret
	te.value = val.substring(0, start) + '\t' + val.substring(end);

	// put caret at right position again
	te.selectionStart = te.selectionEnd = start + 1;

	// prevent the focus lose
	return false;
}

function save() {
	var data = document.getElementById('text-edit').value;

	var xhttp = new XMLHttpRequest();
	xhttp.open('POST', 'https://api.michaelzhao.xyz/todo/edit');
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify({ data }));

	var converter = new showdown.Converter();
	document.getElementById('text-display').innerHTML = converter.makeHtml(data);
	exitEdit();
}

function exitEdit() {
	document.getElementById('text-display').style.display = 'block';
	document.getElementById('text-edit').style.display = 'none';
	document.getElementById('submit-button').style.display = 'none';
}

function randInt(min, max) {
	return Math.random() * (max - min) + min;
}

function setCurrentTimeAndDate() {
	var d = new Date(),
		hour = form(d.getHours()),
		min = form(d.getMinutes()),
		sec = form(d.getSeconds()),
		end = d.getMilliseconds(),
		time = `${hour}:${min}:${sec}`;
	document.getElementById('time').innerHTML = time;

	if (hour == '00' && min == '00' && sec == '00') {
		setCurrentDate();
	}

	return end;
}

function setCurrentDate() {
	var d = new Date(),
		year = d.getFullYear(),
		month = monthNames[d.getMonth()],
		numDate = d.getDate(),
		day = dayNames[d.getDay()],
		date = `${day}, ${month} ${numDate}, ${year}`;
	document.getElementById('date').innerHTML = date;
}

function form(num) {
	if (num < 10) return '0' + num;
	return '' + num;
}
