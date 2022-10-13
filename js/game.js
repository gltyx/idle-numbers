// Game functions
//#################################################################
function produceItem(iseconds=0) {

	game.statistics.playtime = game.statistics.playtime.plus(iseconds);
	
	seconds = new Decimal(iseconds).times(game.upgrade.ticks).times(game.infinity.pmultiplier);

	for(var x=game.number.owned.length-1;x>=0;x--) {
		if(x === 0) {
			if(game.mainnumber.plus(game.number.owned[x].times(iseconds).times(game.upgrade.multiplier.div(x+1).ceil())).lt(getMAX_VALUE())) {
				game.mainnumber = game.mainnumber.plus(game.number.owned[x].times(iseconds).times(game.upgrade.multiplier.div(x+1).ceil()));
			}else {
				game.mainnumber = getMAX_VALUE();
			}
		}else {
			if(game.number.owned[x-1].plus(game.number.owned[x].times(game.number.bought[x-1]).times(iseconds).times(game.upgrade.multiplier.div(x+1).ceil())).lt(getMAX_VALUE())) {
				game.number.owned[x-1] = game.number.owned[x-1].plus(game.number.owned[x].times(game.number.bought[x-1]).times(iseconds).times(game.upgrade.multiplier.div(x+1).ceil()));
			}else {
				game.number.owned[x-1] = getMAX_VALUE();
			}
		}
	}
};

function addItem() {
	var newitem = game.number.owned.length;

	if(game.upgrade.maxnumbers.gt(game.number.owned.length)) {					
		game.number.owned.push(new Decimal(0));
		game.number.bought.push(new Decimal(0));
		
		document.getElementById('item-list').appendChild( drawItem('item'+newitem,'#'+(newitem+1),'','','buyItem('+newitem+')') );
	}
};

// Buy
//#################################################################
function buyItem(iitem=new Decimal(-1)) {
	
	if(game.mainnumber.gte(getNumberCosts(iitem))) {
		game.mainnumber				= game.mainnumber.minus(getNumberCosts(iitem));
		game.number.owned[iitem] 	= game.number.owned[iitem].plus(1);
		game.number.bought[iitem] 	= game.number.bought[iitem].plus(1);

		game.statistics.clicks 		= game.statistics.clicks.plus(1);
		
		addItem();
		refresh();
	}
};

function buyAllNumbers() {
	for(var x=0;x<game.number.owned.length;x++) {
		document.getElementById('game-item'+x).onclick();
	}
};

function buyAllUpgrades() {
	document.getElementById('game-maxnumbers').onclick();
	document.getElementById('game-ticks').onclick();
	document.getElementById('game-multiplier').onclick();
	document.getElementById('game-maxvalue').onclick();
};

function buyMaxvalue() {
	
	if(game.mainnumber.gte(getMaxvalueCosts())) {
		game.mainnumber = game.mainnumber.minus(getMaxvalueCosts());
		game.upgrade.maxvalue = game.upgrade.maxvalue.plus(1);
		
		game.statistics.clicks 		= game.statistics.clicks.plus(1);
		
		saveGame();
		refresh();
	}
};

function buyMaxnumbers() {
	
	if(game.mainnumber.gte(getMaxnumbersCosts())) {
		game.mainnumber = game.mainnumber.minus(getMaxnumbersCosts());
		game.upgrade.maxnumbers = game.upgrade.maxnumbers.plus(1);
		
		game.statistics.clicks 		= game.statistics.clicks.plus(1);
		
		addItem();
		
		saveGame();
		refresh();
	}
};

function buyMultiplier() {
	
	if(game.mainnumber.gte(getMultiplierCosts())) {
		game.mainnumber = game.mainnumber.minus(getMultiplierCosts());
		game.upgrade.multiplier = game.upgrade.multiplier.plus(1);				
		
		game.statistics.clicks 		= game.statistics.clicks.plus(1);
		
		saveGame();
		refresh();
	}
};

