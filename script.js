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
  timePlaceholder: "giờ sẽ cập nhật sớm",

  venue: "Trường ĐH Khoa học Tự nhiên, cơ sở 1",
  address: "227 Nguyễn Văn Cừ, Quận 5, TP.HCM",
  mapQuery: "Trường Đại học Khoa học Tự nhiên, 227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",

  intro: "Mình thân mời bạn đến chung vui trong",
  closing: "Có bạn ở đó, ngày vui của mình sẽ trọn vẹn hơn.",
  defaultRecipient: "Bạn thân mến",     // khi link không có ?to=Tên
  phone: "0935750892",                   // số điện thoại, hiện cuối thiệp
  phoneLabel: "Cần gì cứ gọi mình nhé",  // câu dẫn trước số điện thoại
  studyYears: "2022 – 2026",             // góc trên phải của thiệp

  // Gợi ý chỗ gửi xe, theo thứ tự ưu tiên. note: một câu ngắn hiện dưới địa chỉ.
  parkingIntro: "Ngày lễ bãi xe trong trường dễ quá tải, bạn có thể chọn một trong ba chỗ này.",
  parking: [
    {
      name: "Trường ĐH Khoa học Tự nhiên",
      address: "227 Nguyễn Văn Cừ, Quận 5",
      note: "Trong khuôn viên trường, tiện nhất nhưng ngày lễ rất đông. Nên đến sớm.",
      mapQuery: "Trường Đại học Khoa học Tự nhiên, 227 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    },
    {
      name: "Trường ĐH Sư phạm TP.HCM",
      address: "280 An Dương Vương, Quận 5",
      note: "Hai trường thông nhau, đi bộ sang chỉ khoảng 3 phút.",
      mapQuery: "Trường Đại học Sư phạm TP.HCM, 280 An Dương Vương, Quận 5, TP.HCM",
    },
    {
      name: "Nowzone",
      address: "235 Nguyễn Văn Cừ, Quận 1",
      note: "Trung tâm thương mại gần trường, bãi xe tầng hầm, đi bộ khoảng 5 phút.",
      mapQuery: "Nowzone Fashion Mall, 235 Nguyễn Văn Cừ, Quận 1, TP.HCM",
    },
  ],
};

/* ========================================================================== */

(function () {
  "use strict";

  const body = document.body;
  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");
  const replayBtn = document.getElementById("replay");
  const parkingDialog = document.getElementById("parkingDialog");
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


  // 0935750892 → 0935 750 892
  function formatPhone(raw) {
    const d = String(raw).replace(/\D/g, "");
    return d.length === 10 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : raw;
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
    setField("phoneLabel", CONFIG.phoneLabel);
    setField("phoneText", formatPhone(CONFIG.phone));
    document.getElementById("phoneLink").href = "tel:" + CONFIG.phone.replace(/\s+/g, "");
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

    document.getElementById("openMap").href = mapUrl(CONFIG.mapQuery);
    setField("parkingIntro", CONFIG.parkingIntro);
    renderParking();

    // ?to=Tên  →  "Gửi Tên" trên phong bì và trong thiệp
    const to = (new URLSearchParams(location.search).get("to") || "").trim().slice(0, 40);
    setField("toName", to || CONFIG.defaultRecipient);
    if (to) {
      const env = document.querySelector('[data-field="toEnvelope"]');
      env.querySelector("b").textContent = to;
      env.hidden = false;
    }
  }

  /* ---------- Chỗ gửi xe ---------- */
  function mapUrl(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function renderParking() {
    const list = document.getElementById("parkingList");
    list.textContent = "";
    CONFIG.parking.forEach((spot) => {
      const li = document.createElement("li");
      li.className = "parking__item";

      const body = document.createElement("div");
      body.className = "parking__body";
      const name = document.createElement("p");
      name.className = "parking__name";
      name.textContent = spot.name;
      const address = document.createElement("p");
      address.className = "parking__address";
      address.textContent = spot.address;
      const note = document.createElement("p");
      note.className = "parking__note";
      note.textContent = spot.note;
      body.append(name, address, note);

      const link = document.createElement("a");
      link.className = "parking__link";
      link.href = mapUrl(spot.mapQuery);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Chỉ đường";
      link.setAttribute("aria-label", "Chỉ đường tới " + spot.name);

      li.append(body, link);
      list.appendChild(li);
    });
  }

  function openParking() {
    parkingDialog.showModal();
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
  document.getElementById("openParking").addEventListener("click", openParking);
  document.getElementById("closeParking").addEventListener("click", () => parkingDialog.close());
  // Bấm ra ngoài hộp thoại thì đóng
  parkingDialog.addEventListener("click", (e) => {
    if (e.target === parkingDialog) parkingDialog.close();
  });

  render();
  guardImages();
})();
