window.addEventListener('load', load, false);

var subscription = null;

function load() {
    console.log('function load');
    document.getElementById('register').addEventListener('click', register, false);
    document.getElementById('push').addEventListener('click', setPush, false);
    navigator.serviceWorker.ready.then(checkPush);
}

function register(){
    console.log('function register');
    navigator.serviceWorker.register('push.js').then(checkNotification);
}

function checkNotification(){
    console.log('function checkNotification');
    Notification.requestPermission(function(permission){
        if (permission === 'default') {
            console.log('The user has not asked permission yet, and notice isn\'t indicated.');
            document.getElementById('push').disabled = false;
        } else if (permission === 'granted') {
            console.log('The user was desired and permitted permission of notice indication before.');
            document.getElementById('push').disabled = false;
        } else { // denied
            alert('The user refused indication of notice specifically.');
        }
    });
}

function checkPush(sq){
    console.log('function checkPush');
    console.log(sq);
    sq.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s){
    console.log('function setSubscription');
    console.log(s);
    if (!s) {
        resetSubscription();
    } else {
        document.getElementById('register').disabled = true;
        subscription = s;
        var push = document.getElementById('push');
        push.textContent = 'push off';
        push.disabled = false;
        registerNotification(s);
    }
}

function resetSubscription(){
    console.log('function resetSubscription');
    document.getElementById('register').disabled = true;
    subscripton = null;
    var push = document.getElementById('push');
    push.textContent = 'push on';
    push.disabled = false;
}

function setPush(){
    console.log('function setPush');
    if (!subscription) {
        if (Notification.permission == 'denied') {
            alert("Can't enabled push");
            return;
        }
        navigator.serviceWorker.ready.then(subscribe);
    } else {
        navigator.serviceWorker.ready.then(unsubscribe);
    }
}

function subscribe(sw){
    console.log('function subscribe');
    console.log(sw);
    sw.pushManager.subscribe({
        userVisibleOnly: true
    }).then(setSubscription, resetSubscription);
}

function unsubscribe() {
    console.log('function unsubscribe');
    if (subscription) {
        subscription.unsubscribe();
    }
    resetSubscription();
}

function registerNotification(s){
    console.log('function registerNotification');
    console.log(s);
    var endpoint = s.endpoint;
    console.log(endpoint);
    if (('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId)) {
        endpoint += '/' + s.subscriptionId;
    }
}
