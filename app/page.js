"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Head from "next/head";
import styles from "./page.module.css";
import { SmoothScroll } from "./smoothscroll";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const progressBar = useRef(null);
  const photoRef = useRef(null);
  const sectionRefs = useRef([]);
  const projectCards = useRef([]);
  const wipCards = useRef([]); // New ref for works in progress
  const [shapes, setShapes] = useState(null);

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    const generateShapes = () => {
      return [...Array(8)].map((_, i) => ({
        id: i,
        shape: i % 2 ? "circle" : "polygon",
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }));
    };
    setShapes(generateShapes());

    // Text wave effect
    gsap.to(".titleLetter", {
      y: -20,
      stagger: 0.05,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Card hover effect for completed projects
    const handleCardHover = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(card, {
        x: (x - rect.width / 2) * 0.1,
        y: (y - rect.height / 2) * 0.1,
        rotationY: (x - rect.width / 2) * 0.2,
        rotationX: -(y - rect.height / 2) * 0.2,
        duration: 0.5,
      });
    };

    // Special hover effect for WIP projects
    const handleWipHover = (e) => {
      const card = e.currentTarget;
      gsap.to(card, {
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(card.querySelector('.wipProgress'), {
        width: "100%",
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleWipLeave = (card) => {
      gsap.to(card, {
        scale: 1,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
      gsap.to(card.querySelector('.wipProgress'), {
        width: "60%",
        duration: 0.8
      });
    };

    projectCards.current.forEach((card) => {
      if (card) {
        card.addEventListener("mousemove", handleCardHover);
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          });
        });
      }
    });

    wipCards.current.forEach((card) => {
      if (card) {
        card.addEventListener("mouseenter", handleWipHover);
        card.addEventListener("mouseleave", () => handleWipLeave(card));
      }
    });

    // Pulse animation for WIP section title
    gsap.to(".wipTitle", {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut"
    });

    // Infinite rotation for WIP icons
    gsap.to(".wipIcon", {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: "none"
    });

    // Section animations
    sectionRefs.current.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => animateSectionElements(section),
        onEnterBack: () => animateSectionElements(section),
      });
    });

    // Cleanup
    return () => {
      projectCards.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mousemove", handleCardHover);
        }
      });
      wipCards.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mouseenter", handleWipHover);
          card.removeEventListener("mouseleave", () => handleWipLeave(card));
        }
      });
      gsap.killTweensOf(".wipTitle");
      gsap.killTweensOf(".wipIcon");
    };
  }, []);

  const animateSectionElements = (section) => {
    gsap.to(section.querySelectorAll("h2, h3, p, [data-animate]"), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    });
  };

  const CreateFloatingShape = ({ shape, top, left, color }) => (
    <div
      style={{
        position: "fixed",
        top: `${top}%`,
        left: `${left}%`,
        opacity: 0.1,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    >
      {shape === "circle" ? (
        <svg width="50" height="50">
          <circle cx="25" cy="25" r="20" fill={color} />
        </svg>
      ) : (
        <svg width="60" height="60">
          <polygon points="30,0 60,30 30,60 0,30" fill={color} />
        </svg>
      )}
    </div>
  );

  return (
    <>
      {/* Floating background shapes */}
      {shapes?.map((shape) => (
        <CreateFloatingShape 
          key={shape.id}
          shape={shape.shape}
          top={shape.top}
          left={shape.left}
          color={shape.color}
        />
      ))}

      <SmoothScroll />
      <Head>
        <title>Alperen Taner - Portfolio</title>
      </Head>

      <div className={styles.progressContainer}>
        <div ref={progressBar} className={styles.progressBar}></div>
      </div>

      <section className={styles.photoSection} ref={photoRef}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.glowingOrb} />
        ))}
        <div className={styles.photoContent}>
          <img
            src="/956-1.jpg"
            alt="Alperen Taner"
            className={styles.profilePhoto}
          />
          <h1 className={styles.mainTitle}>
            {"ALPEREN".split("").map((letter, i) => (
              <span key={i} className={styles.titleLetter}>
                {letter}
              </span>
            ))}
          </h1>
          <div className={styles.subTitleWrapper}>
            <h2 className={styles.subTitle}>ÖĞRENCİ</h2>
            <div className={styles.titleUnderline} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section} ref={addSectionRef}>
        <h2 className={styles.sectionTitle}>Hakkımda</h2>
        <div className={styles.aboutGrid}>
          {[1, 2].map((_, i) => (
            <div key={i} className={styles.aboutCard} data-animate>
              <h3>{i === 0 ? "👨💻 Temel Bilgiler" : "🚀 Teknik Bilgiler"}</h3>
              {i === 0 ? (
                <>
                  <p>Doğum Tarihi: 2 Nisan 2008</p>
                  <p>Şehir: Bornova, İzmir</p>
                  <p>Eğitim: Göztepe MTAL</p>
                  <p>İlgi Alanları: Kodlama, 3D Modelleme, Oyun Geliştirme</p>
                </>
              ) : (
                <>
                  <p>2+ Yıllık Kodlama Deneyimi</p>
                  <p>Full-stack Web Geliştirme</p>
                  <p>3D Modelleme & Render</p>
                  <p>SQL Veritabanı Yönetimi</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className={styles.section} ref={addSectionRef}>
        <h2 className={styles.sectionTitle}>Yetenekler</h2>
        <div className={styles.skillsGrid}>
          {[
            "JSX",
            "HTML5",
            "CSS",
            "JavaScript",
            "PHP",
            "SQL",
            "3D Modelleme",
            "Git",
          ].map((skill, i) => (
            <div key={i} className={styles.skillCard} data-animate>
              <div className={styles.skillIcon}>{skill.charAt(0)}</div>
              <h3>{skill}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.section} ref={addSectionRef}>
        <h2 className={styles.sectionTitle}>Projeler</h2>
        <div className={styles.projectsGrid}>
          {[
            {
              title: "E-Ticaret Sitesi",
              desc: "React ve Node.js ile geliştirilmiş full-stack proje",
              link: "https://github.com/Deronix/FirstShoppingSite",
              img: "/ShoppingSite.jpg",
            },
            {
              title: "Haber Sitesi",
              desc: "Güncel haberleri sunan dinamik web uygulaması",
              link: "https://github.com/Deronix/FirstNewsProject",
              img: "/HaberProje.jpg",
            },
          ].map((project, i) => (
            <a
              key={i}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectCard}
              data-animate
              ref={(el) => projectCards.current.push(el)}
            >
              <div className={styles.projectImage}>
                <img src={project.img} alt={project.title} />
              </div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Works in Progress Section */}
      <section className={styles.section} ref={addSectionRef}>
        <h2 className={`${styles.sectionTitle} wipTitle`}>Üzerinde Çalıştıklarım</h2>
        <div className={styles.wipGrid}>
          {[
            {
              title: "Oyun Motoru",
              desc: "JavaScript ile geliştirilen 2D oyun motoru",
              progress: 45,
              icon: "🎮"
            },
            {
              title: "AI Asistan",
              desc: "Kişisel yapay zeka asistan projesi",
              progress: 30,
              icon: "🤖"
            },
            {
              title: "3D Model Kütüphanesi",
              desc: "Web tabanlı 3D model görüntüleyici",
              progress: 65,
              icon: "🖥️"
            },
          ].map((project, i) => (
            <div 
              key={i} 
              className={styles.wipCard}
              data-animate
              ref={(el) => wipCards.current.push(el)}
            >
              <div className={`${styles.wipIcon} wipIcon`}>
                {project.icon}
              </div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div className={styles.wipProgressContainer}>
                <div 
                  className={`${styles.wipProgress} wipProgress`}
                  style={{ width: `${project.progress}%` }}
                >
                  <span>{project.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section} ref={addSectionRef}>
        <h2 className={styles.sectionTitle}>İletişim</h2>
        <div className={styles.contactGrid}>
          <form className={styles.contactForm}>
            {["İsim", "E-posta", "Mesaj"].map((label, i) => (
              <div key={i} className={styles.formGroup} data-animate>
                <label htmlFor={label.toLowerCase()}>{label}</label>
                {label === "Mesaj" ? (
                  <textarea id={label.toLowerCase()} rows="5" required />
                ) : (
                  <input
                    type={i === 1 ? "email" : "text"}
                    id={label.toLowerCase()}
                    required
                  />
                )}
              </div>
            ))}
            <button type="submit" className={styles.submitButton} data-animate>
              Gönder
            </button>
          </form>

          <div className={styles.socialLinks}>
            <a
              href="https://github.com/Deronix"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
              data-animate
            >
              <span className={styles.socialIcon}>👨💻</span>
              <h3>GitHub Profilim</h3>
              <p>Tüm projelerimi inceleyin</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
