# Responsive Insights
Rules for making site layout well on mobile devices. 

- To truely see changes in code you must open the page in a new tab
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`:  
  Viewport: Total area of the screen, including the part that cannot be seen.
  The meta tag must be set to force the viewport width in px to match the device width. Example:
    - Desktop device has 1920px width, viewport width will be set to 1920 px.
    - On desktop, a character takes 20px (~1% of screen width)
    - Mobile device has 320px width - the viewport width will be set to 320 px.
    - Characters remain 20px, but are now 6.25% of screen width on a mobile device.
- The specified viewport width is the **minimum**. The width can be expanded (and ruin the site) in the following cases:
  - When text can't fit within its constraints:
    - Using `whitespace = "pre"` with text that is too long? - not sure about this
    - Having too much text without space without specifying line breaks
  - When having hardcoded widths (use maxWidth where possible)
  - `display:flex` seems to be causing issues:
    - 