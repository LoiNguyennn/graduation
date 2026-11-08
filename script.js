/* ==========================================================================
   CONFIG — sửa mọi thông tin ở đây, không cần đụng vào index.html
   ========================================================================== */
const CONFIG = {
  hostName: "Phúc Lợi",                  // tên thân mật, hiện trên phong bì và chữ ký
  fullName: "Nguyễn Phúc Lợi",           // họ tên đầy đủ in trên thiệp
  school: "Trường Đại học Khoa học Tự nhiên",
  university: "Đại học Quốc gia TP. Hồ Chí Minh",
  schoolShort: "Trường ĐH Khoa học Tự nhiên",   // góc trên thiệp, cần ngắn
  universityShort: "ĐHQG-HCM",
  degree: "Cử nhân Kỹ thuật Phần mềm",
  degreeEn: "Software Engineering",

  date: "2026-12-06",                    // YYYY-MM-DD
  time: "",                              // "HH:MM" giờ Việt Nam, ví dụ "08:30". Để trống nếu chưa có.
  durationMinutes: 120,                  // độ dài sự kiện trong file .ics khi đã có giờ
  timePlaceholder: "giờ sẽ cập nhật sớm",

  venue: "Trường ĐH Khoa học Tự nhiên, cơ sở 1",
  address: "227 Nguyễn Văn Cừ, Quận 5, TP.HCM",
  mapQuery: "Trường Đại học Khoa học Tự nhiên, 227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",

  intro: "Mình thân mời bạn đến chung vui trong",
  closing: "Có bạn ở đó, ngày vui của mình sẽ trọn vẹn hơn.",
  defaultRecipient: "Bạn thân mến",     // khi link không có ?to=Tên
  studyYears: "2022 – 2026",             // góc trên phải của thiệp

  icsTitle: "Lễ tốt nghiệp của Phúc Lợi",
  icsFileName: "le-tot-nghiep-loi.ics",
};

/* ========================================================================== */

