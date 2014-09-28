---
title: Change Desktop Background with Shell and GeekTool
date: 2011-10-30 12:00
author: Blake Embrey
template: article.jade
---

Make an AppleScript and run it using the "Shell" geeklet provided in GeekTool. First, we’ll make the 'AppleScript'. So, open the AppleScript Editor app to get started. Copy and paste this code:

```
tell application "Finder"
  set desktop picture to POSIX file "file://localhost/  yourimage.png"
end tell
```

Then, replace `file://localhost/yourimage.png` with the location to your image. It must be an absolute path to the image, so you might want to make a folder just for your GeekTool scripts somewhere. For example, I want to use the Tron background image, so I used `file://localhost/Users/blakeembrey/Dropbox/Application Settings/GeekTool/TronLegacy.png`. I am currently storing my GeekTool scripts in an 'Applications' folder inside my documents, as you can see. Once I finished that, I saved the script as `setTronBackground` in the same folder.

Now in Geektool, drag the shell geeklet to the desktop from GeekTool. It doesn’t matter where it goes since it isn’t going to be seen anyway. Set the 'group' you would like it to be a part of, then set the 'Refresh Every' to 0. For the shell code, we are going to use something like

```
osascript ~/Documents/Applications/GeekTool/setTronBackground.scpt
```

Notice we can use the relative location here, and that we need .scpt for the file extension. Finally, save and close GeekTool. Now every time you change the theme you will also change the background image.