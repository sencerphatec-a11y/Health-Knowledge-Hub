# Libraries for Playwright's Ubuntu 24.04 browser downloads on Replit/NixOS.
# Keep the older ABI versions required by WebKit, not just the latest packages.
let
  pkgs = import <nixpkgs-stable-25_05> {};
  older = import <nixpkgs-stable-23_11> {};
  libraries = with pkgs; [
    gtk3 gtk4 atk glib pango cairo gdk-pixbuf
    xorg.libX11 xorg.libxcb xorg.libXcomposite xorg.libXcursor
    xorg.libXdamage xorg.libXext xorg.libXfixes xorg.libXi
    xorg.libXrandr xorg.libXrender alsa-lib dbus
    gst_all_1.gstreamer.out gst_all_1.gst-plugins-base gst_all_1.gst-plugins-bad
    flite libwebp libepoxy libsecret libxslt libxml2 libjpeg8
    libpng libevent libgudev lcms2 libopus harfbuzz harfbuzzFull
    libtasn1 woff2 libbacktrace libsoup_3 libxkbcommon wayland
    icu74 older.libjxl libavif enchant hyphen libmanette
    mesa libgbm libdrm sqlite libglvnd graphene x264 vulkan-loader stdenv.cc.cc.lib
  ];
in pkgs.runCommand "medication-browser-libraries" {} ''
  mkdir -p "$out/lib" "$out/share"
  for dependency in ${pkgs.lib.concatStringsSep " " (map (p: "${pkgs.lib.getLib p}") libraries)}; do
    for library in "$dependency"/lib/*.so*; do
      name="$(basename "$library")"
      if [ -e "$library" ] && [ ! -e "$out/lib/$name" ]; then
        ln -s "$library" "$out/lib/$name"
      fi
    done
  done
  ln -s ${pkgs.mesa}/share/glvnd "$out/share/glvnd"
''
