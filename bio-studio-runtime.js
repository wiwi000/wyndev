(() => {
  const configPath = "./bio.config.json";
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", """: "&quot;" })[character]);
  const apply = (config) => {
    const root = document.documentElement;
    const $ = (selector) => document.querySelector(selector);
    if (config.appearance) {
      root.style.setProperty("--ios-bg", config.appearance.background || "#000000");
      root.style.setProperty("--ios-blue", config.appearance.accent || "#007AFF");
      root.style.setProperty("--glass-radius", (config.appearance.cardRadius || 24) + "px");
    }
    if (config.profile) {
      const avatar = $(".avatar-img");
      const background = $(".bg-image");
      const name = $(".name-section h1");
      const headline = $(".name-section .title");
      if (avatar && config.profile.avatarUri) avatar.src = config.profile.avatarUri;
      if (background && config.profile.backgroundUri) background.style.backgroundImage = "url(" + config.profile.backgroundUri + ")";
      if (name && name.firstChild) name.firstChild.nodeValue = (config.profile.displayName || "") + " ";
      if (headline) headline.textContent = config.profile.headline || "";
    }
    const main = $(".main-wrapper");
    const oldLinks = $(".bio-studio-links");
    if (oldLinks) oldLinks.remove();
    const links = (config.links || []).filter((link) => link.enabled && link.url);
    if (main && links.length) {
      const section = document.createElement("section");
      section.className = "ios-card bio-studio-links";
      section.innerHTML = "<div class="section-header"><span>LINKS</span></div>" + links.map((link) => "<a class="bio-studio-link" href="" + escapeHtml(link.url) + "" target="_blank" rel="noopener">" + escapeHtml(link.label) + "<span>↗</span></a>").join("");
      section.style.setProperty("--glass-radius", (config.appearance?.cardRadius || 24) + "px");
      const style = document.createElement("style");
      style.textContent = ".bio-studio-link{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:#fff;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.16);padding:14px 16px;border-radius:14px;margin-top:10px;font-weight:600}.bio-studio-link span{color:var(--ios-blue,#007AFF);font-size:18px}";
      section.appendChild(style);
      main.appendChild(section);
    }
    const music = config.music;
    if (music?.enabled && music.audioUri) {
      let audio = document.getElementById("bio-studio-audio");
      if (!audio) { audio = document.createElement("audio"); audio.id = "bio-studio-audio"; document.body.appendChild(audio); }
      audio.src = music.audioUri;
      audio.loop = Boolean(music.loop);
      const title = $(".music-title"); const artist = $(".music-artist"); const button = $("#music-btn");
      if (title) title.textContent = music.title || "Music";
      if (artist) artist.textContent = music.artist || "";
      if (button) button.onclick = () => audio.paused ? audio.play() : audio.pause();
      if (music.autoplay) audio.play().catch(() => {});
    }
  };
  fetch(configPath, { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((config) => config && apply(config)).catch(() => {});
})();