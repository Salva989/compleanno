const slider = document.querySelector("#slider");
const slides = [...document.querySelectorAll(".slide")];
const counter = document.querySelector("#currentSlide");
const totalSlides = document.querySelector("#totalSlides");
const dotsContainer = document.querySelector("#dots");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const calendarButton = document.querySelector("#calendarButton");
const brand = document.querySelector(".brand");

let currentIndex = 0;

totalSlides.textContent = String(slides.length).padStart(2, "0");
slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = `dot${index === 0 ? " is-active" : ""}`;
  dot.dataset.slide = index;
  dot.setAttribute("aria-label", `Vai alla slide ${index + 1}`);
  dotsContainer.append(dot);
});
const dots = [...document.querySelectorAll(".dot")];

function goToSlide(index) {
  const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
  slider.scrollTo({ left: nextIndex * slider.clientWidth, behavior: "smooth" });
}

function updateNavigation(index) {
  currentIndex = index;
  counter.textContent = String(index + 1).padStart(2, "0");
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  const activeDot = dots[index];
  if (activeDot) {
    dotsContainer.scrollTo({
      left: activeDot.offsetLeft - dotsContainer.clientWidth / 2 + activeDot.clientWidth / 2,
      behavior: "smooth"
    });
  }
  previousButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
}

const observer = new IntersectionObserver(
  (entries) => {
    const visibleSlide = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visibleSlide) updateNavigation(slides.indexOf(visibleSlide.target));
  },
  { root: slider, threshold: [0.6, 0.8] }
);

slides.forEach((slide) => observer.observe(slide));
dots.forEach((dot) => dot.addEventListener("click", () => goToSlide(Number(dot.dataset.slide))));
previousButton.addEventListener("click", () => goToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));
brand.addEventListener("click", (event) => {
  event.preventDefault();
  goToSlide(0);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goToSlide(currentIndex + 1);
  if (event.key === "ArrowLeft") goToSlide(currentIndex - 1);
});

calendarButton.addEventListener("click", () => {
  const year = new Date().getFullYear();
  const eventYear = new Date(year, 8, 5, 20) < new Date() ? year + 1 : year;
  const pad = (value) => String(value).padStart(2, "0");
  const format = (date) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  const start = new Date(eventYear, 8, 5, 20, 0);
  const end = new Date(eventYear, 8, 6, 1, 0);
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Super Party//IT", "BEGIN:VEVENT",
    `DTSTART:${format(start)}`, `DTEND:${format(end)}`,
    "SUMMARY:Compleanno — tema Eurospin",
    "LOCATION:Viale Rodi 84, Bicocca, Milano",
    "DESCRIPTION:Ti aspetto! Tema della festa: Eurospin.",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
  link.download = `compleanno-5-settembre-${eventYear}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
});

updateNavigation(0);
