Place images used by the site in this folder.

Expected files referenced by CSS/HTML:

- home-profile.jpg — homepage profile image (preferred). If missing, the site falls back to root-level `profile.jpg`.
- dragon-blue.jpg — optional homepage hero banner background (not currently used)

Homepage profile usage in `index.html`:

```
<picture>
	<source srcset="assets/images/home-profile.jpg" type="image/jpeg">
	<img src="profile.jpg" alt="Praveen Reddy - Profile" class="profile-pic floating" />
</picture>
```

Optimization tips:
- Prefer JPEG/WebP.
- Keep size < 300KB for mobile performance.
- Square aspect (1:1) recommended; 512x512 or 640x640 works well.

Tip: keep the same filenames to avoid changing code. For the homepage profile, simply drop your image here as `home-profile.jpg`.