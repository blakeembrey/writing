---
title: FaceTime Auto Answer
date: 2015-06-20 02:00
author: Blake Embrey
template: article.jade
---

Some pretext...

I talk with my girlfriend every day. Sometimes multiple times a day. Unfortunately, we're in a long distance relationship and, at times, completely different time zones. One habit we wanted to pick up was being able to see each other at any time.

For this to work, we need to be able to auto answer each others calls. One of us could be asleep or busy working, but we still want to be able to see each other. After days of exploring how to make this happen, I come up with some solutions.

1. Create new Skype accounts just for each other and enable auto answer on those accounts.
2. Keep a Google Hangouts room alive that we can both join at any time.
3. Create our own video chat platform using WebRTC that will fulfil our needs.

Being the nerd I am, the third option sounded the most fun! From all my research, however, I was amazed no one had implemented a feature so simple into their product. Each of these options have their own drawbacks.

1. I need to sign in and out between accounts (an issue for us since we work and live on our computers).
2. Google Hangouts prompts after inactivity and kicks the user from the chat.
3. Time.

Eventually, I stumbled upon the magic bullet - FaceTime has an option built in to auto answer (`defaults write com.apple.FaceTime AutoAcceptInvitesFrom -array-add hello@blakeembrey.com`). It "works", but it comes with even more issues. For example, when you receive a call there is a black overlay over the video call which makes visibility difficult. On a second test, we also discovered that it'll ring infinitely. Well, so much for that.

At this point, we gave up and Keyue needed to sleep. I decided to continue research the following day when she was at work (my night time) and discovered some people had written an AppleScript for this years ago. I stayed up until 4am trying to create a new AppleScript, hacking away in a forgiving syntax I had no idea how to use without the constant use of Google.

## Implementation

Let's start by opening the "Script Editor" application. Copy and paste the following code into the editor, changing the caller id check to your desired caller. This the caller that is shown next to the profile image and accept button during ringing. For me, Keyue Bao is a contact so I can use her name. If they aren't a contact, you'll need to type the specific email or phone number here.

```applescript
repeat
  repeat while application "FaceTime" is running
    tell application "System Events"
      tell process "FaceTime"
        set acceptButton to a reference to (button "Accept" of window 1)

        if acceptButton exists then
          set callerId to value of static text 2 of window 1

          if callerId = "Keyue Bao" then
            click acceptButton
          end if
        end if
      end tell
    end tell
    delay 2
  end repeat
  delay 5
end repeat
```

The script runs on an infinite loop. There is a delay of 5 seconds when the application is closed and 2 seconds when the application is open. It attempts to select the "answer" button on the screen and, if it exists, it checks the caller id and clicks answer. Pretty simple.

Next we want to export the script for execution. Navigate to `File -> Export` and save it somewhere you can remember it. For me, it was as `Documents/Scripts/facetime-auto-answer`. You need this path for the next step.

Let's create a Launchd script to handle execution on computer start up. Navigate to `~/Library/LaunchAgents` using Terminal (open Terminal and enter `cd ~/Library/LaunchAgents`). After that, that's add our file (below) as `com.blakeembrey.facetime-auto-answer.plist` (just `vi com.blakeembrey.facetime-auto-answer.plist` and hit `i` to switch to insert mode).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.blakeembrey.FaceTimeAutoAnswer</string>
  <key>Program</key>
  <string>/usr/bin/osascript</string>
  <key>ProgramArguments</key>
  <array>
    <string>osascript</string>
    <string>/Users/blakeembrey/Scripts/facetime-auto-answer.scpt</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
```

Make sure you adjust the argument above to the correct path from the export step. Once it's correct, exit back to the terminal (`Esc`, `:wq`, `Enter`) and make Launchd pick up the new script without rebooting.

```
launchctl load -w com.blakeembrey.facetime-auto-answer.plist
```

You'll need to accept the accessibility dialog (open system preferences and enable access). We can quickly check that the script is running by entering `launchctl list | grep facetime-auto-answer`. And we're done.

## Conclusion

FaceTime is really nice for video chatting. It disables automatically when you're in a different window (I regularly use up to 6 windows during a work day for different tasks) and the interface is very simple to use. The video quality is great and, when the call drops temporarily it will automatically join the call again (with the video still enabled - looking at you Skype). On top of that, it has a low CPU footprint, especially compared with Skype.

However, there's a couple of major issues with it. First off, it makes the rest of the computer quieter which makes it difficult to work or anything else while on the call. For example, we can't really watch a movie together either. The second is a feature request. I would love the "floating" window feature from Skype.

And we're done. I'm going to tweak the same script to auto answer Skype next. Hopefully this comes built in with future versions of video chat clients. It's such a basic feature that it's exclusion makes me ponder the disconnect between the teams creating the software and reality.