function buyTicks() {
	
	if(game.mainnumber.gte(getTicksCosts())) {
		game.mainnumber = game.mainnumber.minus(getTicksCosts());
		game.upgrade.ticks = game.upgrade.ticks.plus(1);				
		
		game.statistics.clicks 		= game.statistics.clicks.plus(1);
		
		saveGame();
		refresh();
	}
};

function buyPrestige() {

	var statistics = game.statistics;
	var infinity = game.infinity;
	var upgrade = game.upgrade;
	var number = game.number;

	if(game.mainnumber.gte(getPrestigeCosts())) {
		game = getDefaultGame();
		game.statistics = statistics;
		game.infinity = infinity;
		
		game.infinity.prestige = game.infinity.prestige.plus(1);		
		game.statistics.clicks = game.statistics.clicks.plus(1);
		
		for(var x=0;x<number.bought.length;x++) {
			game.infinity.pmultiplier = game.infinity.pmultiplier.plus(number.bought[x].times(game.infinity.prestige));
		}
		
		saveGame();
		refresh();
		setupGame();
	
		openTab('items');
		document.getElementById('body').setAttribute('class', 'w3-animate-zoom');
		
		window.setTimeout(function() {
			document.getElementById('body').setAttribute('class', '');
		},1500);
	}
};

function buyInfinity() {

	var statistics = game.statistics;
	var infinity = game.infinity;

	if(game.mainnumber.gte(getInfinityCosts())) {
		game = getDefaultGame();
		game.statistics = statistics;
		game.infinity.infinity = infinity.infinity;
		
		game.infinity.infinity = game.infinity.infinity.plus(1);
		game.statistics.clicks = game.statistics.clicks.plus(1);
		game.infinity.imultiplier = game.infinity.imultiplier.plus(infinity.pmultiplier.times(2));
		
		saveGame();
		refresh();
		setupGame();
	
		openTab('items');
		document.getElementById('body').setAttribute('class', 'w3-animate-zoom');
		
		window.setTimeout(function() {
			document.getElementById('body').setAttribute('class', '');
		},1500);
	}
};

// Costs
//#################################################################
function getNumberCosts(iitem=-1,ivalue=0) {
	return (new Decimal(10).pow(iitem)).times(new Decimal(2).pow(game.number.bought[iitem]).plus(ivalue));
};

function getMaxnumbersCosts() {
	return new Decimal(3).pow(game.upgrade.maxnumbers.times(game.upgrade.maxnumbers));
};

function getTicksCosts() {
	return new Decimal(5).pow(game.upgrade.ticks);
};

function getMultiplierCosts() {
	return new Decimal(2).pow(game.upgrade.multiplier.times(2));
};

function getMaxvalueCosts() {
	return new Decimal(100).pow(game.upgrade.maxvalue);
};

function getPrestigeCosts() {
	if(getMAX_VALUE().gte('1e24')) {
		return getMAX_VALUE();
	}else {
		return new Decimal('1e24');
	}
};

function getInfinityCosts() {
	var inf = game.infinity.infinity.plus(308);
	return new Decimal('1e'+inf);
};

function getMAX_VALUE() {

	if(getMaxvalueCosts().lt(getInfinityCosts())) {
		return getMaxvalueCosts();
	}else {
		return getInfinityCosts();
	}
};

// Visuals
//#################################################################
function openTab(tabId) {
	var i;
	var x = document.getElementsByClassName('tabs');
	
	for(var i=0;i<x.length;i++) {
		x[i].style.display = 'none';
	}
	
	document.getElementById(tabId).style.display = 'block';
	game.visuals.tab = tabId;
	
	if(tabId === 'options') {
		exportGame();
		//document.getElementById('savegame_output').value = btoa(JSON.stringify(game));
	}
};

