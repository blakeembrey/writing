---
title: FaceTime Auto Answer
date: 2015-06-20 02:00
author: Blake Embrey
template: article.jade
---

Some pretext...

I talk with my girlfriend every day. Sometimes multiple times a day. Unfortunately, we're in a long distance relationship and, at times, completely different time zones worlds apart. One habit we wanted to pick up was being able to see each other at any time.

So, for this to work, we need to be able to auto answer each others calls. One of us could be asleep or busy doing other things, but we still want to be able to see each other. After days of exploring how to make this possible, it came down to a few different solutions.

1. Create new Skype accounts just for each other and enable auto answer on those accounts.
2. Keep a Google Hangouts room alive that we can both join at any time.
3. Create our own video chat platform using WebRTC that will fulfil our needs.

Being the nerd I am, the third option sounded the most fun! From all my research, however, I was amazed no one had implemented a feature so simple into their product. Each of these options have their own drawbacks.

1. Need to sign in and out between accounts (an issue for us since we work and live on our computers).
2. Google Hangouts prompts after inactivity and kicks the user from the chat.
3. Time.

Eventually, I stumbed upon what should have been the magic bullet - FaceTime has an option built in to auto answer (`defaults write com.apple.FaceTime AutoAcceptInvitesFrom -array-add hello@blakeembrey.com`). It "works", but it comes with a lot more issues. For example, when you receive the call there is a black overlay on the video call which makes visibility hard. On a second test, we also discovered an infinite ringing bug. So much for that.

At this point, we gave up and Keyue needed to sleep. I decided to research the following day when she was at work (my night time) and discovered some people had written an AppleScript for this years ago. I stayed up until 4am that night trying to create a new AppleScript, hacking away in a forgiving syntax I had no idea how to use without the consistent Google queries.

## Implementation

Let's start by opening the "Script Editor" application. Copy and paste the following code into the editor, changing the caller id check to your desired caller. This the caller that is shown next to a profile image and the accept button during ringing. For me, I've added Keyue as a contact. If they aren't a contact for you, you'll need to type the email or phone number here.

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

The script just runs an infinite loop. There is a delay of 5 seconds when the application is closed and 2 seconds when the application is open. It attempts to select the "answer" button on the screen and, if it exists, it checks the caller id and clicks answer. Pretty simple.

Next we want to export the script for execution. Navigate to `File -> Export` and save it somewhere you can remember it. For me, it was called `Documents/Scripts/facetime-auto-answer`. You need this path for the next step.

Let's create a Launchd script to handle execution on computer startup. Navigate to `~/Library/LaunchAgents` using Terminal (open Terminal and enter `cd ~/Library/LaunchAgents`). After that, that's add our file (below) as `com.blakeembrey.facetime-auto-answer.plist` (just `vi com.blakeembrey.facetime-auto-answer.plist` and hit `i` to switch to insert mode).

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

Make sure you adjust the argument above to your correct path from the export step. Once that's correct, exit back to the terminal (`Esc`, `:wq`, `Enter`) and get Launchd to pick up the new script without a reboot.

```
launchctl load -w com.blakeembrey.facetime-auto-answer.plist
```

You'll need to accept the accessibility dialog (open system preferences and enable access). We can quickly check that the script is running by entering `launchctl list | grep facetime-auto-answer`. And we're done.

## Conclusion

FaceTime is kind of nice for always on video chatting. It disables automatically when you're in a different window (I regularly use up to 6 windows during a work day for different tasks) and the interface is very simple for us to use. The video quality is great and, unlike Skype, when the call drops temporarily it will automatically join the call again correctly (the video stays enabled).

However, there's a couple of major issues with it. First, it makes the rest of the computer softer which makes it difficult to work or do anything else while on the call. For example, we can't really watch a movie together either. The second is a feature request. I love the "floating" window feature from Skype.

And we're done. I'm going to tweak the same script to auto answer Skype next. I'm still amazed this isn't baked into any video chat clients. Video chat could really use some love and thought. It's hard to believe that over days of searching I couldn't find anything decent to support something so trivial. I imagine the developers behind these tools don't use it as actively as some of their own userbases which could be the sign of disconnect between reality.

P.S. Does anyone actually want their entire system to remain 10x quiter during a call? It's pretty easy to just pause my music to talk.
