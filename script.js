// Data prestasi: [judul, tingkat, tahun]
const awards = [
  ["Juara 1 Duta Siswa Kabupaten Subang", "Kabupaten", 2024],
  ["Juara 1 Baca Puisi", "Nasional", 2024],
  ["Juara 3 Pencak Silat Tunggal Putri", "Kabupaten", 2024],
  ["Juara 3 O2SN Pencak Silat", "Kabupaten", 2025],
  ["Juara 1 Most Active Content, Volunteer Paras.id", "Nasional", 2025],
  ["Juara 3 Pidato, Politeknik Negeri Subang", "Provinsi", 2025],
  ["Peringkat 15 Duta Siswa Indonesia", "Nasional", 2025],
  ["Juara Harapan 2 Storytelling", "Kabupaten", 2025],
  ["Juara 3 Championship Pencak Silat", "Provinsi", 2026],
  ["Peringkat 7 Scout Intelligence Pramuka", "Provinsi", 2026],
  ["Juara 1 Lomba MC", "Kabupaten", 2026],
  ["Runner-up 1 Storytelling", "Kabupaten", 2026]
];

// Data kegiatan: [judul, tingkat, tahun]
const activities = [
  ["Lulusan Terbaik SMK Al-Mufti", "Sekolah", "2025/2026"],
  ["Student Ambassador", "Sekolah", "2025"],
  ["Divisi PDD OSIS", "Sekolah", "2024-2026"],
  ["Ketua Ekstrakurikuler Pencak Silat", "Sekolah", "2024-2026"],
  ["Bendahara English Conversation Club", "Sekolah", "2025-2026"],
  ["Host Podcast SMK Al-Mufti", "Sekolah", "2025-2026"],
  ["MC, Moderator, dan Host", "Kota sampai Nasional", "2024-2026"],
  ["Pembawa Baki Upacara 17 Agustus, Kec. Purwadadi", "Kecamatan", "2024"],
  ["Ketua Festival Kirab Budaya Paskec", "Provinsi", "2024"],
  ["Delegasi Jabar Womenspiration", "Nasional", "2025"],
  ["Delegasi Volunteer Paras Indonesia, Bali", "Nasional", "2025"],
  ["Danton Korps Kadet Republik Indonesia", "Nasional", "2025"],
  ["LO Acara Duta Siswa Jawa Barat", "Provinsi", "2025"],
  ["Ketua Program ESCOOP Jawa Barat", "Provinsi", "2025"],
  ["LO Pribadi Konser Bejo Band Perunggu", "Acara", "2025"],
  ["Ketua Divisi Pendidikan JBZ", "Kota", "2025-2026"],
  ["Divisi Pendidikan Volunteers JBZ", "Kota", "2026"]
];

const render = (id, data) => {
  document.getElementById(id).innerHTML = data
    .map(([t, l, y]) => `<li><div>${t}</div><span>${l} · ${y}</span></li>`)
    .join("");
};
render("awardList", awards);
render("actList", activities);
document.getElementById("yr").textContent = new Date().getFullYear();

// Layar pembuka
const welcome = document.getElementById("welcome");
const enter = () => {
  welcome.classList.add("out");
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
};
document.getElementById("enter").addEventListener("click", enter);

// Munculkan item daftar saat terlihat
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
}), { threshold: .2 });
document.querySelectorAll(".list li").forEach(li => io.observe(li));

// Tandai menu aktif sesuai posisi scroll
const links = document.querySelectorAll("nav a");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));

// Tab Prestasi / Kegiatan
document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
  ["awardList", "actList"].forEach(id => {
    const ul = document.getElementById(id);
    ul.hidden = id !== b.dataset.tab;
    ul.querySelectorAll("li").forEach(li => li.classList.remove("show"));
    if (!ul.hidden) ul.querySelectorAll("li").forEach(li => io.observe(li));
  });
}));

// Hitung angka statistik saat terlihat
const counter = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, max = +el.dataset.n; let n = 0;
  const t = setInterval(() => { el.textContent = ++n; if (n >= max) clearInterval(t); }, 70);
  counter.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll("[data-n]").forEach(el => counter.observe(el));

// Latar bintang yang bergerak pelan mengikuti kursor
(() => {
  const c = document.getElementById("stars"), x = c.getContext("2d");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, mx = 0, my = 0, stars = [];
  const size = () => {
    w = c.width = innerWidth; h = c.height = innerHeight;
    stars = Array.from({ length: Math.min(160, w / 8) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + .3, d: Math.random() * .9 + .1,
      p: Math.random() * 6.28, rose: Math.random() < .2
    }));
  };
  addEventListener("resize", size); size();
  addEventListener("mousemove", e => { mx = e.clientX / w - .5; my = e.clientY / h - .5; });
  const draw = t => {
    x.clearRect(0, 0, w, h);
    stars.forEach(s => {
      const px = (s.x - mx * 40 * s.d + w) % w, py = (s.y - my * 40 * s.d + h) % h;
      x.globalAlpha = calm ? .7 : .4 + .5 * Math.abs(Math.sin(t / 1200 + s.p));
      x.fillStyle = s.rose ? "#e8b4bc" : "#f3ece6";
      x.beginPath(); x.arc(px, py, s.r, 0, 6.28); x.fill();
    });
    if (!calm) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
