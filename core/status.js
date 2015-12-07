var persistence = require('./persistence.js');

exports.run = function() {
	console.log(figlet.textSync('Order', 'Graffiti').red);

	var location = persistence.getKey('location');
	if (!location) {
		location = 'away';
	}

	var currentOrder = persistence.getKey('stage');
	if (currentOrder && currentOrder.items.length > 0) {
		console.log('Current Unsubmitted Order');
		console.log('------------------------------------------------');
		console.log('Cost'.bold + '\t| ' + 'Item'.bold);
		console.log('------------------------------------------------');

		var total = 0;
		for (var i = 0; i < currentOrder.items.length; i++) {
			var cost = '$';
			if (!isNaN(currentOrder.items[i].special)) {
				cost += '0.00';
			}
			else {
				total += currentOrder.items[i][location];
				cost += currentOrder.items[i][location].toFixed(2);
			}

			var name = currentOrder.items[i].name;
			console.log(cost + '\t| ' + name);
		}

		if (currentOrder.specials) {
			console.log('------------------------------------------------');
			for (var sp in currentOrder.specials) {
				if (sp === 'last') continue;
				var special = currentOrder.specials[sp];
				console.log('$' + special.cost.toFixed(2) + '\t| ' + special.name);
				total += special.cost;
			}
		}

		console.log('------------------------------------------------');
		console.log('Total'.bold.cyan + '\t| ' + '$'.cyan + total.toFixed(2).cyan);
		console.log('------------------------------------------------');
	}

};