function drawItem(iname='',ileft='',itext='',iright='',ionclick='') {
	// Main
	var drawObj_Main = document.createElement('li');
	drawObj_Main.setAttribute('id', 'game-'+iname);
	drawObj_Main.setAttribute('class', 'w3-light-grey w3-button');
	drawObj_Main.setAttribute('onclick', ionclick);
	drawObj_Main.setAttribute('style', 'width:100%;height:80px;');
	
	// Button
	var drawObj_Button = document.createElement('div');
	drawObj_Button.setAttribute('id', 'buy-'+iname);
	drawObj_Button.setAttribute('class', 'w3-row');				
	
	// Progress
	var drawObj_Progress = document.createElement('div');
	drawObj_Progress.setAttribute('id', 'progress-'+iname);
	drawObj_Progress.setAttribute('class', 'w3-col s12');
	
	// Left
	var drawObj_Left = document.createElement('div');
	drawObj_Left.setAttribute('id', 'left-'+iname);
	drawObj_Left.setAttribute('class', 'w3-col s3 w3-text-grey w3-large w3-left-align');
	drawObj_Left.innerHTML = ileft;
	
	// Text
	var drawObj_Text = document.createElement('div');
	drawObj_Text.setAttribute('id', 'text-'+iname);
	drawObj_Text.setAttribute('class', 'w3-col s6');
	drawObj_Text.innerHTML = itext;
	
	// Right
	var drawObj_Right = document.createElement('div');
	drawObj_Right.setAttribute('id', 'right-'+iname);
	drawObj_Right.setAttribute('class', 'w3-col s3 w3-text-grey w3-small w3-right-align');
	drawObj_Right.innerHTML = iright;
	
	// Break
	var drawObj_Br = document.createElement('br');
	
	// Append
	drawObj_Button.appendChild(drawObj_Progress);
	drawObj_Button.appendChild(drawObj_Br);
	drawObj_Button.appendChild(drawObj_Left);
	drawObj_Button.appendChild(drawObj_Text);
	drawObj_Button.appendChild(drawObj_Right);
	drawObj_Main.appendChild(drawObj_Button);
	
	return drawObj_Main;
};

function formatValue(ivalue=new Decimal(0)) {
	
	var value = ivalue.abs();
	
	if(value.lt(1000)) {
		return ivalue.toFixed(0);
	}else {
		return ivalue.toExponential(2);
	}
};

function formatTime(itime) {

	var timeoutput = ''
	var newtime = itime;
	
	var minute 	= 60;
	var hour 	= 60*60;
	var day 	= 60*60*24;
	var year 	= 60*60*24*365;				
	
	if(itime >= year) {
		timeoutput = timeoutput + Math.floor(newtime / year) + "y "
		newtime = newtime - (Math.floor(newtime / year) * year);
	}
	
	if(itime >= day) {
		timeoutput = timeoutput + Math.floor(newtime / day) + "d "
		newtime = newtime - (Math.floor(newtime / day) * day);
	}
	
	if(itime >= hour) {
		timeoutput = timeoutput + Math.floor(newtime / hour) + "h "
		newtime = newtime - (Math.floor(newtime / hour) * hour);
	}
	
	if(itime >= minute) {
		timeoutput = timeoutput + Math.floor(newtime / minute) + "m "
		newtime = newtime - (Math.floor(newtime / minute) * minute);
	}
	
	timeoutput = timeoutput + Math.floor(newtime) + "s"
	
	return timeoutput;
};

function progressColor(iprogress=new Decimal(0)) {
	var progress_color = '';

	if(iprogress.gte(0) && iprogress.lt(25)) {
		progress_color = 'w3-red';
	} else if(iprogress.gte(25) && iprogress.lt(50)) {
		progress_color = 'w3-orange';
	} else if(iprogress.gte(50) && iprogress.lt(75)) {
		progress_color = 'w3-amber';
	} else if(iprogress.gte(75) && iprogress.lt(100)) {
		progress_color = 'w3-yellow';
	} else if(iprogress.gte(100)){
		progress_color = 'w3-green';
	}
	
	return progress_color;
};

