var commands = require('./command.js'),
	persistence = require('./persistence.js'),
	specials = require('./specials.js'),
	items = require('./curries.json').items,

filter = function (curry) {
	if (!curry) return items;
	var name = curry.toLowerCase(),
		res = [];

	for (var i = 0; i < items.length; i++) {
		if (items[i].name.toLowerCase().indexOf(name) >= 0 || items[i].type.toLowerCase().indexOf(name) >= 0) {
			res.push(items[i]);
		}
	}
	return res;
};

exports.run = function() {
	console.log(figlet.textSync('Items', 'Graffiti').cyan);

	process.argv.splice(0, 3);
	var desc = process.argv.indexOf('--description');
	if (desc >= 0) {
		process.argv.splice(desc, 1);
	}

	var item = process.argv.join(' ');
	item = item.trim();
	items = filter(item);

	var k = persistence.getKey('location');
	if (!k) {
		k = 'away';
	}

	console.log('------------------------------------------------');
	console.log('Cost'.bold + '\t| ' + 'Item'.bold);
	console.log('------------------------------------------------');
	if (items.length === 0) {
		console.log('No items found for query.'.red);
	}
	for (var i = 0; i < items.length; i++) {
		if (items[i][k] === -1) {
			continue;
		}
		var d = '';
		if (desc >= 0) {
			d = '\n' + items[i].description + '\n------------------------------------------------';
		}

		var text = '$' + items[i][k].toFixed(2) + '\t| ' + items[i].name + d;
		if (i % 2) {
			console.log(text.gray);
		}
		else {
			console.log(text.white);
		}
	}
	console.log('');

	if (item.length === 0) {
		console.log('To filter further, type a query string after the "show" subcommand.');
	}

	if (desc < 0) {
		console.log('You can enable descriptions using "--descripton".');
	}
};
