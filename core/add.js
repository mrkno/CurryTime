var commands = require('./command.js'),
	persistence = require('./persistence.js'),
	specials = require('./specials.js'),
	items = require('./curries.json'),
	strength = require('./strength.js'),
	options = {
		'item': {
			description: 'Adds an item to your order.',
			method: function() {
				return 0;
			}
		},
		'special': {
			description: 'Adds a special to your order.',
			method: function() {
				return 1;
			}
		}
	},

help = function() {
console.log("\n\
   \\ \n\
   .\\\"\"\"\"\"\"\"\"\"-.\n\
   \\`\\-------'`/\n\
    \\ \\__ o . /\n\
     \\/  \\  o/\n\
      \\__/. /\n\
       \\_ _/\n\
         Y\n\
         |\n\
         |\n\
     _.-' '-._\n\
    `---------`\n\
".green);
	console.log('Coming Soon: ability to predict orders and translate jibberish.'.red);
	console.log('In the mean time please just ' + 'tell us'.underline + ' what you want.');
	process.exit(-2);
},

verify = function (curry) {
	if (!curry) return curry;
	var name = curry.toLowerCase(),
		i = items.items.find(function(element, index, array) {
			return element.name.toLowerCase() === name;
		});
	return i;
};

exports.run = function() {
	var mode = commands.run(options, process.argv, 1);
	process.argv.splice(0, 4);
	var item = process.argv.join(' ');
	if (item.length > 0 && !item.trim()) {
		help();
	}
	item = item.trim();

	var stage = persistence.getKey('stage');
	if (!stage) {
		stage = {
			date: new Date(),
			items: []
		};
	}

	switch (mode) {
		case 0: {
			var s = strength.extract(item);
			var add = verify(s[0]);
			if (!add) help();
			add.strength = strength.run(s[1]);
			stage.items.push(add);
			break;
		}
		case 1: {
			specials.run(item);
			break;
		}
		default: help(); break;
	}

	persistence.updateKey('stage', stage);
};
