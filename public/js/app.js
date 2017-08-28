const searchInput = $('input')[0];
const autocomplete = new google.maps.places.Autocomplete(
	(searchInput), {types:['(regions)']});

const showMessage = function(message){
	$('#message p').text(message);
	$('#message').show('slow');
}


// Ajax success handler
const render = function(data){
	$('#hrs').text(data.requests24hrs);
	$('#week').text(data.requestsWeek);
	$('#month').text(data.requestsMonth);
	showMessage(data.message);
	$('.button').removeClass('disabled');
}

// On search form submit event, POST location and
// get next ISS pass time via ajax
const requestPassTime = function(location){

	$.ajax({
		type: 'POST',
		url: '/',
		data: location,
		success: render,
		dataType: 'json'
	});
};

// Search form event handler
$('form').submit((event) => {
	event.preventDefault();

	if($('#message').length){
		$('#message').hide();
	};

	$('.button').addClass('disabled');

	let searchString = $('#searchInput').val();
	requestPassTime({location: searchString});
});

$(document).foundation();