function refresh() {

	// Main Number
	document.getElementById('mainnumber').innerHTML = formatValue(game.mainnumber);
	refreshProgress('progress-overall',getMAX_VALUE(),'right');
	
	switch(game.visuals.tab) {
	
		case 'items':
			// Numbers				
			for(var x=0;x<game.number.owned.length;x++) {
			
				refreshProgress('progress-item'+x,getNumberCosts(x));
				
				document.getElementById('text-item'+x).innerHTML = '<span class="w3-medium">'+formatValue(game.number.owned[x])+'</span>' + ' <span class="w3-small">('+formatValue(game.number.bought[x])+')</span>' + '<br/>' + '<span class="w3-medium">'+formatValue(getNumberCosts(x))+'</span>';
				
				if(typeof game.upgrade.multiplier.div(x+1) !== 'undefined' && game.upgrade.multiplier.div(x+1).ceil() > 1) {
					document.getElementById('right-item'+x).innerHTML = 'x'+formatValue(game.upgrade.multiplier.div(x+1).ceil());
				}
			}
		break;
		
		case 'upgrades':
			// Upgrades
			document.getElementById('left-maxvalue').innerHTML = formatValue(game.upgrade.maxvalue);
			document.getElementById('text-maxvalue').innerHTML = 'Max Value' + '<br/>' + formatValue(getMaxvalueCosts());
			refreshProgress('progress-maxvalue',getMaxvalueCosts());
			
			document.getElementById('left-maxnumbers').innerHTML = formatValue(game.upgrade.maxnumbers);
			document.getElementById('text-maxnumbers').innerHTML = 'Max Numbers' + '<br/>' + formatValue(getMaxnumbersCosts());
			refreshProgress('progress-maxnumbers',getMaxnumbersCosts());
			
			document.getElementById('left-multiplier').innerHTML = formatValue(game.upgrade.multiplier);
			document.getElementById('text-multiplier').innerHTML = 'Multiplier' + '<br/>' + formatValue(getMultiplierCosts());
			refreshProgress('progress-multiplier',getMultiplierCosts());
			
			document.getElementById('left-ticks').innerHTML = formatValue(game.upgrade.ticks);
			document.getElementById('text-ticks').innerHTML = 'Ticks' + '<br/>' + formatValue(getTicksCosts());
			refreshProgress('progress-ticks',getTicksCosts());
		break;
		
		case 'infinity':
			// Infinity
			refreshProgress('progress-prestige',getPrestigeCosts());
			document.getElementById('text-prestige').innerHTML = 'Prestige' + '<br/>' + formatValue(getPrestigeCosts());
			
			refreshProgress('progress-infinity',getInfinityCosts());
			document.getElementById('text-infinity').innerHTML = 'Infinity' + '<br/>' + formatValue(getInfinityCosts());
		break;
		
		case 'options':
			// Statistics
			document.getElementById('playtime').innerHTML 		= formatTime(game.statistics.playtime);
			document.getElementById('clicks').innerHTML 		= formatValue(game.statistics.clicks);
			document.getElementById('lastsave').innerHTML 		= new Date(game.statistics.lastsave);
		break;
	
		default:
		break;
	}
};

function refreshProgress(iitem='',ivalue=new Decimal(0),ialign='center') {

	var progress = new Decimal(0);
	progress = game.mainnumber.div(ivalue).times(100);
	
	if(progress.gte(100)) {
		progress = new Decimal(100);
	}
	
	document.getElementById(iitem).innerHTML = '&nbsp;';
	document.getElementById(iitem).setAttribute('class', ''+progressColor(progress));
	
	if(ialign === 'center') {
		document.getElementById(iitem).setAttribute('style', 'display: inline-block; height: 10px; width:'+progress.toFixed(4)+'%;');
	}else {
		document.getElementById(iitem).setAttribute('style', 'height: 10px; width:'+progress.toFixed(4)+'%;');
	}
};

// Game setup
//#################################################################
function getDefaultGame() {
	return {
		mainnumber 	: new Decimal(1),
		
		number : {
			owned 	: [new Decimal(0)],
			bought 	: [new Decimal(0)]
		},
		
		upgrade : {
			maxvalue 	: new Decimal(1),
			ticks 		: new Decimal(1),
			maxnumbers 	: new Decimal(1),
			multiplier 	: new Decimal(1)					
		},
		
		statistics : {
			playtime 	: new Decimal(0),
			clicks 		: new Decimal(0),
			lastsave 	: new Decimal(Date.now())
		},
		
		infinity : {
			prestige 	: new Decimal(0),
			pmultiplier	: new Decimal(1),
			infinity	: new Decimal(0),
			imultiplier	: new Decimal(1)
		},
		
		visuals : {
			tab : 'items'
		}
	};
};			
let game = getDefaultGame();

