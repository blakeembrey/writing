---
title: Jailbreak Wii (Softmod) 3.0 – 4.2
date: 2011-04-12 12:00
author: Blake Embrey
template: article.jade
---

![Homebrew Channel](http://d.pr/i/SvZy+)

__IMPORTANT: This information is for research and academic purposes only! This info is not to be abused! I am not responsible for any damage that you may create!__

Although I did successfully complete this guide on my own Wii console, it does not mean that this same process will successfully jailbreak your Wii console. Make sure you read and complete all steps appropriately.

__Prerequisites__


* Check your Wii version. This can be done by going to `Wii Settings -> Top Right Corner -> Your Wii's Firmware & Region`
* Jailbreak file [3.0-4.1] – [Mediafire](http://www.mediafire.com/?rv3w0le0nrf7mm1) (Password is `wiihacks`)
* Jailbreak file [4.2] – [Mediafire](http://www.mediafire.com/?9ulaa2elqvu7z4z) (Password is `wiihacks`)
* SD card with 1GB or more.

__Preparation__

1. Format your SD card to FAT32 or FAT16
2. Make Sure WiiConnect 24 is OFF
3. Unzip the previously downloaded jailbreak pack and place the files/folders onto the root of your SD card.
4. Always launch md5summer.exe to verify that the files have been downloaded properly and they are not corrupted.

__Step 1 – Installing Homebrew Channel and Bootmii__

__[3.0-4.1]__ Go to Wii Options, then go to `Data Management -> Channels -> SD Card`, click on `Bannerbomb channel`, you will get a message saying "Load boot.elf/dol?", select 'Yes' and the Hackmii installer will run.

__[4.2]__ Click the SD Card Icon on the Wii Menu – "Load boot.elf/dol?", select 'Yes' and the Hackmii installer will run.

In the Hackmii Installer, make sure to install the Homebrew Channel. If you can, also install Bootmii as boot2. When installing bootmii select prepare SD card, then install. "Bootmii as IOS" is installed automatically.

(If you receive an error stating “No vulnerable IOS”, [complete these steps](http://www.wiihacks.com/recommended-faqs-guides-tutorials-only/29080-hackmii-fix-no-vulnerable-ios-black-screen-scam-freeze.html).

__Step 2 – Backup Your Wii's NAND (required)__

It is highly recommended to make a NAND Backup with bootmii as it can save you from 99% of bricks. That is, if you can install bootmii as boot2. You'll need a SD Card with at least 550 MB free on it. Also, note bootmii can be picky about SD Cards so its best to avoid generic ones. The 2GB Sandisk SD Card is recommended.

__a)__ Place the SD Card into your wii and power it on. If bootmii was installed as boot2, the bootmii screen should automatically appear, if it was installed as an IOS, then you'll have to go to homebrew channel, press "home" on your wiimote then select "Launch Bootmii"

__b)__ Navigate using the power/reset buttons on the front of your console and select the icon with the gears on it. If the console buttons don't work, you'll have to use a gamecube controller.

Power = Browse
Reset = Select

__c)__ Now select the icon that has the Green arrow pointing to a SD Card but from the chip. Then follow the on-screen instructions to backup your NAND.

__d)__ In 10 – 15 minutes, the NAND Backup should be complete. You may get a few bad blocks but any number of bad blocks under 80 is normal and fine. Once all is done, you can exit bootmii.

__e)__ Remove the SD Card from your wii and insert into your PC, backup the 'bootmii' folder, the 'NAND.bin' file and 'key.bin' file from your sd card onto a safe place on your PC. Once these files/folders are on your PC, delete them from your SD Card. If you do not and bootmii as boot2 is installed, it will load everytime!

__DO NOT LOSE YOUR NAND.BIN OR KEYS.BIN__

If you were to ever fully brick the wii, just copy the bootmii folder and 'NAND.bin' from your PC onto the root of your SD Card. Then repeat parts `a`, `b` & `c` but this time selecting the icon that points to the chip. While `bootmii`/`boot2` can save you from full bricks, `bootmii`/`IOS` cannot! It is not recommended to use `bootmii` as an `IOS` to restore your NAND! If you can only install as an `IOS`, your nand backup is still useful, keep it safe.

__Step 3 – Modding your Wii (the jailbreak)__

__[3.0-4.1 Only]__

__a)__ Put the SD card into the Wii

