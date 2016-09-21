/* eslint no-console: 0 */

(function () {

	'use strict';

	const Battery = {

		getInfo() {

			navigator.getBattery().then(battery => {

				const c = Battery.currentLevel(battery);

				Battery.batteryStateRender(c);
				Battery.isCharging(battery);
				Battery.chargingTimeChange(battery);
				Battery.dischargingTimeChange(battery);

				battery.addEventListener('levelchange', () => {
					const c = Battery.currentLevel(battery);
					Battery.batteryStateRender(c);
				}, false);

				battery.addEventListener('chargingchange', () => {
					Battery.isCharging(battery);
				}, false);

				battery.addEventListener('chargingtimechange', () => {
					Battery.chargingTimeChange(battery);
				}, false);

				battery.addEventListener('dischargingtimechange', () => {
					Battery.dischargingTimeChange(battery);
				}, false);

			});

		},

		currentLevel(b) {
			const level = document.querySelector('.battery-level');
			const tableCurrentLevel = document.querySelector('.table__cell--current-level');

			level.textContent = ((b.level * 100).toFixed()) + '%';
			tableCurrentLevel.textContent = ((b.level * 100).toFixed()) + '%';

			level.classList.remove('mdl-spinner', 'mdl-js-spinner', 'is-active');

			return b.level * 100;
		},

		isCharging(b) {
			const tableChargeState = document.querySelector('.table__cell--charge-state');
			const snackbarContainer = document.querySelector('#demo-toast-example');
			const data = {message: b.charging ? 'Charging...' : 'Not charging'};

			snackbarContainer.MaterialSnackbar.showSnackbar(data);

			tableChargeState.textContent = b.charging ? 'Charging...' : 'Not charging';

			return b.charging;
		},

		chargingTimeChange(b) {
			const chargeTime = document.querySelector('.table__cell--time-to-charge');
			chargeTime.textContent = b.chargingTime;
		},

		dischargingTimeChange(b) {
			const chargeTime = document.querySelector('.table__cell--time-to-discharge');
			chargeTime.textContent = b.dischargingTime;
		},

		batteryStateRender(b) {
			const maxHeight = 286;
			const green = '#4CAF50';
			const lightGreen = '#8BC34A';
			const lime = '#CDDC39';
			const yellow = '#FFEB3B';
			const amber = '#FFC107';
			const orange = '#FF9800';
			const deepOrange = '#FF5722';
			const red = '#FF5722';

			const batteryFill = document.querySelector('.battery-fill');
			const level = document.querySelector('.battery-level');
			const currentRenderLevel = (maxHeight * b) / 100;
			batteryFill.style.height = currentRenderLevel + 'px';

			if (currentRenderLevel < 165) level.style.color = '#5E5E5E';
			else level.style.color = '#FFFFFF';

			if (b >= 90) batteryFill.style.background = green;
			else if (b >= 80) batteryFill.style.background = lightGreen;
			else if (b >= 70) batteryFill.style.background = lime;
			else if (b >= 60) batteryFill.style.background = yellow;
			else if (b >= 50) batteryFill.style.background = amber;
			else if (b >= 40) batteryFill.style.background = orange;
			else if (b >= 30) batteryFill.style.background = deepOrange;
			else if (b >= 0) batteryFill.style.background = red;
		},

		init() {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('./sw.js', {scope: './'}).then(registration => {
					console.log('ServiceWorker registration successful with scope: ', registration.scope);
				}).catch(err => {
					console.log('ServiceWorker registration failed: ', err);
				});
			}
			this.getInfo();
		}
	};

	Battery.init();
})();