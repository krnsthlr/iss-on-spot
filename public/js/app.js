var ISSApp = (function($){

	'use strict';

	var $locationSearch = $('#locationSearch');
	var $formInput = $locationSearch.find('input[type=search]');
	var $formButton = $locationSearch.find('input[type=submit]');
	var $message = $('#message');

	var $hrs = $('#hrs');
	var $week = $('#week');
	var $month = $('#month');

	// Initialize Google Autocomplete for text input
	var autocomplete = new google.maps.places.Autocomplete(
		$formInput[0], {types:['(regions)']});

	// Set height of twitter timeline to sibling height
	$('#twitter-feed').height($('#intro').height()) 

	var showNumbers = function(data){
		$hrs.text(data.requests24hrs);
		$week.text(data.requestsWeek);
		$month.text(data.requestsMonth);
	};

	var showMessage = function(data){
		$message.children('p').text(data.message);
		$message.show('slow');
		$formButton.prop('disabled', false).removeClass('disabled');
	};

	var requestStats = function(){
		$.get('/stat', showNumbers);
	};

	// On search form submit event, POST location and
	// get next ISS pass time
	var requestPassTime = function(location){

		$.ajax({
			type: 'POST',
			url: '/',
			data: location,
			dataType: 'json'
		})
		.done(showMessage)
		.done(requestStats);
	};

	// Search form event handler
	$locationSearch.submit(function(event){
		event.preventDefault();

		if($message.length){
			$message.hide();
		}

		$formButton.prop('disabled', true).addClass('disabled');

		var searchString = $formInput.val();
		requestPassTime({location: searchString});
	});

	return {
		init: requestStats
	};

}(jQuery));

$(document).foundation();

$(function(){
	ISSApp.init();
});