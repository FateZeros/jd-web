//天气API http://www.weather.com.cn/

exports.getWeatherData = function() {
	return {
		locations: [{
			name: '深圳',
			forecastUrl: 'http://www.weather.com.cn/weather1d/101280601.shtml#search',
			weather: '晴',
			temp: '26度'
		}, {
			name: '上海',
			forecastUrl: 'http://www.weather.com.cn/weather1d/101020100.shtml#search',
			weather: '东风',
			temp: '25度'
		}, {
			name: '北京',
			forecastUrl: 'http://www.weather.com.cn/weather1d/101010100.shtml#search',
			weather: '晴',
			temp: '23度'
		}]
	}
}
