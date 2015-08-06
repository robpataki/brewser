# brewser.js
Device and browser capability detection library

## Release bower package

Please note, that the version number in 'version.json' overrides the version numbers both in 'package.json' and 'bower.json'. Make sure you bump up the version number in 'version.json' before release!

Once you're happy with your changes, run

    $ gulp release

Then commit your changes, push them up and tag the new release:

    $ git tag -a v0.0.2 -m "Release version 0.0.2"
    $ git push origin master --tags

You're done!