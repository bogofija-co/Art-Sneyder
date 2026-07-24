import React, { useEffect, useState } from 'react';
import { GraphicProject, GraphicAsset } from '../types';
import { X, Layers, Copy, Check, Eye, Tag, Wrench, Palette, Maximize2, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: GraphicProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [projectAssets, setProjectAssets] = useState<GraphicAsset[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (project) {
      fetch(`/api/v1/assets?project_id=${project.id}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            setProjectAssets(resData.data);
          }
        })
        .catch((err) => console.error('Error fetching project assets:', err));
    }
  }, [project]);

  if (!project) return null;

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-orange-500 text-white flex items-center justify-center backdrop-blur-md transition-all border border-neutral-700/50"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-8">
          
          {/* Main Visual Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black aspect-[16/9] sm:aspect-[2/1] group">
            <img
              src={project.high_res_url || project.img}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500 text-black shadow-lg">
                {project.categoryLabel}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-800">
                <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Aspect Ratio: {project.aspect_ratio}</span>
                <span>•</span>
                <span>{project.dimensions.width}x{project.dimensions.height}px</span>
              </div>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-orange-400 font-semibold uppercase tracking-wider">
                {project.client_brand}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-400">{project.year}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white mb-4">
              {project.title}
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {project.long_description || project.desc}
            </p>
          </div>

          {/* Color Palette & Dominant Color Metadata */}
          <div className="p-5 rounded-2xl bg-black/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-heading font-semibold text-gray-300">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                Paleta de Color Dominante (Hex Extracted)
              </span>
              <span className="font-mono text-gray-400">Dominante: {project.dominant_color}</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {project.color_palette?.hex_list?.map((hex, idx) => (
                <button
                  key={`${hex}-${idx}`}
                  onClick={() => copyHex(hex)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all text-xs font-mono text-gray-300 group"
                  title="Hacer clic para copiar Hex"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{hex}</span>
                  {copiedHex === hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tools & Tags Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Tools */}
            <div className="space-y-3">
              <h3 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-orange-500" />
                Herramientas & Software Utilizado
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools?.map((tool, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 border border-neutral-700 text-gray-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Creative Tags */}
            <div className="space-y-3">
              <h3 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                Etiquetas Creativas
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags_creativos?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-orange-500/10 border border-orange-500/20 text-orange-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Linked Graphic Assets */}
          {projectAssets.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                Assets Multimedia e Imágenes Vinculadas ({projectAssets.length})
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {projectAssets.map((ast) => (
                  <div
                    key={ast.id}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-4 hover:border-neutral-700 transition-all"
                  >
                    <img
                      src={ast.thumbnail_url}
                      alt={ast.filename}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-800"
                    />
                    <div className="space-y-1 text-xs truncate">
                      <p className="font-mono text-white font-medium truncate">{ast.filename}</p>
                      <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                        <span className="uppercase font-bold text-orange-400">{ast.format}</span>
                        <span>•</span>
                        <span>{ast.role}</span>
                        <span>•</span>
                        <span>{ast.file_size_kb} KB</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex justify-end pt-4 border-t border-neutral-800">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-all"
            >
              Cerrar Detalle
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
