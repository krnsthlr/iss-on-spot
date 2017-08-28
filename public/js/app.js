const ISSApp = (function($){

	'use strict';

	const $locationSearch = $('#locationSearch');
	const $formInput = $locationSearch.find('input[type=search]');
	const $formButton = $locationSearch.find('input[type=submit]');
	const $message = $('#message');

	const $hrs = $('#hrs');
	const $week = $('#week');
	const $month = $('#month');

	// Initialize Google Autocomplete for text input
	const autocomplete = new google.maps.places.Autocomplete(
		$formInput[0], {types:['(regions)']});

	const showNumbers = function(data){
		$hrs.text(data.requests24hrs);
		$week.text(data.requestsWeek);
		$month.text(data.requestsMonth);
	}

	const showMessage = function(data){
		$message.children('p').text(data.message);
		$message.show('slow');
		$formButton.prop('disabled', false).removeClass('disabled');
	}

	const requestStats = function(){
		$.get('/stat', showNumbers);
	}

	// On search form submit event, POST location and
	// get next ISS pass time
	const requestPassTime = function(location){

		$.ajax({
			type: 'POST',
			url: '/',
			data: location,
			dataType: 'json'
		})
		.done(showMessage)
		.done(requestStats)
	};

	// Search form event handler
	$locationSearch.submit((event) => {
		event.preventDefault();

		if($message.length){
			$message.hide();
		};

		$formButton.prop('disabled', true).addClass('disabled');

		let searchString = $formInput.val();
		requestPassTime({location: searchString});
	});

	return {
		init: requestStats,
	}

}(jQuery));

$(document).foundation();

$(function(){
	ISSApp.init();
});