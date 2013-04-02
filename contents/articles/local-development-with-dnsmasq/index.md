---
title: Simplify Local Development with Dnsmasq
date: 2012-04-24 07:28
author: Blake Embrey
template: article.jade
---

Ever wanted to be able to set up your local domains instantly and never have to worry about your `/etc/hosts` again? Me too! A bit of looking around and I discovered a wealth of information about a small *DNS Forwarder* called DNSMASQ.

So, this is great. We have our solution - it's a tiny program barely taking 700KB of RAM, and it's a cinch to set up. By the end of this post, you will have a working TLD for use with your local development applications. No more playing with your `/etc/hosts` file every time you want to add a new domain.

In this tutorial, I will be focusing on Mac as it is the OS I use, however, the instructions should be fairly similar on linux. It has been tested in Mountain Lion and should work without a hiccup all the way down to Leopard (probably lower).

First of all, if you haven't installed it already, we will install __homebrew__ - the missing package manager for OS X. To install, just follow the instructions available on [the homepage](http://mxcl.github.com/homebrew/) or just copy and paste this snippet into terminal:

```
/usr/bin/ruby -e "$(/usr/bin/curl -fksSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"
```

Once brew is installed, we'll install dnsmasq using `brew install dnsmasq`

Next, let's activate dnsmasq. Homebrew should have output some hints on how to get started, but in case you missed it  should be something along these lines.

```
cp /usr/local/Cellar/dnsmasq/2.57/dnsmasq.conf.example /usr/local/etc/dnsmasq.conf
sudo cp /usr/local/Cellar/dnsmasq/2.57/homebrew.mxcl.dnsmasq.plist /Library/LaunchDaemons
sudo launchctl load -w /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist
```

Brilliant, now let's modify our configuration file at `/usr/local/etc/dnsmasq.conf`:

We'll add two rules. The first is the address, or TLD, we will listen to. In this case we will use `.dev`, but you can use anything (except `.local` - [not a good idea](http://www.justincarmony.com/blog/2011/07/27/mac-os-x-lion-etc-hosts-bugs-and-dns-resolution/))

```
address=/dev/127.0.0.1
listen-address=127.0.0.1
```

To start and stop dnsmasq, simply use

```
sudo launchctl stop homebrew.mxcl.dnsmasq && sudo launchctl start homebrew.mxcl.dnsmasq
```

However, I found it even easier to just kill the script in the Activity Monitor. For the final step, add `127.0.0.1` as a name server in `System Preferences -> Network -> Advanced -> DNS`. You can add it along with some other DNS records, just make sure it's at the top. For example, I use Google's Public DNS - `8.8.8.8` and `8.8.4.4`.

Now in whichever language you are writing in, you should be able to easily set up your virtual hosts for use on the `.dev` TLD. You should be even able to see your name server setup using `scutil --dns`.

References:

* [ServerFault Question](http://serverfault.com/a/164215)
* [Install DNSmasq locally on Mac OS X via Homebrew](http://blog.philippklaus.de/2012/02/install-dnsmasq-locally-on-mac-os-x-via-homebrew/)