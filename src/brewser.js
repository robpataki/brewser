(function(global) {

    'use strict';

    if(window.BREWSER) {
        return;
    }

    var _brewser = {
        _init: function() {

            // Version bumped by Gulp, don't touch
            this.VERSION = '{{VERSION}}';

            var _this = this;

            if(_this._exists) {
                return;
            }
            _this._exists = true;

            console.log(' %c BREWSER is ready - use window.BREWSER or simply BREWSER ', 'background: #222; color: #bada55; line-height: 21px; font-size: 12px; padding: 4px 0; margin-bottom: 14px;');

            
            var _UA = window.navigator.userAgent.toLowerCase();
            _this.UA = _UA;

            _this.DEVICES = {
                phone:      'phone',
                tablet:     'tablet',
                desktop:    'desktop'
            };

            _this.BROWSERS = {
                chrome: 'Chrome',
                safari: 'Safari',
                opera: 'Opera',
                firefox: 'Firefox',
                ie: 'Internet Explorer',
                silk: 'Silk',
                other: 'Other'
            };

            _this.ORIENTATION = {
                landscape: 'LANDSCAPE',
                portrait: 'PORTRAIT'
            };

            _this.MINIMUM_DESKTOP_BROWSER_VERSIONS = {
                chrome:     33,
                crios:      33,
                safari:     6,
                firefox:    30,
                ie:         9,
                opera:      22
            };

            _this.NOT_AVAILABLE = 'N/A';

            _this.browser = {
                type: _this.NOT_AVAILABLE,
                version: _this.NOT_AVAILABLE,
                fullVersion: _this.NOT_AVAILABLE,
                string: _this.NOT_AVAILABLE,
                ie: false,
                chrome: false,
                safari: false,
                firefox: false,
                opera: false,
                silk: false,
                other: false,
                mobile: false
            };

            _this.os = {
                type: _this.NOT_AVAILABLE
            };

            _this.device = {
                type: _this.NOT_AVAILABLE,
                orientation: _this.NOT_AVAILABLE,
                screenWidth: _this.NOT_AVAILABLE,
                screenHeight: _this.NOT_AVAILABLE,
                windowWidth: _this.NOT_AVAILABLE,
                windowHeight: _this.NOT_AVAILABLE,
                resolution: _this.NOT_AVAILABLE,
                mobile: _this.NOT_AVAILABLE,
                tablet: _this.NOT_AVAILABLE,
                desktop: _this.NOT_AVAILABLE,
                touch: _this.NOT_AVAILABLE,
                ios: _this.NOT_AVAILABLE
            };

            _this.has = {                
                requestAnimationFrame: _this.NOT_AVAILABLE,
                canvas2d: _this.NOT_AVAILABLE,
                webGL: _this.NOT_AVAILABLE,
                cssTransform: _this.NOT_AVAILABLE,
                mediaQueries: _this.NOT_AVAILABLE,
                
                getUserMedia: _this.NOT_AVAILABLE,

                audio: _this.NOT_AVAILABLE,
                audioApi: _this.NOT_AVAILABLE,
                audioFormats: {
                    ogg: _this.NOT_AVAILABLE,
                    mp3: _this.NOT_AVAILABLE,
                    wav: _this.NOT_AVAILABLE,
                    aac: _this.NOT_AVAILABLE
                },
                webAudio: _this.NOT_AVAILABLE,
                
                video: _this.NOT_AVAILABLE,
                videoFormats: {
                    mp4: _this.NOT_AVAILABLE,
                    webm: _this.NOT_AVAILABLE,
                    ogg: _this.NOT_AVAILABLE
                }
            };


            function _detectDevice() {
                _this.screenWidth = window.screen.width;
                _this.screenHeight = window.screen.height;
                _this.windowWidth = window.innerWidth;
                _this.windowHeight = window.innerHeight;
                _this.resolution = window.devicePixelRatio || 1;

                if(_this.windowWidth > _this.windowHeight) {
                    _this.device.orientation = _this.ORIENTATION.landscape;
                } else {
                    _this.device.orientation = _this.ORIENTATION.portrait;
                }

                _this.device.touch = _hasTouch();

                _this.device.mobile = _this.device.touch && _this.browser.mobile && _this.windowWidth < 680;
                _this.device.tablet = _this.device.touch && _this.browser.mobile && (_this.windowWidth >= 680 || /(nexus 7|tablet|ipad|kindle)/g.test(_UA));

                if(_this.device.tablet) {
                    _this.device.mobile = false;
                }

                _this.device.desktop = !_this.device.mobile && !_this.device.tablet;

                if(_this.device.mobile) {
                    _this.device.type = _this.DEVICES.phone;
                } else if(_this.device.tablet) {
                    _this.device.type = _this.DEVICES.tablet;
                } else {
                    _this.device.type = _this.DEVICES.desktop;
                }

                _this.device.ios = _isOSiOS();
            }



////////
////////// OS DETECTION
////////

            function _isOSWin() {
                return /(windows|windows nt)/g.test(_UA);
            }

            function _isOSMac() {
                return /(macintosh|intel mac|os x)/g.test(_UA);
            }

            function _isOSiOS() {
                return /(ipad|iphone|ipod)/g.test(_UA);
            }

            function _isOSAndroid() {
                return _UA.indexOf('android') > -1;
            }

            function _detectOS() {
                var type = _this.NOT_AVAILABLE;
                
                if(_isOSWin()) {
                    type = 'Windows';
                } else if(_isOSiOS()) {
                    type = 'Apple iOS';
                } else if(_isOSAndroid()) {
                    type = 'Android';
                } else if(_isOSMac()) {
                    type = 'Mac OS X';
                }

                _this.os.type = type;
            }


////////
////////// BROWSER DETECTION
////////

            function _isBrowserIE() {
                return  /(windows nt|msie)/g.test(_UA);
            }
            
            function _isBrowserFirefox() {
                return _UA.indexOf('firefox') > -1;
            }
            
            function _isBrowserOpera() {
                return /(opera|opr)/g.test(_UA);
            }
            
            function _isBrowserSafari() {
                return _UA.indexOf('safari') > -1 && !_isBrowserOpera() && !_isBrowserChrome() && !_isOSAndroid();
            }
            
            function _isBrowserChrome() {
                return (_UA.indexOf('chrome') > -1 || _UA.indexOf('crios') > -1) && !_isBrowserOpera();
            }

            function _isBrowserSilk() {
                return  /(silk)/g.test(_UA);
            }

            function _getBrowserVersion(browserKey, type) {
                var keys = browserKey.split('|');
                var chunk;
                var arr = _UA.split(' ');

                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if(key === 'msie') {
                        var re  = new RegExp('msie ([0-9]{1,}[\.0-9]{0,})');
                        if (re.exec(_UA) !== null) {
                            if(type !== 'short') {
                                chunk = RegExp.$1;
                            } else {
                                chunk = parseFloat(RegExp.$1);
                            }
                        }

                        // Checking for 11+ version of IE
                        if (typeof chunk === 'undefined') {
                            if (!window.ActiveXObject && 'ActiveXObject' in window) {
                                chunk = _UA.substring(_UA.indexOf('rv:') + 3, _UA.indexOf(')'));
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
                if(typeof chunk === 'undefined') {
                    return _this.NOT_AVAILABLE;
                }
                
                return chunk;
            }

            function _detectBrowser() {
                var type = _this.NOT_AVAILABLE;
                var version = _this.NOT_AVAILABLE;
                var fullVersion = _this.NOT_AVAILABLE;

                if (_isBrowserOpera()) {
                    type = _this.BROWSERS.opera;
                    version = _getBrowserVersion('opr|opera', 'short');
                    fullVersion = _getBrowserVersion('opr|opera');
                    _this.browser.opera = true;
                } else if(_isBrowserFirefox()) {
                    type = _this.BROWSERS.firefox;
                    version = _getBrowserVersion('firefox', 'short');
                    fullVersion = _getBrowserVersion('firefox');
                    _this.browser.firefox = true;
                } else if(_isBrowserChrome()) {
                    type = _this.BROWSERS.chrome;
                    version = _getBrowserVersion('chrome|crio', 'short');
                    fullVersion = _getBrowserVersion('chrome|crio');
                    _this.browser.chrome = true;
                } else if(_isBrowserSilk()) {
                    type = _this.BROWSERS.silk;
                    version = _getBrowserVersion('silk', 'short');
                    fullVersion = _getBrowserVersion('silk');
                    _this.browser.silk = true;
                } else if(_isBrowserSafari()) {
                    type = _this.BROWSERS.safari;
                    version = _getBrowserVersion('version', 'short');
                    fullVersion = _getBrowserVersion('version');
                    _this.browser.safari = true;
                } else if (_isBrowserIE()) {
                    type = _this.BROWSERS.ie;
                    version = _getBrowserVersion('msie', 'short');
                    fullVersion = _getBrowserVersion('msie');
                    _this.browser.ie = true;
                } else {
                    type = _this.BROWSERS.other;
                    _this.browser.other = true;
                }

                _this.browser.type = type;
                _this.browser.version = version;
                _this.browser.fullVersion = fullVersion;
                _this.browser.string = type + ' ' + fullVersion;

                _this.browser.mobile = /(blackberry|kindle|silk|mobile|tablet|mini|android|ios|ipod|iphone|ipad)/g.test(_UA);
            }



////////
////////// CAPABILITY DETECTION
////////

            function _hasTouch() {
                return  !!('ontouchstart' in window) ||
                        (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
            }

            function _hasRAF() {
                var result =    window.requestAnimationFrame       ||
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame;
                return !!result;
            }

            function _hasCSSTransform() {
                return !!(('getComputedStyle' in window) && 
                            (window.getComputedStyle(document.body).getPropertyValue('-webkit-transform') ||
                            window.getComputedStyle(document.body).getPropertyValue('-o-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('-moz-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('-ms-transform') || 
                            window.getComputedStyle(document.body).getPropertyValue('transform')
                        ));
            }

            

            function _hasMediaQueries() {
                return !!window.matchMedia;
            }

            function _hasGetUserMedia() {
                var result =    window.navigator.getUserMedia ||
                                window.navigator.webkitGetUserMedia ||
                                window.navigator.mozGetUserMedia ||
                                window.navigator.msGetUserMedia;
                return !!result;
            }

            function _createEl(el) {
                return document.createElement(el);
            }

            function _detectCanvas() {
                var canvasEl = _createEl('canvas');
                _this.has.webGL = !!canvasEl.getContext && !!canvasEl.getContext('webgl');

                canvasEl = _createEl('canvas');
                _this.has.canvas =  !!canvasEl.getContext && typeof canvasEl.getContext('2d').fillText === 'function';
            }

            function _detectVideo() {
                var videoEl = _createEl('video');
                _this.has.video = !!videoEl && typeof videoEl.canPlayType !== 'undefined';

                if(_this.has.video) {
                    _this.has.videoFormats.mp4 = videoEl.canPlayType('video/mp4') !== "" ? true : false;
                    _this.has.videoFormats.webm = videoEl.canPlayType('video/webm') !== "" ? true : false;
                    _this.has.videoFormats.ogg = videoEl.canPlayType('video/ogg') !== "" ? true : false;
                }
            }

            function _hasWebAudio() {
                // We cache the result after the first check, as creating too many AudioContext
                // objects throws an error in some browsers
                var result;
                if(typeof _this.cachedWebAudioResult === 'undefined') {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                    if (typeof window.AudioContext !== 'undefined') {
                        var context = new AudioContext();
                        result = !!context && typeof context.createGain === 'function';
                    } else {
                        result = false;
                    }
                    _this.cachedWebAudioResult = result;
                } else {
                    result = _this.cachedWebAudioResult;
                }
                return result;
            }


            function _detectAudio() {
                var audioEl = _createEl('audio');
                _this.has.audio = !!audioEl && typeof audioEl.canPlayType !== 'undefined';
                _this.has.audioApi = !!('Audio' in window);

                if(_this.has.audio) {
                    _this.has.audioFormats.mp3 = !!(audioEl.canPlayType && audioEl.canPlayType('audio/mpeg;').replace(/no/, ''));
                    _this.has.audioFormats.ogg = !!(audioEl.canPlayType && audioEl.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
                    _this.has.audioFormats.wav = !!(audioEl.canPlayType && audioEl.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
                    _this.has.audioFormats.mp4 = !!(audioEl.canPlayType && audioEl.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''));
                }

                _this.has.webAudio = _hasWebAudio();
            }

            function _detectCapabilities() {
                _this.has.requestAnimationFrame = _hasRAF();
                _this.has.cssTransform = _hasCSSTransform();
                _this.has.mediaQueries = _hasMediaQueries();
                _this.has.getUserMedia = _hasGetUserMedia();
                
                _detectCanvas();
                _detectAudio();
                _detectVideo();
            }

            function _initResize() {
                window.addEventListener('resize', _onResize);
                window.addEventListener('orientationchange', _onResize);
                window.dispatchEvent(new Event('resize'));
            }

            function _onResize(event) {
                _detectDevice();    
            }

            (function() {
                _detectOS();
                _detectCapabilities();
                _detectBrowser();

                _initResize();
            })(this);
        }
    };

    _brewser._init();
    global.BREWSER = _brewser;
}(this));