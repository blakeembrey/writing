---
title: My Sublime Text Preferences Explained
date: 2013-08-11 22:20
author: Blake Embrey
template: article.jade
---

Prompted by the many preference file posts recently, I have finally gotten around to posting my config with a few inline comments.

```javascript
{
  // Makes folders stand out from files
  "bold_folder_labels": true,
  // Clean colour scheme, comes with Flatland theme
  "color_scheme": "Packages/Theme - Flatland/Flatland Monokai.tmTheme",
  // Switch to `all` to always show invisibles
  "draw_white_space": "selection",
  // Always adds a trailing newline character
  "ensure_newline_at_eof_on_save": true,
  // Exludes directories from showing up in the sidebar and search
  "folder_exclude_patterns": [
    ".svn",
    ".git",
    ".hg",
    "CVS",
    "node_modules",
    "bower_components"
  ],
  // Source Code Pro is my favourite monospace font - download at https://github.com/adobe/source-code-pro
  "font_face": "Source Code Pro",
  // Current working font size
  "font_size": 15.0,
  // Highlight the current line - makes it easier to focus and find where you are typing
  "highlight_line": true,
  // Make it obvious when I haven't saved something
  "highlight_modified_tabs": true,
  // Ignore VIM mode, it plays havoc with some of my other preferred shortcuts
  "ignored_packages": [
    "Vintage"
  ],
  // Draw all indent guides, but also draw the carets indent guide in a different color
  "indent_guide_options": [
    "draw_active",
    "draw_normal"
  ],
  // Removes the extra whitespace using `Source Sans Pro` comes with
  "line_padding_bottom": -1,
  "line_padding_top": -1,
  // Render a vertical ruler at the 80 character mark, tries to keep me considerate
  "rulers": [
    80
  ],
  // Saving everytime I lose focus causes all sorts of conflicts
  "save_on_focus_lost": false,
  // Always allow me to scroll beyond the last line
  "scroll_past_end": true,
  // Enable `shift + tab` to cause unindent
  "shift_tab_unindent": true,
  // Override tab size to equal 2 spaces
  "tab_size": 2,
  // Beautiful and minimal theme - download at https://github.com/thinkpixellab/flatland
  "theme": "Flatland Dark.sublime-theme",
  // Use spaces for indentation
  "translate_tabs_to_spaces": true,
  // Removes all the trailing white space on save
  "trim_trailing_white_space_on_save": true,
  // Wraps lines instead of enabling horizontal scroll
  "word_wrap": true
}
```
