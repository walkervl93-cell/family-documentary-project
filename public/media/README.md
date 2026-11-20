# /picture-this background media

Two files, swapped by replacing them with the same names:

- `picture-this-bg.mp4` — the looping background. 10 to 20 seconds, under
  about 5 MB, no audio needed (it plays muted). 1280x720 is plenty, since it
  sits behind a dark overlay.
- `picture-this-poster.jpg` — the first frame, shown while the video loads
  and on phones in low-power mode, which refuse to autoplay at all.

Make the poster from the video so they match:

    ffmpeg -i picture-this-bg.mp4 -frames:v 1 -q:v 4 picture-this-poster.jpg
