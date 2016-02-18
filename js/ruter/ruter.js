var ruter = {
	// Default language is Dutch because that is what the original author used
	params: config.weather.params || null,
	iconTable: {
		'0':'<span class="icon-svg-bus"></span>',
		'1':'',
		'2':'',
		'3':'<span class="icon-svg-tram"></span>',
		'4':'<span class="icon-svg-metro"></span>',
		},
	travelList: '.travel',
	updateInterval: config.weather.interval || 6000,
	fadeInterval: config.weather.fadeInterval || 1000,
	intervalId: null,
	orientation: config.weather.orientation || 'vertical',
}

ruter.updateCurrentTravel = function () {
	$.ajax({
		type: 'GET',
		url: config.ruter.apiBaseBus ,
		dataType: 'json',
		dataBus: config.ruter.params,
		success: function (dataBus) {
			ruter.dataBus = dataBus;
		}
	});
	$.ajax({
		type: 'GET',
		url: config.ruter.apiBaseTram ,
		dataType: 'json',
		dataTram: config.ruter.params,
		success: function (dataTram) {
			ruter.dataTram = dataTram;
		}
	});
	$.ajax({
		type: 'GET',
		url: config.ruter.apiBaseMetro ,
		dataType: 'json',
		dataMetro: config.ruter.params,
		success: function (dataMetro) {
			dataMetro = dataMetro.concat(ruter.dataBus);
			dataMetro = dataMetro.concat(ruter.dataTram);
			var _LengthOfData = dataMetro.length;
			
			if (ruter.dataBus==undefined){return;}
			if (ruter.dataTram==undefined){return;}
			for(var iChangeDateCount = 0, count = dataMetro.length; iChangeDateCount < count; iChangeDateCount++){
				dataMetro[iChangeDateCount].MonitoredVehicleJourney.MonitoredCall.unixTime= Date.parse(dataMetro[iChangeDateCount].MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime);
			}
			
			dtCurrentTime = new Date();

			
			dataMetro = dataMetro.filter( function(value){
				return ( value.MonitoredVehicleJourney.MonitoredCall.unixTime > (dtCurrentTime.getTime() + (config.ruter.minutesWait*60*1000) ));
				});
			
			dataMetro.sort(function(a,b){
				return a.MonitoredVehicleJourney.MonitoredCall.unixTime - b.MonitoredVehicleJourney.MonitoredCall.unixTime;
			})
			
			var	_opacity = 1, 
					_NextLineHtml = '<table class="ruter-table"><tr>',
					//_NextLineHtml = '<table><tr>',
					_NextLineHtml2 = '',
					_NextLineHtml3 = '';
				
			
			for(var iPrintHTMLCount = 0, count = 11; iPrintHTMLCount < count; iPrintHTMLCount++){
				var _NextLine = dataMetro[iPrintHTMLCount];
				var timeUntilNextLine = _NextLine.MonitoredVehicleJourney.MonitoredCall.unixTime - dtCurrentTime.getTime();
				moment(timeUntilNextLine,'x').format('m')
				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + this.iconTable[_NextLine.MonitoredVehicleJourney.VehicleMode] + '</td>';
				//_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + _NextLine.MonitoredVehicleJourney.LineRef + '</td>';
				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + _NextLine.MonitoredVehicleJourney.LineRef  + ' ' + _NextLine.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay + '</td>';
				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' +  moment(timeUntilNextLine,'x').format('m') +  ' min</td>';
				_NextLineHtml += '</tr>';
				}
			var _busName = dataMetro[0].MonitoredVehicleJourney.MonitoredCall.DestinationDisplay + dataMetro[0].MonitoredVehicleJourney.MonitoredCall.unixTime;
				//_temperatureMin = this.roundValue(data.main.temp_min),
				//_temperatureMax = this.roundValue(data.main.temp_max),
				//_wind = this.roundValue(data.wind.speed),
				//_iconClass = this.iconTable[data.weather[0].icon];

			var _icon = '<span class="icon-svg-bus"></span>';

			//var _newTempHtml = _icon + "" + _LengthOfData + "" + _busName;
			var _newTempHtml = _NextLineHtml

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