__b)__ Open The Homebrew channel and select Multi-Mod Manager. Go to `Install & Patch iOS36 -> Express Install` - When completed press `B` to go back into main menu go to the bottom choice `Load Another IOS` and select `IOS236` (this should already be selected).

In Multi-Mod Manager go into `Wad Manager`, it should display these wads.

(These are to softmod your Wii)

  iOS60-[6174]-Patched.wad
  cIOS249[56]-rev20.wad
  cIOS250[57]-rev65535.wad
  cIOS223[37+38]-rev4.wad
  cIOS222[38]-rev4.wad

(These are to install the extra IOS files)

  iOS53-64-v5663.wad
  iOS55-64-v5663.wad
  iOS56-64-v5662.wad
  iOS57-64-v5919.wad
  iOS58-64-v6176.wad

__c)__ Press 1 on Wiimote to install all these wads at once, Press A to confirm. If you get an error do not exit until they all install correctly. Retry installing

After it installs correctly press the HOME button on Wiimote until you're back in main Multi-Mod Manager Menu.

__[4.2 Only]__

__a)__ SD card in the Wii
__b)__ Open The Homebrew channel and select Multi-Mod Manager. Go to `Install & Patch iOS36 -> Express Install` - Once completed press B to go back into main menu go to the bottom choice `Load Another IOS` and select `IOS236` (this should already be selected).

In Multi-Mod Manager go into Wad Manager, it should display these wads.

(These are to softmod your wii)

  iOS70-[6687]-Patched.wad
  cIOS249[56]-rev20.wad
  cIOS250[57]-rev65535.wad
  cIOS222[38]-rev4.wad
  cIOS223[37+38]-rev4.wad

(These are the IOS your Wii needs)

  iOS56-64-v5662.wad
  iOS57-64-v5919.wad
  iOS58-64-v6176.wad

__c)__ Press 1 on wiimote to install all these wads at once, Press A to confirm. If you get an error do not exit until they install correctly. Retry installing.

After they have all installed correctly press the B button on Wiimote until you're back in main Multi-Mod Manager Menu.

__Step 4 – Installing Priiloader__

`HBC -> Load up MMM`. Make sure where it says Load another ios [IOS236 is Selected]

__a)__ `Multi-Mod Manager -> App Manager -> Select Priiloader`

__b)__ It Should Load up Press + to Install

__c)__ Your Wii should reboot into Homebrew Channel after the installation. Press the HOME button and power off your Wii. Hold reset on the console while turning it on to boot into Priiloader. Go to System Menu Hacks and enable 'Block Disc Updates' & 'Block Online Updates', select 'Save Settings' when finished. Press B on the Wiimote to go back to the main menu, next go to Settings and use the d-pad to set Autoboot: System Menu. Then select Save Settings. Press B to go back to the main menu.

__d)__ In the main menu in priiloader, select Launch Title and select the HomeBrew Channel to check if its working properly.

__Step 5 – Getting HBC to use iOS58 for USB2 Support__

From the Homebrew channel load up the hackmii installer and reinstall the Homebrew channel. This will make it use ios58 for USB2 Support.To check your HBC is using iOS58 press the home button when in HBC and it should tell you in top right corner.

__Step 6 – Install more apps__

This is what the whole jailbreak process was for, installing custom apps. Here is a list of some awesome apps, starting at my favourite.

* [WiiMC](http://www.wiimc.org/downloads/) – Wii Media Center
* [Homebrew Browser](http://www.wiihacks.com/other-faq-guides-tutorials/68251-guide-homebrew-browser.html) - Wii Homebrew App Store
* Update the [Wii Shopping Channel](http://www.wiihacks.com/general-homebrew-hack-issues/67034-update-shopping-channel-v20-guide.html) to v20
* [Play Gamecube games](http://www.wiihacks.com/recommended-faqs-guides-tutorials-only/47802-play-gamecube-backups-your-wii.html) on your Wii
* [Emulators](http://www.wiihacks.com/emulators-downloads/)
* [Wii FTP](http://www.wiihacks.com/other-faq-guides-tutorials/66235-ftpii-guide.html)

__And you are done!__

Special thanks to author, *Cile*, for the original guide over at [WiiHacks](http://www.wiihacks.com/recommended-faqs-guides-tutorials-only/69690-softmod-3-0-4-2-e-u-j-wiis.html).