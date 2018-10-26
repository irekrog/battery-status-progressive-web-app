/* eslint no-console: 0 */
class BatteryStatusPWA {

  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', {scope: './'}).then(registration => {
        console.info('ServiceWorker registration: ', registration);
      }).catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
    }

    this.getInfo();
    
    const btn = document.querySelector('.button');


    let installPromptEvent;

    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent Chrome <= 67 from automatically showing the prompt
      console.log(event);
      event.preventDefault();
      // Stash the event so it can be triggered later.
      installPromptEvent = event;
      // installPromptEvent.prompt();
      // Update the install UI to notify the user app can be installed
      btn.disabled = false;
    });

    btn.addEventListener('click', () => {
      // Update the install UI to remove the install button
      btn.disabled = true;
      // Show the modal add to home screen dialog
      installPromptEvent.prompt();
      // Wait for the user to respond to the prompt
      installPromptEvent.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // Clear the saved prompt since it can't be used again
        installPromptEvent = null;
      });
    });

    window.addEventListener('appinstalled', (evt) => {
      console.log('installed', evt);
    });
  }

  getInfo() {
    navigator.getBattery().then(battery => {

      const c = this.currentLevel(battery);

      this.batteryStateRender(c);
      this.isCharging(battery);
      this.chargingTimeChange(battery);
      this.dischargingTimeChange(battery);

      battery.addEventListener('levelchange', () => {
        const c = this.currentLevel(battery);
        this.batteryStateRender(c);
      });

      battery.addEventListener('chargingchange', () => {
        this.isCharging(battery);
      });

      battery.addEventListener('chargingtimechange', () => {
        this.chargingTimeChange(battery);
      });

      battery.addEventListener('dischargingtimechange', () => {
        this.dischargingTimeChange(battery);
      });

    });
  }

  currentLevel(b) {
    const levelText = document.querySelector('.battery-level');
    const tableCurrentLevel = document.querySelector('.table__cell--current-level');

    levelText.textContent = ((b.level * 100).toFixed()) + '%';
    tableCurrentLevel.textContent = ((b.level * 100).toFixed()) + '%';

    levelText.classList.remove('mdl-spinner', 'mdl-js-spinner', 'is-active');

    return b.level * 100;
  }

  isCharging(b) {
    const tableChargeState = document.querySelector('.table__cell--charge-state');
    const snackbarContainer = document.querySelector('#demo-toast-example');
    const data = {message: b.charging ? 'Charging...' : 'Not charging'};

    !typeof snackbarContainer.MaterialSnackbar ? snackbarContainer.MaterialSnackbar.showSnackbar(data) : undefined;

    tableChargeState.textContent = b.charging ? 'Charging...' : 'Not charging';

    return b.charging;
  }

  chargingTimeChange(b) {
    const chargeTime = document.querySelector('.table__cell--time-to-charge');
    chargeTime.textContent = b.chargingTime;
  }

  dischargingTimeChange(b) {
    const chargeTime = document.querySelector('.table__cell--time-to-discharge');
    chargeTime.textContent = b.dischargingTime;
  }

  batteryStateRender(b) {
    const MAX_HEIGHT = 286;
    const GREEN = '#4CAF50';
    const LIGHT_GREEN = '#8BC34A';
    const LIME = '#CDDC39';
    const YELLOW = '#FFEB3B';
    const AMBER = '#FFC107';
    const ORANGE = '#FF9800';
    const DEEP_ORANGE = '#FF5722';
    const RED = '#FF5722';

    const batteryFill = document.querySelector('.battery-fill');
    const level = document.querySelector('.battery-level');
    const currentRenderLevel = (MAX_HEIGHT * b) / 100;
    batteryFill.style.height = currentRenderLevel + 'px';

    if (currentRenderLevel < 165) {
      level.style.color = '#5E5E5E';
    }
    else {
      level.style.color = '#FFFFFF';
    }

    if (b >= 90) batteryFill.style.background = GREEN;
    else if (b >= 80) batteryFill.style.background = LIGHT_GREEN;
    else if (b >= 70) batteryFill.style.background = LIME;
    else if (b >= 60) batteryFill.style.background = YELLOW;
    else if (b >= 50) batteryFill.style.background = AMBER;
    else if (b >= 40) batteryFill.style.background = ORANGE;
    else if (b >= 30) batteryFill.style.background = DEEP_ORANGE;
    else if (b >= 0) batteryFill.style.background = RED;
  }
}

const bsPWA = new BatteryStatusPWA();
