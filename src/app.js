function changeToEdit() {
	// TODO: Change to edit
}

window.onload = () => {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		console.log(this);
	};
	xhttp.open('POST', 'http://localhost:8080/todo/edit');
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify({ hello: "hewwo!!!" }));
};