function loadGame(saveGamefile) {
	
	if(typeof saveGamefile !== 'undefined' && saveGamefile !== null && saveGamefile !== '') {
		newsave = JSON.parse(saveGamefile);
		
		// Main
		if(typeof newsave.mainnumber !== 'undefined') {
			game.mainnumber = new Decimal(newsave.mainnumber);
		}
		
		// Infinity
		if(typeof newsave.infinity !== 'undefined') {
			if(typeof newsave.infinity.prestige !== 'undefined') {
				game.infinity.prestige = new Decimal(newsave.infinity.prestige);
			}
			if(typeof newsave.infinity.pmultiplier !== 'undefined') {
				game.infinity.pmultiplier = new Decimal(newsave.infinity.pmultiplier);
			}
			if(typeof newsave.infinity.infinity !== 'undefined') {
				game.infinity.infinity = new Decimal(newsave.infinity.infinity);
			}
			if(typeof newsave.infinity.imultiplier !== 'undefined') {
				game.infinity.imultiplier = new Decimal(newsave.infinity.imultiplier);
			}
		}
		
		// Statistics
		if(typeof newsave.statistics !== 'undefined') {
			if(typeof newsave.statistics.playtime !== 'undefined') {
				game.statistics.playtime = new Decimal(newsave.statistics.playtime);
			}			
			if(typeof newsave.statistics.clicks !== 'undefined') {
				game.statistics.clicks = new Decimal(newsave.statistics.clicks);
			}			
			if(typeof newsave.statistics.lastsave !== 'undefined') {
				game.statistics.lastsave = new Decimal(newsave.statistics.lastsave);
			}
		}
		
		// Upgrade
		if(typeof newsave.upgrade !== 'undefined') {
			if(typeof newsave.upgrade.maxvalue !== 'undefined') {
				game.upgrade.maxvalue = new Decimal(newsave.upgrade.maxvalue);
			}			
			if(typeof newsave.upgrade.maxnumbers !== 'undefined') {
				game.upgrade.maxnumbers = new Decimal(newsave.upgrade.maxnumbers);
			}			
			if(typeof newsave.upgrade.multiplier !== 'undefined') {
				game.upgrade.multiplier = new Decimal(newsave.upgrade.multiplier);
			}			
			if(typeof newsave.upgrade.ticks !== 'undefined') {
				game.upgrade.ticks = new Decimal(newsave.upgrade.ticks);
			}
		}
		
		// Numbers
		if(typeof newsave.number !== 'undefined') {
			for(var i=0;i<Object.keys(newsave.number.owned).length;i++) {
				game.number.owned[i] = new Decimal(newsave.number.owned[i]);
			}			
			for(var i=0;i<Object.keys(newsave.number.bought).length;i++) {
				game.number.bought[i] = new Decimal(newsave.number.bought[i]);
			}
		}
	}
	
	var lastseconds = Math.floor((Date.now() - game.statistics.lastsave)/1000);
	
	produceItem(lastseconds);
	saveGame();
};

function saveGame() {
	game.statistics.lastsave = Date.now();
	localStorage.setItem('saveGamefile',LZString.compressToUTF16(JSON.stringify(game)));
};

function importGame() {
	var importGame = atob(document.getElementById('savegame_output').value);
	loadGame(importGame);
	saveGame();
	setupGame();
};

function exportGame() {
	document.getElementById('savegame_output').value = btoa(JSON.stringify(game));
};

function deleteGame() {

	openTab('items');

	localStorage.removeItem('saveGamefile');
	
	game = getDefaultGame();
	
	saveGame();
	setupGame();
};

