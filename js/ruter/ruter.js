var ruter = {
	// Default language is Dutch because that is what the original author used
	params: config.weather.params || null,
	/*iconTable: {
		'bus':'wi-day-sunny',
		'tram':'wi-day-cloudy',
		'metro':'wi-cloudy',
		},*/
	travelList: '.travel',
	apiBase: '/GetRuter.php/StopVisit/GetDepartures/3010524?json=true',
	busNumber: config.ruter.busNumber,
	tramNumber: config.ruter.tramNumber,
	metroNumber: config.ruter.metroNumber,
	updateInterval: config.weather.interval || 6000,
	fadeInterval: config.weather.fadeInterval || 1000,
	intervalId: null,
	orientation: config.weather.orientation || 'vertical'
}

ruter.updateCurrentTravel = function () {

	$.ajax({
		type: 'GET',
		url: ruter.apiBase ,
		dataType: 'json',
		data: config.ruter.params,
		success: function (data) {

			var _busName = data[0].MonitoredVehicleJourney.MonitoredCall.DestinationDisplay;
				//_temperatureMin = this.roundValue(data.main.temp_min),
				//_temperatureMax = this.roundValue(data.main.temp_max),
				//_wind = this.roundValue(data.wind.speed),
				//_iconClass = this.iconTable[data.weather[0].icon];

			var _icon = '<span class="icon-svg-metro"></span>';

			var _newTempHtml = _icon + '' +_busName;

			$(this.travelList).updateWithText(_newTempHtml, this.fadeInterval);

		/**	var _now = moment().format('HH:mm'),
		*		_sunrise = moment(data.sys.sunrise*1000).format('HH:mm'),
		*		_sunset = moment(data.sys.sunset*1000).format('HH:mm');
		*
		*	var _newWindHtml = '<span class="wind"><span class="wi wi-strong-wind xdimmed"></span> ' + this.ms2Beaufort(_wind) + '</span>',
		*		_newSunHtml = '<span class="sun"><span class="wi wi-sunrise xdimmed"></span> ' + _sunrise + '</span>';
		*
		*	if (_sunrise < _now && _sunset > _now) {
		*		_newSunHtml = '<span class="sun"><span class="wi wi-sunset xdimmed"></span> ' + _sunset + '</span>';
		*	}
		*
		*	$(this.windSunLocation).updateWithText(_newWindHtml + ' ' + _newSunHtml,this.fadeInterval);
		*/
		}.bind(this),
		error: function () {

		}
	});

}


ruter.init = function () {

	if (this.params.lang === undefined) {
		this.params.lang = this.lang;
	}

	if (this.params.cnt === undefined) {
		this.params.cnt = 6;
	}

	this.intervalId = setInterval(function () {
		this.updateCurrentTravel();
	}.bind(this), this.updateInterval);
	this.updateCurrentTravel();
}
