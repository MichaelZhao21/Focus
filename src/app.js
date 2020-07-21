var shift = false;

window.onload = () => {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		var converter = new showdown.Converter();
		document.getElementById('text-display').innerHTML = converter.makeHtml(this.response);
		document.getElementById('text-edit').value = this.response;
	};
	xhttp.open('GET', 'https://api.michaelzhao.xyz/todo');
	xhttp.send();

	document.getElementById('text-display').ondblclick = () => {
        shift = false;
		document.getElementById('text-display').style.display = 'none';
        document.getElementById('text-edit').style.display = 'block';
        document.getElementById('submit-button').style.display = 'block';
	};

	document.getElementById('submit-button').onclick = () => {save()};

	document.getElementById('text-edit').onkeydown = (event) => {
		if (event.keyCode === 16) shift = true;
		else if (event.keyCode === 13 && shift) save();
		else if (event.keyCode === 9) return tab();
    };
    
    document.getElementById('text-edit').onkeyup = (event) => {
        if (event.keyCode === 16) shift = false;
    }
};

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
	document.getElementById('text-display').style.display = 'block';
	document.getElementById('text-edit').style.display = 'none';
    document.getElementById('submit-button').style.display = 'none';
}
