var helpers = Chart.helpers;

// Take the zoom namespace of Chart
Chart.Zoom = Chart.Zoom || {};

// Where we store functions to handle different scale types
var zoomFunctions = Chart.Zoom.zoomFunctions = Chart.Zoom.zoomFunctions || {};
var panFunctions = Chart.Zoom.panFunctions = Chart.Zoom.panFunctions || {}; 

// Default options if none are provided
var defaultOptions = Chart.Zoom.defaults = {
	pan: {
		enabled: true,
		mode: 'xy',
		threshold: 10,
	},
	zoom: {
		enabled: true,
		mode: 'xy',

	}
};

function directionEnabled(mode, dir) {
	if (mode === undefined) {
		return true;
	} else if (typeof mode === 'string') {
		return mode.indexOf(dir) !== -1;
	}

	return false;
}

function zoomIndexScale(scale, zoom, center) {

}


function zoomTimeScale(scale, zoom, center) {
	var options = scale.options;
	var minDelta, maxDelta;
	var newDiff;

	if (scale.isHorizontal()) {
		newDiff = (scale.right - scale.left) * (zoom - 1);
	} else {
		newDiff = (scale.bottom - scale.top) * (zoom - 1);
	}

	// Apply evenly for now until center is used
	minDelta = maxDelta = newDiff / 2;

	options.time.min = scale.getValueForPixel(scale.getPixelForValue(scale.firstTick) + minDelta);
	options.time.max = scale.getValueForPixel(scale.getPixelForValue(scale.lastTick) - maxDelta);
}

function zoomNumericalScale(scale, zoom, center) {
	var newDiff = (scale.max - scale.min) * (zoom - 1);
	scale.options.ticks.min = scale.min + (newDiff / 2);
	scale.options.ticks.max = scale.max - (newDiff / 2);
}



function zoomScale(scale, zoom, center) {
	var fn = zoomFunctions[scale.options.type];
	if (fn) {
		fn(scale, zoom, center);
	}
}

function doZoom(chartInstance, zoom, center) {
	var ca = chartInstance.chartArea;
	if (!center) {
		center = {
			x: (ca.left + ca.right) / 2,
			y: (ca.top + ca.bottom) / 2,
		}
	}

	var zoomOptions = chartInstance.options.zoom;

	if (zoomOptions && helpers.getValueOrDefault(zoomOptions.enabled, defaultOptions.zoom.enabled)) {
		// Do the zoom here
		var zoomMode = helpers.getValueOrDefault(chartInstance.options.zoom.mode, defaultOptions.zoom.mode);

		helpers.each(chartInstance.scales, function(scale, id) {
			if (scale.isHorizontal() && directionEnabled(zoomMode, 'x')) {
				zoomScale(scale, zoom, center);
			} else if (directionEnabled(zoomMode, 'y')) {
				// Do Y zoom
				zoomScale(scale, zoom, center);
			}
		});

		chartInstance.update(0);
	}
}

function panIndexScale(scale, delta) {
	var options = scale.options;
	var labels = scale.chart.data.labels;
	var lastLabelIndex = labels.length - 1;

	var minIndex = Math.max(0, Math.round(scale.getValueForPixel(scale.getPixelForValue(null, scale.minIndex, null, true) - delta)));
	var maxIndex = Math.min(lastLabelIndex, Math.round(scale.getValueForPixel(scale.getPixelForValue(null, scale.maxIndex, null, true) - delta)))
	options.ticks.min = labels[minIndex];
	options.ticks.max = labels[maxIndex];
}

function panTimeScale(scale, delta) {
	var options = scale.options;
	options.time.min = scale.getValueForPixel(scale.getPixelForValue(scale.firstTick) - delta);
	options.time.max = scale.getValueForPixel(scale.getPixelForValue(scale.lastTick) - delta);
}

function panNumericalScale(scale, delta) {
	var options = scale.options;
	var start = scale.start,
		end = scale.end;

	if (options.ticks.reverse) {
		options.ticks.max = scale.getValueForPixel(scale.getPixelForValue(start) - delta);
		options.ticks.min = scale.getValueForPixel(scale.getPixelForValue(end) - delta);
	} else {
		options.ticks.min = scale.getValueForPixel(scale.getPixelForValue(start) - delta);
		options.ticks.max = scale.getValueForPixel(scale.getPixelForValue(end) - delta);
	}
}

