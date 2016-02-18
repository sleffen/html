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
					_NextLineHtml2 = '',
					_NextLineHtml3 = '';
				
			
			for(var iPrintHTMLCount = 0, count = 11; iPrintHTMLCount < count; iPrintHTMLCount++){
				var _NextLine = dataMetro[iPrintHTMLCount];
				var timeUntilNextLine = _NextLine.MonitoredVehicleJourney.MonitoredCall.unixTime - dtCurrentTime.getTime();

				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + this.iconTable[_NextLine.MonitoredVehicleJourney.VehicleMode] + '</td>';
				//_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + _NextLine.MonitoredVehicleJourney.LineRef + '</td>';
				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' + _NextLine.MonitoredVehicleJourney.LineRef  + ' ' + _NextLine.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay + '</td>';
				_NextLineHtml += '<td style="opacity:' + _opacity + '" class="day">' +  moment(timeUntilNextLine,'x').format('m') +  ' min</td>';
				_NextLineHtml += '</tr>';
				}

			$(this.travelList).updateWithText(_NextLineHtml, this.fadeInterval);
			
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
