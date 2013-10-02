# Removing TotalTerminal from OSX application switcher

I work out of [TotalTerminal](http://totalterminal.binaryage.com/) on OSX. For
those who don't know TotalTerminal it is just an extension to the Terminal
application which has a global hotkey that toggles show and hide. Since it has
this global hot key you really don't need to `Command + Tab` to it and I've
found it really annoying when you try to switch back to your previous window
and it selects TotalTerminal instead.

Removing it from your application switcher is easy:

```
sudo vim /Applications/Utilities/Terminal.app/Contents/Info.plist
```

Inside the `<dict>` tag insert:

```
<key>LSUIElement</key>
<string>1</string>
```

Close all instances of `Terminal` and `TotalTerminal` and when you reopen them
the problem should be fixed.

This also applies for any other OSX applications you'd want to do this for. You
just have to find the folder that contains your `.app` folder. A few folders
that have many `.app` folders were:

```
/Applications
/Applications/Utilities
/System/Library/Services
```
