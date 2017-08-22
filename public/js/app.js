var data = {
	result: [

		{count: 33},
		{count: 144},
		{count: 512}

	]
}

const render = (data) => {
	$('#hrs').html(data.result[0].count);
	$('#week').html(data.result[1].count);
	$('#month').html(data.result[2].count);
}

// Ajax success handler
const showMessage = (data) => {
	$('#message p').html(data.message);
	$('#message').show('slow');
	$('#locationSearch .button').removeClass('disabled');
}

// On search form submit event, POST location and
// get next ISS pass time via ajax
const requestPassTime = (location) => {

	$.ajax({
		type: 'POST',
		url: '/',
		data: location,
		success: showMessage,
		dataType: 'json'
	});
};

// Search form event handler
$('#locationSearch').submit((event) => {
	event.preventDefault();

	if($('#message').length){
		$('#message').hide();
	};

	$('#locationSearch .button').addClass('disabled');

	let searchString = $('#searchInput').val();
	requestPassTime({location: searchString});
})

$(document).foundation()
