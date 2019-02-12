$(function() {
	var data = localStorage.getItem('coffee-crowdfunding');
	
	setTimeout(function() {
		App = JSON.parse(data);
		
		loadData();
	}, 100);
});

function loadData() {
	setGoal();
	
	var goalPercentage = Math.round(getGoalPercentage());
	
	$('#percentage').text( goalPercentage+'%' );
	$('#price-bar div').css('background','-moz-linear-gradient(left, #8e0306 '+(goalPercentage-2)+'%, #ffffff '+(goalPercentage+2)+'%)');
	$('#money').text( App.Values.money );
	$('#goal').text( App.Values.goal );
	
	if (goalPercentage < 10) {
		$('#message').text('So little =(');
	} else if (goalPercentage < 20) {
		$('#message').text('It\'s something');
	} else if (goalPercentage < 30) {
		$('#message').text('Way to go');
	} else if (goalPercentage < 40) {
		$('#message').text('Help plx!');
	} else if (goalPercentage < 50) {
		$('#message').text('Almost half!');
	} else if (goalPercentage < 60) {
		$('#message').text('Finally HALF! o/');
	} else if (goalPercentage < 70) {
		$('#message').text('Go Go Go!');
	} else if (goalPercentage < 80) {
		$('#message').text('A little more');
	} else if (goalPercentage < 90) {
		$('#message').text('And we\'ll have a nice and fresh coffee xD');
	} else if (goalPercentage < 100) {
		$('#message').text('wow, much coffee, so delish, plz money');
	} else if (goalPercentage >= 100) {
		$('#message').text('Thanks for helping feed our veins with this black blood =)');
	}
	
	for (var d in App.Values.donations) {
		var donation = App.Values.donations[d],
			donator,
			li = $('<li>');
		
		for (var dd in App.Values.donators) {
			var currDonator = App.Values.donators[dd];
			
			if (currDonator.id == donation.donatorId) {
				donator = currDonator;
			}
		}
		
		li.append( $('<span>').text(donator.name) );
		li.append( $('<span>').text(donation.value) );
		
		$('#donators').append(li);
	}
	
	for (var c in App.Values.coffees) {
		var coffee = App.Values.coffees[c],
			li = $('<li>');
		
		li.append( $('<span>').text(coffee.description) );
		li.append( $('<span>').text(coffee.price) );
		
		$('#coffees').append(li);
	}
}

function getGoalPercentage() {
	var money = parseFloat(App.Values.money),
		goal = parseFloat(App.Values.goal);
		
	if (money <= 0) {
		return 0;
	}

	return (money * 100) / goal;
}

function setGoal() {
	var coffees = App.Values.coffees,
		curCoffee = coffees[0];
	
	for (var c in coffees) {
		var coffee = coffees[c];
		
		if (coffee.id > curCoffee.id) {
			curCoffee = coffee;
		}
	}
	
	App.Values.goal = curCoffee.price;
}