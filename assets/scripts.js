// ==============================
// LOADING SCREEN + COUNTDOWN
// ==============================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        startCountdown();
    }, 3000);
});

function startCountdown() {
    const countdownContainer = document.getElementById('countdownContainer');
    const countdownNumber = document.getElementById('countdownNumber');

    countdownContainer.classList.add('active');

    let count = 3; // Départ à 3
    const intervalTime = 900; // 0,9s en millisecondes

    const interval = setInterval(() => {
        countdownNumber.textContent = count;
        countdownNumber.style.animation = 'none';

        requestAnimationFrame(() => {
            countdownNumber.style.animation = 'countPulse 0.5s ease';
        });

        if (count === 0) {
            clearInterval(interval);

            setTimeout(() => {
                countdownContainer.classList.add('hidden');
                
                launchConfetti();
                enableHero(); // 💥 EXPLOSION HERO
            }, 500); // un petit délai pour l'animation finale
        }

        count--; // on décrémente
    }, intervalTime);
}

function enableHero() {
    const hero = document.getElementById('heroSection');
    hero.classList.add('show');
    hero.style.opacity = '1';
    hero.style.pointerEvents = 'auto';
}

// ==============================
// HERO EXPLOSION EFFECT
// ==============================
function heroExplosion() {
    const hero = document.getElementById("heroSection");
    const container = document.getElementById("heroEffects");

    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const colors = ["#ffd700", "#ff00ff", "#00ffff", "#ffffff"];

    for (let i = 0; i < 80; i++) {
        const particle = document.createElement("div");
        particle.className = "hero-particle";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 100;

        particle.style.left = cx + "px";
        particle.style.top = cy + "px";
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.setProperty("--tx", Math.cos(angle) * distance + "px");
        particle.style.setProperty("--ty", Math.sin(angle) * distance + "px");

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 1500);
    }
}

// ==============================
// CONFETTI EFFECT
// ==============================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const confettiCount = 150;
    const colors = ['#ff006e', '#3a86ff', '#ffd60a', '#00ff88', '#ff6b6b', '#4ecdc4'];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            speed: Math.random() * 3 + 2,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((piece, index) => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();

            piece.y += piece.speed;
            piece.rotation += piece.rotationSpeed;

            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });

        if (confetti.length > 0) {
            requestAnimationFrame(drawConfetti);
        }
    }

    drawConfetti();
}

// ==============================
// SCROLL ANIMATIONS
// ==============================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll(
    '.animate-on-scroll, .fade-in-left, .fade-in-right, .zoom-in'
).forEach(el => observer.observe(el));

// ==============================
// QUIZ
// ==============================
let currentQuestion = 0;
let score = 0;
const totalQuestions = 4;

document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function () {
        if (this.parentElement.parentElement.querySelector('.quiz-option.correct, .quiz-option.wrong')) {
            return;
        }

        const isCorrect = this.dataset.answer === 'correct';

        if (isCorrect) {
            this.classList.add('correct');
            score++;
        } else {
            this.classList.add('wrong');
            this.parentElement.querySelector('[data-answer="correct"]').classList.add('correct');
        }

        setTimeout(() => {
            currentQuestion++;

            if (currentQuestion < totalQuestions) {
                document.querySelector('.quiz-question.active').classList.remove('active');
                document.querySelectorAll('.quiz-question')[currentQuestion].classList.add('active');
            } else {
                showResults();
            }
        }, 1500);
    });
});

function showResults() {
    document.querySelector('.quiz-question.active').classList.remove('active');
    document.getElementById('finalScore').textContent = score;

    let message = '';
    if (score === 4) {
        message = '🎉 Parfait ! Tu connais Serena à la perfection !';
    } else if (score >= 2) {
        message = '👍 Pas mal ! Tu connais bien Serena !';
    } else {
        message = 'Attention ! Il faut mieux connaître notre birthday girl 😄';
    }

    document.getElementById('quizMessage').textContent = message;
    document.querySelector('.quiz-result').classList.add('show');
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.querySelector('.quiz-result').classList.remove('show');

    document.querySelectorAll('.quiz-question').forEach((q, i) => {
        q.classList.remove('active');
        if (i === 0) q.classList.add('active');
    });

    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'wrong');
    });
}

// ==============================
// MUSIC PLAYER
// ==============================
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
let isPlaying = false;

document.addEventListener('click', () => {
    if (!isPlaying) {
        backgroundMusic.play().then(() => {
            musicToggle.textContent = '⏸';
            isPlaying = true;
        }).catch(() => {});
    }
}, { once: true });

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '▶';
    } else {
        backgroundMusic.play();
        musicToggle.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

// ==============================
// SMOOTH SCROLL
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});



