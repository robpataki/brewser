<a href="https://github.com/handcraftedLDN/brewser" target="_blank">
    <img width="120" src="https://raw.githubusercontent.com/handcraftedLDN/brewser/master/brewser-logo@2x.png" alt="brewser.js logo"/>
</a>

Brewser.js is a simple open source device and browser detection library. The main goal of this library is to provide developers with an API, which makes it easier to detect certain device types (mobile/tablet/desktop) in JavaScript applications, and to offer some help with browser capability detection.

The library also offers some shortcuts to often used device and browser parameters - such as screen size, window size, screen pixel density and device orientation.

For the full list of goddies brewser.js has to offer, please check out our demo: [http://handcraftedldn.github.io/brewser/](http://handcraftedldn.github.io/brewser/).

## Installation

### Bower

[![Bower version](https://badge.fury.io/bo/brewser.svg)](http://badge.fury.io/bo/brewser)

	$ bower install brewser
	
### NPM

[![npm version](https://badge.fury.io/js/brewser.svg)](http://badge.fury.io/js/brewser)

	$ npm install brewser

## Demos

### Live demo
[http://handcraftedldn.github.io/brewser/](http://handcraftedldn.github.io/brewser/)
or 
[bit.ly/br3ws3r](http://bit.ly/br3ws3r)

### Offline demo
See `demo` folder in the project's root folder.


## Contribution

The library of course is far from perfect, we are more than happy to take contributions and suggestions on board! Should you have a bugfix or a feature request, please make a pull request or rase an issue here on Github!

### Release updated version of brewser.js

Please note, that the version number in `version.json` overrides the version numbers both in `package.json` and `bower.json`. Make sure you bump up the version number in `version.json` before release!

Once you're happy with your changes, run

    $ gulp release

Then commit your changes, push them up and tag the new release:

    $ git tag -a v0.0.2 -m "Version 0.0.2 release"
    $ git push origin master --tags
    $ npm publish

You're done, let's see that pull request!

## Licence

GPL - 2015

<a href="http://handcrafteddigital.london" target="_blank">
    <img width="192" src="https://raw.githubusercontent.com/handcraftedLDN/brewser/master/handcrafted-digital-london-logo@2x.png" alt="Handcrafted Digital London - Fine, hand made design and development from London"/>
</a>

Copyright &copy; 2015 <a href="https://github.com/handcraftedLDN/brewser" target="_blank">brewser.js</a> has been <a href="http://handcrafteddigital.london" target="_blank">Handcrafted</a>