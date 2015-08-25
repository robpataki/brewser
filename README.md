# brewser.js

Brewser.js is a simple open source device and browser detection library.

## Installation

### Bower

	$ bower install brewser
	
### NPM

	$ npm install brewser

## Demos

### Live demo
[http://handcraftedldn.github.io/brewser/](http://handcraftedldn.github.io/brewser/)

### Offline demo
See `demo` folder in the project's root folder.


## Release updated version of brewser.js

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
    <img width="218" height="90" src="https://raw.githubusercontent.com/handcraftedLDN/brewser/master/handcrafted-digital-london-logo@2x.png" alt="Handcrafted Digital London - Fine, hand made design and development from London"/>
</a>

Copyright &copy; 2015 <a href="https://github.com/handcraftedLDN/brewser" target="_blank">brewser.js</a> has been <a href="http://handcrafteddigital.london" target="_blank">Handcrafted</a>