import React from 'react';
import {
  Server,
  Layers,
  Database,
  Code2,
  FileText,
  Palette,
  Image as ImageIcon,
  Zap,
  Mail,
  Phone,
  CheckCircle2,
  Cpu,
  Globe,
  Share2,
} from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title Header */}
      <div className="glass p-8 rounded-3xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
              Technical Specification
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Full-Stack Architecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Especificación Técnica y Arquitectura de la API RESTful
          </h1>

          <p className="text-gray-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            Documentación completa para la plataforma y API RESTful de <strong className="text-white">Art Sneyder (Sneyder Riaño Hernández)</strong>. Diseñada bajo principios de rendimiento, escalabilidad y entrega de medios visuales enriquecidos para proyectos de diseño gráfico, empaques, motion graphics y desarrollo web.
          </p>
        </div>
      </div>

      {/* 1. ARQUITECTURA SUGERIDA & MEDIA PIPELINE */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">1. Arquitectura Sugerida y Stack Tecnológico</h2>
            <p className="text-xs text-gray-400 font-mono">Infraestructura backend optimizada para medios gráficos pesados</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-orange-400 border border-neutral-700">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Node.js + Express & TypeScript</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Servidor backend ligero y asíncrono configurado con rutas modulares `/api/v1/*`, validación estricta de tipos en TypeScript, compresión Gzip/Brotli y middleware para headers de caché (`ETag`, `Cache-Control`).
            </p>
          </div>

          <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-emerald-400 border border-neutral-700">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Pipeline de Medios (WebP/SVG/PNG)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Entrega eficiente de recursos visuales con compresión WebP progresiva, placeholders SVG difuminados (Blur Data-URIs), vectores limpios SVG para troqueles/dielines y soporte multi-resolución en `srcset`.
            </p>
          </div>

          <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-blue-400 border border-neutral-700">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Caché CDN & Dominant Color Extraction</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mapeo automatizado de metadatos creativos como `dominant_color`, paleta de 5 tonos Hex, `aspect_ratio` (4:3, 16:9, 4:5) y carga diferida (lazy loading) para acelerar el renderizado del frontend.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ESQUEMA DE BASE DE DATOS Y MODELO JSON */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">2. Esquema de Base de Datos y Modelo JSON</h2>
            <p className="text-xs text-gray-400 font-mono">Estructura de datos con metadatos gráficos derivados del HTML</p>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-6">
          <p className="text-xs sm:text-sm text-gray-300">
            El modelo relacional / JSON integra propiedades de optimización gráfica y metadatos creativos extraídos del HTML y los proyectos de empaque (Natural Green, BioEssence, BOGO Cycling, etc.):
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Project Schema */}
            <div className="p-5 rounded-2xl bg-black/80 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center justify-between">
                <span>GraphicProject Schema (Entidad Principal)</span>
                <span className="text-gray-500">TypeScript Interface</span>
              </h3>
              <pre className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto p-3 rounded-xl bg-neutral-950 border border-neutral-900">
{`interface GraphicProject {
  id: number;
  title: string;
  slug: string;
  category: 'identidad' | 'uiux' | 'photo' | 'motion';
  client_brand: string;
  year: string;
  desc: string;
  long_description: string;
  dominant_color: string; // ej. '#f97316'
  color_palette: {
    primary: string;
    accent: string;
    dominant: string;
    hex_list: string[]; // ['#f97316', '#000000', ...]
  };
  aspect_ratio: string; // '4:3' | '16:9' | '4:5'
  dimensions: { width: number; height: number };
  blur_placeholder: string; // Base64 SVG Data-URI
  high_res_url: string;
  thumbnail_url: string;
  tags_creativos: string[];
  tools: string[];
  featured: boolean;
  views_count: number;
}`}
              </pre>
            </div>

            {/* Asset Schema */}
            <div className="p-5 rounded-2xl bg-black/80 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>GraphicAsset Schema (Archivos de Diseño)</span>
                <span className="text-gray-500">TypeScript Interface</span>
              </h3>
              <pre className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto p-3 rounded-xl bg-neutral-950 border border-neutral-900">
{`interface GraphicAsset {
  id: string;
  project_id: number;
  filename: string;
  format: 'webp' | 'png' | 'svg' | 'jpg' | 'mp4';
  role: 'cover' | 'dieline' | 'render_3d' | 'prepress' | 'ui_prototype';
  high_res_url: string;
  thumbnail_url: string;
  aspect_ratio: string;
  dominant_color: string;
  color_palette: string[];
  blur_placeholder: string;
  file_size_kb: number;
  optimization: {
    lazy_load: boolean;
    srcset_available: boolean;
    compression_ratio: string;
  };
}`}
              </pre>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DEFINICIÓN DE ENDPOINTS RESTful */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">3. Definición de Endpoints RESTful (/api/v1)</h2>
            <p className="text-xs text-gray-400 font-mono">Contrato completo de rutas, métodos, parámetros y estandarización JSON</p>
          </div>
        </div>

        <div className="glass rounded-3xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-900/90 text-gray-400 font-mono uppercase border-b border-neutral-800">
                  <th className="p-4">Método</th>
                  <th className="p-4">Endpoint</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Query Params / Body</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-gray-300">
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/projects</td>
                  <td className="p-4 text-gray-400">Listado de proyectos con metadatos gráficos</td>
                  <td className="p-4 text-gray-500">category, color, tag, search, featured, page, limit</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/projects/:id</td>
                  <td className="p-4 text-gray-400">Detalle de un proyecto y sus assets</td>
                  <td className="p-4 text-gray-500">id o slug del proyecto</td>
                  <td className="p-4 text-emerald-400">200 OK / 404</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/projects</td>
                  <td className="p-4 text-gray-400">Crea un nuevo proyecto en la API</td>
                  <td className="p-4 text-gray-500">JSON body con title, category, dominant_color...</td>
                  <td className="p-4 text-blue-400">201 Created</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/categories</td>
                  <td className="p-4 text-gray-400">Especialidades de diseño y contadores</td>
                  <td className="p-4 text-gray-500">Ninguno</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/assets</td>
                  <td className="p-4 text-gray-400">Metadatos de archivos (WebP, SVG, PNG)</td>
                  <td className="p-4 text-gray-500">project_id, format, role, aspect_ratio</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/profile</td>
                  <td className="p-4 text-gray-400">Perfil de Art Sneyder y marcas BOGO</td>
                  <td className="p-4 text-gray-500">Ninguno</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/experience</td>
                  <td className="p-4 text-gray-400">Trayectoria laboral (Grupo PRS, Éxito...)</td>
                  <td className="p-4 text-gray-500">Ninguno</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/skills</td>
                  <td className="p-4 text-gray-400">Matriz de habilidades % y software</td>
                  <td className="p-4 text-gray-500">category, is_primary</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/certifications</td>
                  <td className="p-4 text-gray-400">Títulos, Platzi (Gemini/n8n), SENA</td>
                  <td className="p-4 text-gray-500">Ninguno</td>
                  <td className="p-4 text-emerald-400">200 OK</td>
                </tr>
                <tr className="hover:bg-neutral-900/40">
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span></td>
                  <td className="p-4 text-white font-bold">/api/v1/contact</td>
                  <td className="p-4 text-gray-400">Contacto directo con correo y WhatsApp</td>
                  <td className="p-4 text-gray-500">JSON: name, email, message, company, phone</td>
                  <td className="p-4 text-blue-400">201 Created</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. VERIFICACIÓN DE CREDENCIALES Y CONTACTO OFICIAL */}
      <section className="glass p-8 rounded-3xl border border-neutral-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">4. Integración de Datos Oficiales de Contacto</h2>
            <p className="text-xs text-gray-400 font-mono">Verificación de correo y teléfono requeridos en el controlador backend</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Mail className="w-4 h-4" />
              <span className="font-heading font-semibold text-xs uppercase tracking-wider">Correo Oficial</span>
            </div>
            <p className="text-lg font-mono font-bold text-white">bogofija@gmail.com</p>
            <p className="text-[11px] text-gray-500">Configurado en `/api/v1/profile` y `/api/v1/contact`</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Phone className="w-4 h-4" />
              <span className="font-heading font-semibold text-xs uppercase tracking-wider">WhatsApp / Celular</span>
            </div>
            <p className="text-lg font-mono font-bold text-white">+57 311 811 3811</p>
            <p className="text-[11px] text-gray-500">Genera links dinámicos `https://api.whatsapp.com/send`</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Share2 className="w-4 h-4" />
              <span className="font-heading font-semibold text-xs uppercase tracking-wider">Familia BOGO</span>
            </div>
            <p className="text-lg font-mono font-bold text-white">6 Marcas Vinculadas</p>
            <p className="text-[11px] text-gray-500">Bogofija, Bogochicas, Bogoruta, Bogo MTB, Bogo Pública, Bogo Fixie</p>
          </div>
        </div>
      </section>

    </div>
  );
};