function panScale(scale, delta) {
	var fn = panFunctions[scale.options.type];
	if (fn) {
		fn(scale, delta);
	}
}

function doPan(chartInstance, deltaX, deltaY) {
	var panOptions = chartInstance.options.pan;
	if (panOptions && helpers.getValueOrDefault(panOptions.enabled, defaultOptions.pan.enabled)) {
		var panMode = helpers.getValueOrDefault(chartInstance.options.pan.mode, defaultOptions.pan.mode);

		helpers.each(chartInstance.scales, function(scale, id) {
			if (scale.isHorizontal() && directionEnabled(panMode, 'x') && deltaX !== 0) {
				panScale(scale, deltaX);
			} else if (directionEnabled(panMode, 'y') && deltaY !== 0) {
				panScale(scale, deltaY);
			}
		});

		chartInstance.update(0);
	}
}

function positionInChartArea(chartInstance, position) {
	return 	(position.x >= chartInstance.chartArea.left && position.x <= chartInstance.chartArea.right) &&
			(position.y >= chartInstance.chartArea.top && position.y <= chartInstance.chartArea.bottom);
}

// Store these
Chart.Zoom.zoomFunctions['category'] = zoomIndexScale;
Chart.Zoom.zoomFunctions['time'] = zoomTimeScale;
Chart.Zoom.zoomFunctions['linear'] = zoomNumericalScale;
Chart.Zoom.zoomFunctions['logarithmic'] = zoomNumericalScale;
Chart.Zoom.panFunctions['category'] = panIndexScale;
Chart.Zoom.panFunctions['time'] = panTimeScale;
Chart.Zoom.panFunctions['linear'] = panNumericalScale;
Chart.Zoom.panFunctions['logarithmic'] = panNumericalScale;

// Chartjs Zoom Plugin
var ZoomPlugin = Chart.PluginBase.extend({
	beforeInit: function(chartInstance) {
		var node = chartInstance.chart.ctx.canvas;
		var options = chartInstance.options;
		var panThreshold = helpers.getValueOrDefault(options.pan ? options.pan.threshold : undefined, Chart.Zoom.defaults.pan.threshold);

		var wheelHandler = function(e) {
			if (e.wheelDelta > 0) {
				doZoom(chartInstance, 1.1);
			} else {
				doZoom(chartInstance, 0.909);
			}
		};
		chartInstance._wheelHandler = wheelHandler;

		node.addEventListener('mousewheel', wheelHandler);

		var mc = new window.Hammer.Manager(node);
		mc.add(new Hammer.Pinch());
		mc.add(new Hammer.Pan({
			threshold: panThreshold
		}));

		var handlePinch = function handlePinch(e) {
			var diff = 1 / (currentPinchScaling) * e.scale;
			doZoom(chartInstance, diff, e.center);

			// Keep track of overall scale
			currentPinchScaling = e.scale;
		};

		// Hammer reports the total scaling. We need the incremental amount
		var currentPinchScaling;

		mc.on('pinchstart', function(e) {
			currentPinchScaling = 1; // reset tracker
		});
		mc.on('pinch', handlePinch);
		mc.on('pinchend', function(e) {
			handlePinch(e);
			currentPinchScaling = null; // reset
		});

		var currentDeltaX = null, currentDeltaY = null;
		var handlePan = function handlePan(e) {
			if (currentDeltaX !== null && currentDeltaY !== null) {
				var deltaX = e.deltaX - currentDeltaX;
				var deltaY = e.deltaY - currentDeltaY;
				currentDeltaX = e.deltaX;
				currentDeltaY = e.deltaY;

				doPan(chartInstance, deltaX, deltaY);
			}
		};

		mc.on('panstart', function(e) {
			currentDeltaX = 0;
			currentDeltaY = 0;
			handlePan(e);
		});
		mc.on('panmove', handlePan);
		mc.on('panend', function(e) {
			currentDeltaX = null;
			currentDeltaY = null;
		});
		chartInstance._mc = mc;
	},

	destroy: function(chartInstance) {
		var node = chartInstance.chart.ctx.canvas;

		var mc = chartInstance._mc;
		mc.remove('pinchstart');
		mc.remove('pinch');
		mc.remove('pinchend');
		mc.remove('panstart');
		mc.remove('pan');
		mc.remove('panend');
	}
});

Chart.pluginService.register(new ZoomPlugin());