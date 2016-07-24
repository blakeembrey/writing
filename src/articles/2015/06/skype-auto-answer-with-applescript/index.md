---
title: Skype Auto Answer with AppleScript
date: 2015-06-22 02:00
author: Blake Embrey
layout: article.pug
---

After discovering the ability to [auto answer FaceTime](/articles/2015/06/facetime-auto-answer-applescript/), I tried my hand at adapting the script for Skype. I waited a couple of days until my girlfriend had some downtime and patience to call me over and over while I tried to debug the elements on my screen. Eventually I figured out how to select the window, and then the correct button. I did try, unsuccessfully, for a long time to select the button based on the label. If anyone knows how to do this, please leave a comment!

Continuing on, set up is much the same with only the basic code changed. Let's start again by opening up "Script Editor" and copying this snippet into the editor:

```applescript
set contacts to {"Keyue Bao"}

repeat
  repeat while application "Skype" is running
    tell application "System Events"
      tell process "Skype"
        set videoCallWindow to a reference to (first window whose name is "Incoming Video Call")

        if videoCallWindow exists then
          set callerId to value of static text 1 of videoCallWindow

          if contacts contains callerId then
            click button 2 of videoCallWindow
          end if
        end if
      end tell
    end tell
    delay 2
  end repeat
  delay 5
end repeat
```

So, while Skype is running we try to select the incoming video call window. Of course, this window will only exist when we have a call to answer, so we check that it exists. After that, we grab the caller ID from the text element and check if it matches who we want. Then we click answer. It actually took me a few tried to figure out which index was the answer with video button as it doesn't follow visual order.

Before we export, change the caller ID. Then, go to `File -> Export` and save it somewhere you'll remember. I exported mine to `Documents/Scripts/skype-auto-answer`.

Next step, let's navigate to `cd ~/Library/LaunchAgents` in the Terminal and create our file using `vi com.blakeembrey.skype-auto-answer.plist`. In vim, you'll need to press `i` to go into "insert" mode. Copy and paste the code below, but remember to change the script location to where you just exported to.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.blakeembrey.skype-auto-answer</string>
  <key>Program</key>
  <string>/usr/bin/osascript</string>
  <key>ProgramArguments</key>
  <array>
    <string>osascript</string>
    <string>/Users/blakeembrey/Documents/Scripts/skype-auto-answer.scpt</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
```

And we're almost done. Let's exit vim (`Esc`, `:wq`, `Enter`) and get Launchd to pick up our changes.

```
launchctl load -w com.blakeembrey.skype-auto-answer.plist
```

Tada! You might need to accept the accessibility dialog that pops up, but the script will now be running. You can verify this by executing `launchctl list | grep skype-auto-answer`.

Done!

P.S. If you ever want to unload the script, just execute `launchctl unload -w com.blakeembrey.skype-auto-answer.plist`, same as you did to load.
