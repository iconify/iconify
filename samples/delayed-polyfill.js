console.log('Delaying polyfill by 10 seconds');
setTimeout(function() {
    var url = '//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js',
        element;

    element = document.createElement('script');
    element.setAttribute('src', url);
    element.setAttribute('type', 'text/javascript');
    element.setAttribute('async', true);

    console.log('Loading real polyfill');
    document.head.appendChild(element);
}, 10000);
