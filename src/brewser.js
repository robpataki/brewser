(function(global) {

    'use strict';

    if(window.BREWSER) {
        return;
    }

    var _brewser = {
        _init: function() {

            var _this = this;

            if(_this._exists) {
                return;
            }
            _this._exists = true;

            console.log(' %c BREWSER is ready - use window.BREWSER or simply BREWSER ', 'background: #222; color: #bada55; line-height: 21px; font-size: 12px; padding: 4px 0; margin-bottom: 14px;');
            
            this.VERSION = '{{VERSION}}';
            this.UA = window.navigator.userAgent.toLowerCase();

            this.MINIMUM_DESKTOP_BROWSER_VERSIONS = {
                chrome:     33,
                crios:      33,
                safari:     6,
                firefox:    30,
                ie:         9,
                opera:      22
            };


//------------- Browser feature detection methods

            this.supportsTouch = function supportsTouch() {
                return  !!('ontouchstart' in window) ||
                        (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
            };

            this.detectTouchDevice = function detectTouchDevice() {
                if(_this.supportsTouch()) {
                    if(document.body.className.indexOf('is-touch') < 0) {
                        document.body.className += ' is-touch';
                    }
                }
            };
            
            this.supportsRAF = function supportsRAF() {
                var result =    window.requestAnimationFrame       ||
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame;
                return typeof result !== 'undefined';
            };

            this.supportsVideo = function supportsVideo() {
                var videoEl = document.createElement('video');
                return !!videoEl && typeof videoEl.canPlayType !== 'undefined';
            };

            this.supportsH264Video = function supportsH264Video() {
                if(!_this.supportsVideo()) {
                    return false;
                }
                var videoEl = document.createElement('video');
                return videoEl.canPlayType('video/mp4');
            };

            this.supportsWebMVideo = function supportsWebMVideo() {
                if(!_this.supportsVideo()) {
                    return false;
                }
                var videoEl = document.createElement('video');
                return videoEl.canPlayType('video/webm');
            };

            this.supportsWebAudio = function supportsWebAudio() {
                // We cache the result after the first check, as creating too many AudioContext
                // objects throws an error in some browsers
                var result;
                if(typeof _this.cachedWebAudioResult === 'undefined') {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (typeof (window.AudioContext) !== 'undefined') {
                        var context = new AudioContext();
                        result = !!context && typeof(context.createGain) === 'function';
                    } else {
                        result = false;
                    }
                    _this.cachedWebAudioResult = result;
                } else {
                    result = _this.cachedWebAudioResult;
                }
                return result;
            };

            this.supportsAudioApi = function supportsAudioApi() {
                return !!('Audio' in window);
            };

            this.supportsGetUserMedia = function supportsGetUserMedia() {
                var result =    window.navigator.getUserMedia ||
                                window.navigator.webkitGetUserMedia ||
                                window.navigator.mozGetUserMedia ||
                                window.navigator.msGetUserMedia;
                return typeof result !== 'undefined';
            };

            this.supportsAudio = function supportsAudio() {        
                var audioEl = document.createElement('audio');
                return !!audioEl && typeof audioEl.canPlayType !== 'undefined';
            };

            this.supportsMP3Audio = function supportsMP3Audio() {
                if(!_this.supportsAudio()) {
                    return false;
                }
                var audioEl = document.createElement('audio');
                return !!(audioEl.canPlayType && audioEl.canPlayType('audio/mpeg;').replace(/no/, ''));
            };

            this.supportsOGGAudio = function supportsOGGAudio() {
                if(!_this.supportsAudio()) {
                    return false;
                }
                var audioEl = document.createElement('audio');
                return !!(audioEl.canPlayType && audioEl.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
            };

            this.supportsWAVAudio = function supportsWAVAudio() {
                if(!_this.supportsAudio()) {
                    return false;
                }
                var audioEl = document.createElement('audio');
                return !!(audioEl.canPlayType && audioEl.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
            };

            this.supportsAACAudio = function supportsAACAudio() {
                if(!_this.supportsAudio()) {
                    return false;
                }
                var audioEl = document.createElement('audio');
                return !!(audioEl.canPlayType && audioEl.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''));
            };

            this.shouldForceAudioTag = function shouldForceAudioTag() {
                var result = false;

                // At the moment only Firefox needs this, as webaudio seems
                // crashing on PCs
                if(_this.isBrowserFirefox() && !_this.isBrowserMobile() && _this.isOSWin()) {
                    result = true;
                }

                return result;
            };

            this.supportsMediaQueries = function supportsMediaQueries() {
                return !!(window.matchMedia);
            };

            this.supportsCanvas = function supportsCanvas() {
                var canvasEl = document.createElement('canvas');
                return canvasEl.getContext && typeof canvasEl.getContext('2d').fillText === 'function';
            };

            this.supportsCSSTransforms = function supportsCSSTransforms() {
                return (('getComputedStyle' in window) && 
                            (window.getComputedStyle(document.body).getPropertyValue('-webkit-transform') ||
                            window.getComputedStyle(document.body).getPropertyValue('-o-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('-moz-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('-ms-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('transform')
                        ));
            };

//------------- Browser `labeling` specific methods derived from feature detection

            this.getBrowserVersion = function getBrowserVersion(browserKey, type) {
                var keys = browserKey.split('|');
                var chunk;
                var arr = _this.UA.split(" ");

                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if(key === 'msie') {
                        var ua = _this.UA;
                        var re  = new RegExp('msie ([0-9]{1,}[\.0-9]{0,})');
                        if (re.exec(ua) !== null) {
                            if(type !== 'short') {
                                chunk = RegExp.$1;
                            } else {
                                chunk = parseFloat(RegExp.$1);
                            }
                        }

                        // Checking for 11+ version of IE
                        if (typeof(chunk) === 'undefined') {
                            if (!window.ActiveXObject && 'ActiveXObject' in window) {
                                chunk = ua.substring(ua.indexOf('rv:') + 3, ua.indexOf(')'));
                            }
                        }
                    } else {
                        for(var j = 0; j < arr.length; j++) {
                            if(arr[j].indexOf(key) > -1) {
                                chunk = arr[j];

                                if (chunk.substring(chunk.indexOf('/') > -1 && chunk.indexOf('.') > -1)) {
                                    if(type === 'short') {
                                        chunk = chunk.substring(chunk.indexOf('/') + 1, chunk.indexOf('.'));
                                        chunk = parseInt(chunk);
                                    } else {
                                        chunk = chunk.substr(chunk.indexOf('/') + 1, chunk.length);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }

                // If key can't be found
                if(typeof(chunk) === 'undefined') {
                    return 'N/A';
                }
                
                return chunk;
            };

            this.isBrowserTooOld = function isBrowserTooOld() {
                var result = 'N/A';
                
                if(this.isBrowserChrome()) {
                    result =    _this.getBrowserVersion('chrome', 'short') < _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.chrome;
                } else if(_this.isBrowserSafari()) {
                    result =    _this.getBrowserVersion('version', 'short') < _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.safari;
                } else if(_this.isBrowserOpera()) {
                    result =    _this.getBrowserVersion('opr', 'short') < _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.opera ||
                                _this.getBrowserVersion('opera', 'short') <= _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.opera;
                } else if(_this.isBrowserFirefox()) {
                    result =    _this.getBrowserVersion('firefox', 'short') < _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.firefox;
                } else if(_this.isBrowserIE() && !_this.isBrowserOldIE()) {
                    result =    _this.getBrowserVersion('msie', 'short') < _this.MINIMUM_DESKTOP_BROWSER_VERSIONS.ie;
                } else {

                    //Any browser which isn't checked against is automatically going into the fallback category!
                    result = true;
                }

                return result;  
            };

            /* All about IE :( */
            this.filterOutIE10 = function filterOutIE10() {
                if(this.UA.indexOf('msie 10.') > 0) {
                    document.getElementsByTagName('html')[0].className += ' lt-ie11';
                }
            };

            this.isBrowserOldIE = function isBrowserOldIE() {
                // Anything older than IE9 is WACK
                return document.getElementsByTagName('html')[0].className.indexOf('lt-ie9') >= 0;
            };

            this.isBrowserFallbackIE = function isBrowserFallbackIE() {
                // Anything older than IE11 is FALLBACK
                return  (document.getElementsByTagName('html')[0].className.indexOf('lt-ie11') >= 0);
            };

            this.isBrowserIE = function isBrowserIE() {
                return  !!(/(windows nt|msie)/g.test(_this.UA) &&
                        !_this.isBrowserChrome() &&
                        !_this.isBrowserSafari() &&
                        !_this.isBrowserOpera() && 
                        !_this.isBrowserFirefox());
            };

            this.isBrowserMobile = function isBrowserMobile() {
                return _this.UA.indexOf('mobile') > -1;
            };
            
            this.isBrowserTablet = function isBrowserTablet() {
                return _this.UA.indexOf('tablet') > -1;
            };
            
            this.isBrowserFirefox = function isBrowserFirefox() {
                return _this.UA.indexOf('firefox') > -1;
            };
            
            this.isBrowserMobileIE = function isBrowserMobileIE() {
                return _this.UA.indexOf('iemobile') > -1;
            };
            
            this.isBrowserOpera = function isBrowserOpera() {
                return /(opera|opr)/g.test(_this.UA);
            };
            
            this.isBrowserSafari = function isBrowserSafari() {
                return _this.UA.indexOf('safari') > -1 && !_this.isBrowserOpera() && !_this.isBrowserChrome() && !_this.isOSAndroid();
            };
            
            this.isBrowserChrome = function isBrowserChrome() {
                return (_this.UA.indexOf('chrome') > -1 || _this.UA.indexOf('crios') > -1) && !_this.isBrowserOpera();
            };

            this.isBrowserSupported = function isBrowserSupported() {
                return  !_this.isBrowserOpera() &&
                        _this.isBrowserFirefox() ||
                        _this.isBrowserChrome() ||
                        _this.isBrowserSafari() ||
                        _this.isBrowserIE() ||
                        (_this.isDeviceTablet() && _this.isBrowserMobileIE()) ||
                        _this.isBrowserStockAndroid();
            };

            this.isDevicePhone = function isDevicePhone() {
                return  window.matchMedia &&
                        _this.supportsTouch() && 
                        window.matchMedia('(max-device-width: 667px)').matches &&
                        screen.width <= 667 ? true : false;
            };

            this.isDeviceTablet = function isDeviceTablet() {
                return  window.matchMedia &&
                        _this.supportsTouch() && 
                        window.matchMedia('(min-device-width: 667px)').matches &&
                        screen.width >= 667 ? true : false;
            };

            this.isDeviceDesktop = function isDeviceDesktop() {
                return !!!(_this.isDevicePhone() || _this.isDeviceTablet());
            };

            this.isBrowserFacebook = function isBrowserFacebook() {
                return (/(fbios)/g.test(_this.UA));
            };

            this.isBrowserFacebookMessenger = function isBrowserFacebookMessenger() {
                return /(messengerforios)/g.test(_this.UA);
            };

            this.isBrowserTwitter = function isBrowserTwitter() {
                return /(twitter)/g.test(_this.UA);
            };

            this.isBrowserGooglePlus = function isBrowserGooglePlus() {
                return /(googleplus)/g.test(_this.UA);
            };

            this.isBrowserEmbedded = function isBrowserEmbedded() {
                return  _this.isBrowserFacebook() ||
                        _this.isBrowserFacebookMessenger() ||
                        _this.isBrowserTwitter() ||
                        _this.isBrowserGooglePlus();
            };

//------------- Mobile device specific methods

            this.isOSWin = function isOSWin() {
                return /(windows|windows nt)/g.test(_this.UA);
            };

            this.isOSiOS = function isOSiOS() {
                return /(ipad|iphone|ipod)/g.test(_this.UA);
            };

            this.isOSAndroid = function isOSAndroid() {
                return _this.UA.indexOf('android') > -1;
            };

            this.isBrowserStockAndroid = function isBrowserStockAndroid() {
                var result = false;

                if (_this.isOSAndroid()) {
                    result = _this.UA.indexOf('applewebkit') > -1 && _this.UA.indexOf('chrome') < 0;
                } else if(_this.isBrowserChrome()) {
                    result = _this.getBrowserVersion('chrome', 'short') < 20;
                }
                
                return result;
            };

            this.isBrowserStockiOS = function isBrowserStockiOS() {
                return  !!(_this.isOSiOS() &&
                        _this.UA.indexOf('applewebkit') > -1 &&
                        _this.UA.indexOf('safari') > -1 &&
                        _this.UA.indexOf('chrome') < 0 &&
                        _this.UA.indexOf('crios') < 0);
            };

            this.isForcedToLandscape = function isForcedToLandscape() {
                return document.body.className.indexOf('is-forced-landscape') > -1;
            };
            
            this.initLandscapeForcing = function initLandscapeForcing() {
                if(!_this.isDeviceDesktop()) {
                    var resizeEvent = new Event('resize');
                    window.addEventListener('resize', function(){
                        document.body.className = document.body.className.replace(/\bis-forced-landscape\b/, '');

                        if(window.innerWidth < window.innerHeight) {
                            document.body.className += ' is-forced-landscape';
                        }
                    });
                    window.dispatchEvent(resizeEvent);
                }
            };
        }
    };

    _brewser._init();
    global.BREWSER = _brewser;
}(this));