(function () {
  "use strict";

  const body = document.body;
  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");
  const replayBtn = document.getElementById("replay");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Tiện ích ---------- */
  const pad = (n) => String(n).padStart(2, "0");

  function parseDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m, d };
  }

  function formatDateVi(iso) {
    const { y, m, d } = parseDate(iso);
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const weekday = days[new Date(y, m - 1, d).getDay()];
    return `${weekday}, ngày ${pad(d)}/${pad(m)}/${y}`;
  }


  function setField(name, text) {
    document.querySelectorAll(`[data-field="${name}"]`).forEach((el) => {
      el.textContent = text;
    });
  }

  /* ---------- Đổ CONFIG vào trang ---------- */
  function render() {
    const { d, m, y } = parseDate(CONFIG.date);
    setField("hostName", CONFIG.hostName);
    setField("hostInitial", CONFIG.hostName.trim().split(/\s+/).pop().charAt(0).toUpperCase()); // chữ cái đầu của tên (Lợi → L)
    setField("fullName", CONFIG.fullName);
    setField("school", CONFIG.school);
    setField("university", CONFIG.university);
    setField("schoolShort", CONFIG.schoolShort);
    setField("universityShort", CONFIG.universityShort);
    setField("degree", CONFIG.degree);
    setField("degreeEn", CONFIG.degreeEn);
    setField("venue", CONFIG.venue);
    setField("address", CONFIG.address);
    setField("intro", CONFIG.intro);
    setField("closing", CONFIG.closing);
    setField("studyYears", CONFIG.studyYears);
    setField("dateBig", `${pad(d)}.${pad(m)}.${y}`);

    const weekday = formatDateVi(CONFIG.date).split(",")[0];
    const timeEl = document.querySelector('[data-field="timeLine"]');
    if (CONFIG.time) {
      timeEl.textContent = `Vào lúc ${CONFIG.time}, ${weekday}`;
      timeEl.classList.remove("is-placeholder");
    } else {
      timeEl.textContent = `${weekday}, ${CONFIG.timePlaceholder}`;
      timeEl.classList.add("is-placeholder");
    }

    document.getElementById("openMap").href =
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapQuery);

    // ?to=Tên  →  "Gửi Tên" trên phong bì và trong thiệp
    const to = (new URLSearchParams(location.search).get("to") || "").trim().slice(0, 40);
    setField("toName", to || CONFIG.defaultRecipient);
    if (to) {
      const env = document.querySelector('[data-field="toEnvelope"]');
      env.querySelector("b").textContent = to;
      env.hidden = false;
    }
  }

  /* ---------- Ảnh lỗi: hiện khung thay thế, ẩn logo ---------- */
  function guardImages() {
    const photo = document.getElementById("photo");
    const frame = document.getElementById("photoFrame");
    const logo = document.getElementById("logo");
    const campus = document.getElementById("campus");

    const photoBroken = () => frame.classList.add("is-broken");
    const logoBroken = () => logo.classList.add("is-broken");
    const campusBroken = () => campus.classList.add("is-broken");

    photo.addEventListener("error", photoBroken);
    logo.addEventListener("error", logoBroken);
    campus.addEventListener("error", campusBroken);
    // Ảnh có thể đã lỗi trước khi script chạy
    if (photo.complete && photo.naturalWidth === 0) photoBroken();
    if (logo.complete && logo.naturalWidth === 0) logoBroken();
    if (campus.complete && campus.naturalWidth === 0) campusBroken();
  }

  /* ---------- Tạo file .ics ---------- */
  function icsEscape(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  }

  function toUtcStamp(ms) {
    const dt = new Date(ms);
    return (
      dt.getUTCFullYear() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) +
      "T" +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      "00Z"
    );
  }

  function buildIcs() {
    const { y, m, d } = parseDate(CONFIG.date);
    let dtStart, dtEnd;

    if (CONFIG.time) {
      const [h, mi] = CONFIG.time.split(":").map(Number);
      const start = Date.UTC(y, m - 1, d, h - 7, mi); // giờ Việt Nam = UTC+7
      const end = start + CONFIG.durationMinutes * 60 * 1000;
      dtStart = "DTSTART:" + toUtcStamp(start);
      dtEnd = "DTEND:" + toUtcStamp(end);
    } else {
      const next = new Date(Date.UTC(y, m - 1, d + 1));
      dtStart = `DTSTART;VALUE=DATE:${y}${pad(m)}${pad(d)}`;
      dtEnd = `DTEND;VALUE=DATE:${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`;
    }

    const location = `${CONFIG.venue}, ${CONFIG.address}`;
    const description = CONFIG.time
      ? `${CONFIG.degree} — ${CONFIG.school}, ${CONFIG.university}.`
      : `${CONFIG.degree} — ${CONFIG.school}, ${CONFIG.university}. ${CONFIG.timePlaceholder}.`;

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//graduation-invite//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + `${y}${pad(m)}${pad(d)}-graduation@invite`,
      "DTSTAMP:" + toUtcStamp(Date.now()),
      dtStart,
      dtEnd,
      "SUMMARY:" + icsEscape(CONFIG.icsTitle),
      "LOCATION:" + icsEscape(location),
      "DESCRIPTION:" + icsEscape(description),
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
  }

  function downloadIcs() {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = CONFIG.icsFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- Trạng thái: fall → opening → open ---------- */
  function openLetter() {
    if (body.dataset.state !== "fall") return;
    body.dataset.state = "opening";
    const wait = reduceMotion.matches ? 350 : 1900;
    setTimeout(() => {
      body.dataset.state = "open";
      card.removeAttribute("aria-hidden");
      replayBtn.hidden = false;
      card.focus({ preventScroll: true });
    }, wait);
  }

  function replay() {
    body.dataset.state = "reset";         // gỡ animation
    card.setAttribute("aria-hidden", "true");
    replayBtn.hidden = true;
    window.scrollTo(0, 0);
    void body.offsetWidth;                // ép reflow để animation chạy lại từ đầu
    body.dataset.state = "fall";
    envelope.focus({ preventScroll: true });
  }

  envelope.addEventListener("click", openLetter);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLetter();
    }
  });
  replayBtn.addEventListener("click", replay);
  document.getElementById("addCalendar").addEventListener("click", downloadIcs);

  render();
  guardImages();
})();
