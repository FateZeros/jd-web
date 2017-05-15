//天气API http://www.weather.com.cn/

exports.getWeatherData = function() {
	return {
		locations: [{
			name: '深圳',
			forecastUrl: 'http://www.weather.com.cn/weather1d/101280601.shtml#search',
			weather: '晴',
			temp: '26度'
		}]
	}
}