function setupGame() {
	var compressed_saveGamefile = localStorage.getItem('saveGamefile');
	
	if(compressed_saveGamefile !== null) {
		loadGame(LZString.decompressFromUTF16(compressed_saveGamefile));
	}

	// Reset
	document.getElementById('item-list').innerHTML = '';
	document.getElementById('upgrades-list').innerHTML = '';
	document.getElementById('infinity-list').innerHTML = '';
	document.getElementById('buyAllNumbers_Check').checked = '';
	document.getElementById('buyAllUpgrades_Check').checked = '';

	// Main
	document.getElementById('mainnumber').innerHTML = formatValue(game.mainnumber);
	
	// Numbers
	for(var x=0;x<game.number.owned.length;x++) {
		document.getElementById('item-list').appendChild( drawItem('item'+x,'#'+(x+1),'','','buyItem('+x+')') );
	}
	
	// Upgrades
	document.getElementById('upgrades-list').appendChild( drawItem('maxnumbers','','','','buyMaxnumbers()') );
	document.getElementById('upgrades-list').appendChild( drawItem('ticks','','','','buyTicks()') );
	document.getElementById('upgrades-list').appendChild( drawItem('multiplier','','','','buyMultiplier()') );
	document.getElementById('upgrades-list').appendChild( drawItem('maxvalue','','','','buyMaxvalue()') );
	
	// Infinity
	document.getElementById('infinity-list').appendChild( drawItem('prestige',formatValue(game.infinity.prestige),'Prestige<br/>'+formatValue(getPrestigeCosts()),'x'+formatValue(game.infinity.pmultiplier),'buyPrestige()') );
	document.getElementById('infinity-list').appendChild( drawItem('infinity',formatValue(game.infinity.infinity),'Infinity<br/>'+formatValue(getInfinityCosts()),'x'+formatValue(game.infinity.imultiplier),'buyInfinity()') );
	
	// Start loop
	requestAnimationFrame(gameloop);
};

// Hotkeys
//#################################################################
window.addEventListener('keydown', function(event) {
	
	//alert(event.keyCode); // DEV

	switch(event.keyCode) {
		
		case 49: // 1
			openTab('items');
		break;
		
		case 50: // 2
			openTab('upgrades');
		break;
		
		case 51: // 3
			openTab('infinity');
		break;
		
		case 81: // Q
			holddown_buyAllNumbers = true;
		break;
		
		case 87: // W
			holddown_buyAllUpgrades = true;
		break;
		
		case 79: // O
			openTab('options');
		break;
		
		case 83: // S
			saveGame();
			exportGame();
		break;

		default:
		break;
	}
}, false);

window.addEventListener('keyup', function(event) {

	switch(event.keyCode) {
		
		case 81: // Q
			holddown_buyAllNumbers = false;
		break;
		
		case 87: // W
			holddown_buyAllUpgrades = false;
		break;

		default:
		break;
	}
}, false);

window.addEventListener('mouseup', function(event) {
	holddown_buyAllNumbers 		= false;
	holddown_buyAllUpgrades 	= false;
}, false);

// Game Loop
//#################################################################
var holddown_buyAllNumbers 		= false;
var holddown_buyAllUpgrades 	= false;

var maxsaves = 100;
var cntsaves = 0;

var ticks = 100;
var lastTick = (new Date).getTime();
var gameloop = function() {
	
	// current time in ms
	var now = (new Date).getTime();
	var deltaTime = (now - lastTick);
	
	if(deltaTime >= ticks) {
	
		produceItem(deltaTime/1000);
		
		refresh();
		lastTick = now;
		
		if(cntsaves > maxsaves) {
			saveGame();
			cntsaves = 0;
		}
		cntsaves++;
		
		if(holddown_buyAllNumbers || document.getElementById('buyAllNumbers_Check').checked) {
			buyAllNumbers();
		}
		
		if(holddown_buyAllUpgrades || document.getElementById('buyAllUpgrades_Check').checked) {
			buyAllUpgrades();
		}
	}
	
	requestAnimationFrame(gameloop);
};