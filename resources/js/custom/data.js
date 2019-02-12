$(function() {
	loadData();
});

function loadData() {
	App = JSON.parse(localStorage["coffee-crowdfunding"]);
	
	App.Values.money = calculateMoney();
	
	$('#money').text( App.Values.money );
	$('#coffee-number').text( App.Values.coffees.length );
	$('#donator-number').text( App.Values.donators.length );
	$('#donated').text( calculateDonated() );
	$('#spent').text( calculateSpent() );

	loadDonatorsList();
	loadDonationsList();
	loadCoffeesList();
}

function calculateDonated() {
	var donations = App.Values.donations,
		donationVal = 0;
	
	for (var d in donations) {
		var donation = donations[d];
		
		donationVal += parseFloat(donation.value);
	}
	
	return parseFloat(donationVal).toFixed(2);
}

function calculateSpent() {
	var coffees = App.Values.coffees,
		coffeeVal = 0;
		
	for (var c in coffees) {
		var coffee = coffees[c];
		
		coffeeVal += parseFloat(coffee.price);
	}
	
	return parseFloat(coffeeVal).toFixed(2);
}

function calculateMoney() {
	return parseFloat(calculateDonated() - calculateSpent()).toFixed(2);
}

function loadDonatorsList() {
	$('.donator-list').each(function() {
		var donators = App.Values.donators;
		
		$(this).html('');
		
		for (var d in donators) {
			var donator = donators[d];
			
			$(this).append('<option value="'+ donator.id +'">'+ donator.name +'</option>');
		}
	});
}

function saveData() {
	localStorage.setItem('coffee-crowdfunding', JSON.stringify(App));
}

function insertDonator() {
	var donatorName = $('#donator').val();
	App.Values.donators.push( new Donator(getLastDonatorId() + 1, donatorName) );
	
	saveData();
	loadData();
}

function loadDonationsList() {
	$('.donation-list').each(function() {
		var donations = App.Values.donations;
		
		$(this).html('');
		
		for (var d in donations) {
			var donation = donations[d],
				donator = findDonatorById(donation.donatorId);
				
			$(this).append('<option value="'+ donation.id +'">'+ donation.value +''+ (donator ? ' - '+ donator.name : '') +'</option>');
		}
	});
}

function loadCoffeesList() {
	$('.coffee-list').each(function() {
		var coffees = App.Values.coffees;
		
		$(this).html('');
		
		for (var c in coffees) {
			var coffee = coffees[c];
				
			$(this).append('<option value="'+ coffee.id +'">'+ coffee.price +' - '+ coffee.description +'</option>');
		}
	});
}

function insertCoffee() {
	var coffeePrice = $('#coffee-price').val(),
		coffeeDescription = $('#coffee-description').val();
		
	App.Values.coffees.reverse();
	App.Values.coffees.push( new Coffee(getLastCoffeeId() + 1, parseFloat(coffeePrice).toFixed(2), coffeeDescription, new Date()) );
	App.Values.coffees.reverse();
	
	sortByDate(App.Values.coffees);
	saveData();
	loadData();
}

function insertDonation() {
	var donationValue = $('#donation-value').val(),
		donatorId = $('#donation-donator').val();
	
	App.Values.donations.reverse();
	App.Values.donations.push( new Donation(getLastDonationId() + 1, parseFloat(donationValue).toFixed(2), donatorId, new Date()) );
	App.Values.donations.reverse();
	
	sortByDate(App.Values.donations);
	saveData();
	loadData();
}

function deleteDonation() {
	var donationId = $('#delete-donation').val(),
		donations = App.Values.donations;
		
	for (var d in donations) {
		var donation = donations[d];
		
		if (donation.id == donationId) {
			App.Values.donations.splice(d, 1);
		}
	}
	
	saveData();
	loadData();
}

function deleteCoffee() {
	var coffeeId = $('#delete-coffee').val(),
		coffees = App.Values.coffees;
		
	for (var c in coffees) {
		var coffee = coffees[c];
		
		if (coffee.id == coffeeId) {
			App.Values.coffees.splice(c, 1);
		}
	}
	
	saveData();
	loadData();
}

function deleteDonator() {
	var donatorId = $('#delete-donator').val(),
		donators = App.Values.donators;
		
	for (var d in donators) {
		var donator = donators[d];
		
		if (donator.id == donatorId) {
			App.Values.donators.splice(d, 1);
		}
	}
	
	saveData();
	loadData();
}

function getLastDonatorId() {
	var donators = App.Values.donators,
		returnId = 0;
		
	for (var d in donators) {
		var donator = donators[d];
		
		if (donator.id > returnId) {
			returnId = donator.id;
		}
	}
	
	return returnId;
}

function getLastDonationId() {
	var donations = App.Values.donations,
		returnId = 0;
		
	for (var d in donations) {
		var donation = donations[d];
		
		if (donation.id > returnId) {
			returnId = donation.id;
		}
	}
	
	return returnId;
}

function findDonatorById(id) {
	var donators = App.Values.donators;
		
	for (var d in donators) {
		var donator = donators[d];
		
		if (donator.id == id) {
			return donator;
		}
	}
}

function getLastCoffeeId() {
	var coffees = App.Values.coffees,
		returnId = 0;
		
	for (var c in coffees) {
		var coffee = coffees[c];
		
		if (coffee.id > returnId) {
			returnId = coffee.id;
		}
	}
	
	return returnId;
}

function calculateDonationsPerDonator() {
	var donatorsIds = {},
		donators = {};
	
	App.Values.donations.forEach(function(donation) {
		if (donatorsIds[donation.donatorId]) {
			donatorsIds[donation.donatorId] += parseFloat(donation.value);
		} else {
			donatorsIds[donation.donatorId] = parseFloat(donation.value);
		}
	});
	
	for (var key in donatorsIds) {
		var donatorName = getDonatorById(key).name;
		donators[donatorName] = donatorsIds[key].toFixed(2);
	}

	return donators;
}

function getDonatorById(id) {
	var returnValue = null;
	
	App.Values.donators.forEach(function(donator) {
		if (donator.id == id) {
			returnValue = donator;
		}
	});
	
	return returnValue;
}

function sortByDate(array) {
	array.sort(function(a, b) {
		a = a.dateCreated;;
		b = b.dateCreated;
		return a>b ? -1 : a<b ? 1 : 0;
	});
};