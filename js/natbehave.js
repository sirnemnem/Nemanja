var $status = document.getElementById('status');

if ('Notification' in window) {
  $status.innerText = Notification.permission;
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    $status.innerText = result;
  });
}

function nonPersistentNotification() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  try {
    var notification = new Notification("Hi there - non-persistent!");
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

function persistentNotification() {
  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    alert('Persistent Notification API not supported!');
    return;
  }
  
  try {
    navigator.serviceWorker.getRegistration()
      .then((reg) => reg.showNotification("Hi there - persistent!"))
      .catch((err) => alert('Service Worker registration error: ' + err));
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

var idleDetector;

function handleIdleChange() { 
  const timeBadge = new Date().toTimeString().split(' ')[0];
  const newState = document.createElement('p');
  const {user, screen} = idleDetector.state;
  newState.innerHTML = '' + timeBadge + ' User idle status changed to ' + user + '. Screen idle status changed to ' + screen + '.';
  target.appendChild(newState);
}
    
function startDetector() {
  if (!window.IdleDetector) {
    alert("Idle Detection API is not available");
    return;
  }
  
  const target = document.getElementById('target');
  
  try {
    idleDetector = new IdleDetector({ threshold: 60 });
    idleDetector.addEventListener('change', handleIdleChange);
    idleDetector.start();
  } catch (e) {
    alert('Idle Detection error:' + e);
  }
}

if ('permissions' in navigator) {
  var logTarget = document.getElementById('logTarget');

  function handleChange(permissionName, newState) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newStateInfo = document.createElement('p');
    newStateInfo.innerHTML = '' + timeBadge + ' State of ' + permissionName + ' permission status changed to ' + newState + '.';
    logTarget.appendChild(newStateInfo);
  }

  function checkPermission(permissionName, descriptor) {
    try {
    navigator.permissions.query(Object.assign({name: permissionName}, descriptor))
      .then(function (permission) {
        document.getElementById(permissionName + '-status').innerHTML = permission.state;
        permission.addEventListener('change', function (e) {
          document.getElementById(permissionName + '-status').innerHTML = permission.state;
          handleChange(permissionName, permission.state);
        });
      });
    } catch (e) {
    }
  }

  checkPermission('geolocation');
  checkPermission('notifications');
  checkPermission('push', {userVisibleOnly: true});
  checkPermission('midi', {sysex: true});
  checkPermission('camera');
  checkPermission('microphone');
  checkPermission('background-sync');
  checkPermission('ambient-light-sensor');
  checkPermission('accelerometer');
  checkPermission('gyroscope');
  checkPermission('magnetometer');

  var noop = function () {};
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
  function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(noop);
  }

  function requestNotifications() {
    Notification.requestPermission();
  }

  function requestPush() {
    navigator.serviceWorker.getRegistration()
      .then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe();
      });
  }

  function requestMidi() {
    navigator.requestMIDIAccess({sysex: true});
  }
  
  function requestCamera() {
    navigator.getUserMedia({video: true}, noop, noop)
  }
  
  function requestMicrophone() {
    navigator.getUserMedia({audio: true}, noop, noop)
  }
}

function scheduleNotification() {
  if (!('Notification' in window)) {
    alert('Notification API not supported');
    return;
  }
  if (!('showTrigger' in Notification.prototype)) {
    alert('Notification Trigger API not supported');
    return;
  }
  
  Notification.requestPermission()
    .then(() => {
      if (Notification.permission !== 'granted') {
        throw 'Notification permission is not granted';
      }
    })
    .then(() => navigator.serviceWorker.getRegistration())
    .then((reg) => {
      reg.showNotification("Hi there from the past!", {
          showTrigger: new TimestampTrigger(new Date().getTime() + 10 * 1000)
      })
    })
    .catch((err) => {
      alert('Notification Trigger API error: ' + err);
    });
}
