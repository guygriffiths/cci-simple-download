var map;
function initialize() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom : 2,
		center : {
			lat : 0,
			lng : 0
		}
	});

	var marker;
	google.maps.event.addListener(map, 'click', function(e) {
		var latLng = e.latLng;
		latLng = new google.maps.LatLng((Math.round(latLng.lat() * 4) / 4),
				(Math.round(latLng.lng() * 4) / 4));
		document.getElementById('latitude').value = latLng.lat().toFixed(2);
		document.getElementById('longitude').value = latLng.lng().toFixed(2);
		if (marker) {
			marker.setMap(null);
		}
		marker = new google.maps.Marker({
			position : latLng,
			map : map,
			title : 'Position to download data from'
		});
	});
}

function getCsv() {
	var latVal = parseFloat(document.getElementById('latitude').value);
	var lonVal = parseFloat(document.getElementById('longitude').value);

	/*
	 * These may have been entered manually, so round them to the nearest 1/4
	 * degree
	 */
	latVal = (Math.round(latVal * 4) / 4);
	lonVal = (Math.round(lonVal * 4) / 4);
	document.getElementById('latitude').value = latVal.toFixed(2);
	document.getElementById('longitude').value = lonVal.toFixed(2);

	var delta = 0.01;
	console.log(latVal + ',' + lonVal);
	var startYear = document.getElementById('startYear').value;
	var startMonth = document.getElementById('startMonth').value;
	var endYear = document.getElementById('endYear').value;
	var endMonth = document.getElementById('endMonth').value;
	if (isNaN(latVal) || isNaN(lonVal) || latVal < -90 || latVal > 90) {
		window
				.alert('Click on the map or enter valid values in the latitude and longitude boxes before clicking "Download"');
		return false;
	} else if (startYear > endYear
			|| (startYear === endYear && startMonth >= endMonth)) {
		window.alert('The start time must be before the end time!');
	} else {
		window
				.open(
						'http://cera.rdg.ac.uk/wms?REQUEST=GetTimeseries&LAYERS=cci-monthly/SST&QUERY_LAYERS=cci-monthly/SST,cci-monthly/SST_SD&BBOX='
								+ (lonVal - delta)
								+ ','
								+ (latVal - delta)
								+ ','
								+ (lonVal + delta)
								+ ','
								+ (latVal + delta)
								+ '&SRS=EPSG:4326&FEATURE_COUNT=5&HEIGHT=1&WIDTH=1&X=0&Y=0&STYLES=default/default&VERSION=1.1.1&TIME='
								+ startYear
								+ '-'
								+ startMonth
								+ '-01T00:00:00.000Z/'
								+ endYear
								+ '-'
								+ endMonth
								+ '-01T00:00:00.000Z&INFO_FORMAT=text/csv',
						'_blank')
	}
}

google.maps.event.addDomListener(window, 'load', initialize);