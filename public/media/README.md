# /picture-this background media

Two files, swapped by replacing them with the same names:

- `picture-this-bg.mp4` — the looping background. 10 to 20 seconds, under
  about 5 MB, no audio needed (it plays muted). 1280x720 is plenty, since it
  sits behind a dark overlay.
- `picture-this-poster.jpg` — a still shown while the video loads, and on
  phones in low-power mode, which refuse to autoplay at all.

Current files came from a 1080p promo cut: re-encoded to 720p with the audio
track dropped, 13.6 MB down to 3.9 MB. The poster is the frame at 4 seconds,
the first clean wide shot; the opening frame is a motion blur and makes a
poor still.

To redo the poster from a different moment, change the `-ss` seconds:

    ffmpeg -ss 4 -i picture-this-bg.mp4 -frames:v 1 -q:v 4 picture-this-poster.jpg
