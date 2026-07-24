import React, { useState, useEffect } from 'react';
import {
  GraphicProject,
  Category,
  Profile,
  ExperienceItem,
  SkillItem,
  CertificationItem,
} from '../types';
import { ProjectModal } from './ProjectModal';
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Code2,
  PenTool,
  Film,
  Camera,
  Layers,
  Cpu,
  Bot,
  Wand2,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<GraphicProject[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<GraphicProject | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data from /api/v1
  useEffect(() => {
    fetch('/api/v1/profile')
      .then((res) => res.json())
      .then((d) => d.success && setProfile(d.data));

    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((d) => d.success && setCategories(d.data));

    fetch('/api/v1/experience')
      .then((res) => res.json())
      .then((d) => d.success && setExperience(d.data));

    fetch('/api/v1/skills')
      .then((res) => res.json())
      .then((d) => d.success && setSkills(d.data));

    fetch('/api/v1/certifications')
      .then((res) => res.json())
      .then((d) => d.success && setCertifications(d.data));
  }, []);

  // Fetch projects when filter changes
  useEffect(() => {
    const url = activeFilter === 'all' ? '/api/v1/projects' : `/api/v1/projects?category=${activeFilter}`;
    fetch(url)
      .then((res) => res.json())
      .then((d) => d.success && setProjects(d.data));
  }, [activeFilter]);

  // Typewriter effect
  const [typewriterText, setTypewriterText] = useState('');
  useEffect(() => {
    const words = [
      'Diseñador Gráfico',
      'Creative Designer',
      'Motion Graphics',
      'UI / UX Designer',
      'Creative Developer',
      'AI & Low-Code Specialist',
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const type = () => {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        setTypewriterText(currentWord.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setTypewriterText(currentWord.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentWord.length) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage('¡Mensaje enviado con éxito al servidor! Abriendo cliente de correo...');
        setTimeout(() => {
          window.location.href = data.official_contacts.mailto_direct;
        }, 1200);
        setFormData({ name: '', company: '', email: '', phone: '', message: '' });
      } else {
        setToastMessage('Error en envío: ' + data.error);
      }
    } catch (err) {
      setToastMessage('Error de conexión con el servidor API.');
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const openWhatsApp = () => {
    const phone = profile?.whatsapp_number || '573118113811';
    const text = formData.name && formData.message
      ? `Hola Sneyder! Mi nombre es *${formData.name}*` +
        (formData.company ? ` de la empresa *${formData.company}*` : '') +
        `.\n\nTe escribo para comentarte sobre:\n"${formData.message}"\n\nMis datos:\n- Correo: ${formData.email || 'N/A'}\n- Teléfono: ${formData.phone || 'N/A'}`
      : 'Hola Sneyder, acabo de ver tu portafolio y me gustaría ponerme en contacto contigo para conocer más sobre tus servicios profesionales de diseño y desarrollo.';

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Toast UI */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass border border-orange-500/50 bg-neutral-900/95 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[85vh] flex items-center pt-10 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              Hola, Soy
            </div>

            <div>
              <h1 className="text-5xl sm:text-7xl font-heading font-extrabold text-white tracking-tight">
                Art Sneyder
              </h1>
              <p className="text-xl text-gray-400 font-medium mt-1">Sneyder Riaño Hernández</p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-200 h-10">
              <span className="text-gradient">{typewriterText}</span>
              <span className="animate-pulse text-orange-500">|</span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Diseñador gráfico profesional con más de 10 años de experiencia desarrollando soluciones visuales para marcas, empaques, publicidad y desarrollo web. Actualmente en especialización de <strong className="text-white">Animación Digital & IA</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#portfolio"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-medium bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Ver Portafolio <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-medium glass border border-neutral-700 hover:border-orange-500 hover:text-orange-400 transition-all flex items-center justify-center"
              >
                Contáctame
              </a>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="order-1 lg:order-2 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-[420px] sm:h-[420px]">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[80px]" />
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-neutral-800 glass p-3">
                <img
                  src="https://i.ibb.co/9mTDHttc/art-sneyder.png"
                  alt="Sneyder Riaño Hernández"
                  className="w-full h-full object-cover rounded-2xl filter grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="absolute -top-4 -right-4 glass p-4 rounded-2xl z-20 border border-neutral-800 animate-bounce">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 glass p-4 rounded-2xl z-20 border border-neutral-800">
                <Code2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 glass">
            <img
              src="https://i.ibb.co/mF9LzSjK/fotografo.jpg"
              alt="Art Sneyder Fotógrafo"
              className="w-full h-[480px] object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="text-orange-400 text-xs font-mono font-bold uppercase tracking-wider block mb-1">
                Visión Creativa
              </span>
              <h3 className="text-2xl font-heading font-bold text-white">
                Integro estética, estrategia y tecnología
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
                Detrás del <span class="text-gradient">Diseño</span>
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full" />
            </div>

            <p className="text-gray-300 text-base leading-relaxed">
              Soy <strong className="text-white font-semibold">Sneyder Riaño Hernández</strong> (Art Sneyder), Profesional en Diseño Gráfico graduado en el año 2016 con más de diez años de experiencia en la industria creativa.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              A lo largo de mi carrera he desarrollado soluciones visuales abarcando branding, diseño gráfico impreso y digital, empaques estructurales, producción audiovisual, desarrollo web e integraciones de automatización con inteligencia artificial.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-800 text-center">
              <div className="glass p-4 rounded-2xl border border-neutral-800">
                <p className="text-3xl font-heading font-bold text-white">10+</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Años Exp.</p>
              </div>
              <div className="glass p-4 rounded-2xl border border-neutral-800">
                <p className="text-3xl font-heading font-bold text-white">250+</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Proyectos</p>
              </div>
              <div className="glass p-4 rounded-2xl border border-neutral-800">
                <p className="text-3xl font-heading font-bold text-white">150+</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Clientes</p>
              </div>
              <div className="glass p-4 rounded-2xl border border-neutral-800">
                <p className="text-3xl font-heading font-bold text-white">5000+</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Diseños</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SPECIALTIES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Áreas de <span className="text-gradient">Especialidad</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Soluciones integrales que combinan creatividad, técnica y tecnología de vanguardia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Diseño Gráfico', icon: PenTool, desc: 'Piezas visuales impresas y digitales' },
            { title: 'Branding', icon: Sparkles, desc: 'Construcción y posicionamiento de marcas' },
            { title: 'Identidad Corporativa', icon: Layers, desc: 'Sistemas visuales y manuales corporativos' },
            { title: 'Motion Graphics', icon: Film, desc: 'Animación 2D y gráficos en movimiento' },
            { title: 'Prod. Audiovisual', icon: Film, desc: 'Dirección, grabación y edición de video' },
            { title: 'Diseño Editorial', icon: BookOpen, desc: 'Maquetación de revistas y libros' },
            { title: 'UX / UI', icon: Layers, desc: 'Diseño de interfaces intuitivas para apps' },
            { title: 'Desarrollo Frontend', icon: Code2, desc: 'Implementación web con HTML, CSS, JS' },
            { title: 'Automatización (IA)', icon: Bot, desc: 'Workflows con n8n, Gemini y Claude' },
            { title: 'Fotografía Comercial', icon: Camera, desc: 'Fotografía de producto y retratos' },
          ].map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <div
                key={idx}
                className="glass p-5 rounded-3xl border border-neutral-800 hover:border-orange-500/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500 group-hover:text-black transition-all">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-heading font-bold text-white mb-1">{srv.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PORTFOLIO GRID SECTION */}
      <section id="portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
              Trabajos <span className="text-gradient">Destacados</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Selección de proyectos recientes aplicando empaques, branding y tecnología web.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'identidad', label: 'Identidad & Packaging' },
              { id: 'uiux', label: 'UX/UI' },
              { id: 'photo', label: 'Fotografía' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeFilter === btn.id
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'glass border border-neutral-800 text-gray-400 hover:text-white hover:border-orange-500'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-[4/3] bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 transition-all duration-300"
            >
              <img
                src={proj.img || proj.high_res_url}
                alt={proj.title}
                className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
                    {proj.categoryLabel}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-neutral-700"
                    style={{ backgroundColor: proj.dominant_color }}
                    title={`Color dominante: ${proj.dominant_color}`}
                  />
                </div>

                <h3 className="text-xl font-heading font-bold text-white mb-1">{proj.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-orange-300">
                  Ver detalle de proyecto <ArrowRight className="w-3.5 h-3.5" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS SECTION */}
      <section id="education" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">
              Formación <span className="text-gradient">Profesional</span>
            </h2>

            <div className="space-y-8 pl-4 border-l border-neutral-800">
              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-orange-500 absolute -left-[25px] top-1.5 ring-4 ring-black" />
                <span className="text-orange-400 text-xs font-mono font-bold uppercase">Julio 2, 2016</span>
                <h3 className="text-lg font-heading font-bold text-white mt-1">Profesional en Diseño Gráfico</h3>
                <p className="text-gray-400 text-xs mb-3">Institución: Suramérica</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Comunicación visual', 'Publicidad', 'Branding', 'Diseño editorial'].map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-gray-400 text-[11px] rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute -left-[25px] top-1.5" />
                <span className="text-emerald-400 text-xs font-mono font-bold uppercase">Actualidad</span>
                <h3 className="text-lg font-heading font-bold text-white mt-1">Animación Digital & IA</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Estudios profesionales en Motion Graphics, Producción audiovisual, Storytelling y composición 2D/3D.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">
              Certificaciones <span className="text-gradient">Recientes</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="glass p-5 rounded-2xl border border-neutral-800 hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-orange-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-gray-500 text-[10px] font-mono font-bold uppercase">{cert.date}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-heading font-bold text-white mb-0.5">{cert.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{cert.institution} • {cert.hours_or_status}</p>
                    <div className="flex flex-wrap gap-1">
                      {cert.topics?.map((topic, ti) => (
                        <span key={ti} className="text-[10px] font-mono text-gray-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE & SKILLS SECTION */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Experience Timeline */}
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">
              Trayectoria <span className="text-gradient">Profesional</span>
            </h2>

            <div className="space-y-8 pl-4 border-l border-neutral-800">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 space-y-2">
                  <span className="w-3 h-3 rounded-full bg-neutral-700 border-2 border-orange-500 absolute -left-[25px] top-1.5" />
                  <span className="text-orange-400 text-xs font-mono font-bold uppercase">{exp.period}</span>
                  <h3 className="text-lg font-heading font-bold text-white">{exp.role}</h3>
                  <h4 className="text-xs font-mono text-gray-400">{exp.company}</h4>
                  <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed pt-1">
                    {exp.highlights?.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">
              Habilidades <span className="text-gradient">Técnicas</span>
            </h2>

            <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-4">
              {skills.map((sk) => (
                <div key={sk.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-200 font-medium">{sk.name}</span>
                    <span className="text-orange-400 font-mono font-bold">{sk.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${sk.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
              Trabajemos <span className="text-gradient">Juntos</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              ¿Tienes un proyecto en mente o buscas elevar la identidad visual de tu marca integrando las últimas tecnologías? Hablemos.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass border border-neutral-800 flex items-center justify-center text-orange-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Correo Electrónico</p>
                  <a href="mailto:bogofija@gmail.com" className="text-white font-mono font-semibold hover:text-orange-400 transition-colors">
                    bogofija@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass border border-neutral-800 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Teléfono / WhatsApp</p>
                  <a href="https://api.whatsapp.com/send?phone=573118113811" target="_blank" rel="noopener noreferrer" className="text-white font-mono font-semibold hover:text-emerald-400 transition-colors">
                    +57 311 811 3811
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass border border-neutral-800 flex items-center justify-center text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Ubicación</p>
                  <p className="text-white font-semibold">Bogotá, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleFormSubmit} className="glass p-8 rounded-3xl border border-neutral-800 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nombre de tu marca"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hola@empresa.com"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Mensaje del Proyecto</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Cuéntame sobre tu idea..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className="flex-1 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-4 h-4" /> Enviar Mensaje
              </button>

              <button
                type="button"
                onClick={openWhatsApp}
                className="flex-1 py-3.5 rounded-xl text-white font-medium bg-[#25D366] hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 text-xs"
              >
                <MessageSquare className="w-4 h-4" /> Vía WhatsApp
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* FOOTER & BOGO FAMILY */}
      <footer className="border-t border-neutral-800 pt-12 pb-16 text-center space-y-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
            Familia BOGO (Comunidad y Ecosistema)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-4xl mx-auto">
            {profile?.bogo_family?.map((bogo, bi) => (
              <a
                key={bi}
                href={bogo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
                title={bogo.description}
              >
                <img
                  src={bogo.logo}
                  alt={bogo.name}
                  className="h-8 sm:h-10 w-auto opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                />
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-orange-400">
                  {bogo.name}
                </span>
              </a>
            ))}
          </div>

          <div className="pt-8 flex flex-col items-center justify-center space-y-2 text-xs text-gray-500">
            <img
              src="https://i.ibb.co/1GtSWCf3/logo-art-sneyder.png"
              alt="Art Sneyder"
              className="h-8 w-auto opacity-70 filter grayscale"
            />
            <p>© 2026 Art Sneyder — Sneyder Riaño Hernández. Diseñado y Desarrollado con REST API v1.</p>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

    </div>
  );
};
