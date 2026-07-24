import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RefreshCw,
  Search,
  Filter,
  Code2,
  Database,
  Send,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';

export const ApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/projects');
  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [queryParams, setQueryParams] = useState({
    category: 'all',
    color: '',
    tag: '',
    search: '',
    featured: 'false',
    limit: '10',
    page: '1',
  });

  // POST project payload
  const [postProjectBody, setPostProjectBody] = useState(
    JSON.stringify(
      {
        title: 'Brand Packaging Bio Green',
        category: 'identidad',
        categoryLabel: 'Identidad Corporativa',
        client_brand: 'Eco Green Co',
        year: '2026',
        desc: 'Diseño de empaque eco-amigable con acabado kraft y tinta vegetal.',
        dominant_color: '#10b981',
        tools: ['Illustrator', 'Photoshop', 'Dieline Structural'],
        tags_creativos: ['Eco-Packaging', 'Sustentable', 'Kraft'],
      },
      null,
      2
    )
  );

  // POST contact payload
  const [postContactBody, setPostContactBody] = useState(
    JSON.stringify(
      {
        name: 'Carlos Mendoza',
        company: 'Agencia Creativa Bogotá',
        email: 'carlos@agenciacreativa.co',
        phone: '3109998877',
        message: 'Hola Sneyder, nos gustaría contratarte para un proyecto de rebranding y empaques en Bogotá.',
      },
      null,
      2
    )
  );

  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<unknown>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);

  // Compute final Request URL
  const buildRequestUrl = () => {
    let url = selectedEndpoint;
    if (selectedMethod === 'GET') {
      const params = new URLSearchParams();
      if (selectedEndpoint === '/api/v1/projects') {
        if (queryParams.category && queryParams.category !== 'all') params.append('category', queryParams.category);
        if (queryParams.color) params.append('color', queryParams.color);
        if (queryParams.tag) params.append('tag', queryParams.tag);
        if (queryParams.search) params.append('search', queryParams.search);
        if (queryParams.featured === 'true') params.append('featured', 'true');
        if (queryParams.limit) params.append('limit', queryParams.limit);
        if (queryParams.page) params.append('page', queryParams.page);
      }
      const pString = params.toString();
      if (pString) url += `?${pString}`;
    }
    return url;
  };

  const executeRequest = async () => {
    setLoading(true);
    const startTime = performance.now();
    const url = buildRequestUrl();

    try {
      const options: RequestInit = {
        method: selectedMethod,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      if (selectedMethod === 'POST') {
        if (selectedEndpoint === '/api/v1/projects') {
          options.body = postProjectBody;
        } else if (selectedEndpoint === '/api/v1/contact') {
          options.body = postContactBody;
        }
      }

      const res = await fetch(url, options);
      const data = await res.json();
      const endTime = performance.now();

      setResponseStatus(res.status);
      setResponseData(data);
      setResponseTime(Math.round(endTime - startTime));
    } catch (err: unknown) {
      const endTime = performance.now();
      setResponseStatus(500);
      setResponseData({ error: 'Error ejecutando la solicitud a la API', details: String(err) });
      setResponseTime(Math.round(endTime - startTime));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeRequest();
  }, [selectedEndpoint, selectedMethod]);

  const getCurlSnippet = () => {
    const url = `${window.location.origin}${buildRequestUrl()}`;
    if (selectedMethod === 'GET') {
      return `curl -X GET "${url}" -H "Accept: application/json"`;
    }
    const body = selectedEndpoint === '/api/v1/contact' ? postContactBody : postProjectBody;
    return `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${body.replace(/\n/g, '')}'`;
  };

  const getFetchSnippet = () => {
    const url = buildRequestUrl();
    if (selectedMethod === 'GET') {
      return `fetch('${url}')\n  .then(res => res.json())\n  .then(data => console.log(data));`;
    }
    const body = selectedEndpoint === '/api/v1/contact' ? postContactBody : postProjectBody;
    return `fetch('${url}', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${body})\n})\n  .then(res => res.json())\n  .then(data => console.log(data));`;
  };

  const copyToClipboard = (text: string, type: 'curl' | 'fetch') => {
    navigator.clipboard.writeText(text);
    if (type === 'curl') {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedFetch(true);
      setTimeout(() => setCopiedFetch(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass p-8 rounded-3xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                RESTful API v1.0 Sandbox
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Server Express
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
              Explorador Interactivo de API RESTful
            </h1>
            <p className="text-gray-400 max-w-2xl text-sm sm:text-base">
              Prueba los endpoints en tiempo real, filtra por categoría, paleta de color dominante, etiquetas creativas, o envía mensajes directos al contacto oficial de Art Sneyder (<strong className="text-white">bogofija@gmail.com</strong> / <strong className="text-white">3118113811</strong>).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="/api/v1/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-gray-200 hover:text-white hover:border-orange-500 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Code2 className="w-4 h-4 text-orange-400" />
              Ver OpenAPI Spec JSON
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Request Console */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Endpoints List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass p-5 rounded-3xl border border-neutral-800 space-y-4">
            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-500" />
              Endpoints Disponibles
            </h2>

            <div className="space-y-2">
              {[
                { path: '/api/v1/projects', label: 'Proyectos & Metadatos Gráficos', method: 'GET' },
                { path: '/api/v1/projects/1', label: 'Detalle de Proyecto (#1)', method: 'GET' },
                { path: '/api/v1/projects', label: 'Crear Proyecto (POST)', method: 'POST' },
                { path: '/api/v1/categories', label: 'Especialidades & Categorías', method: 'GET' },
                { path: '/api/v1/assets', label: 'Assets Multimedia (WebP/SVG)', method: 'GET' },
                { path: '/api/v1/profile', label: 'Perfil Oficial & Contacto', method: 'GET' },
                { path: '/api/v1/experience', label: 'Trayectoria Profesional', method: 'GET' },
                { path: '/api/v1/skills', label: 'Matriz de Habilidades %', method: 'GET' },
                { path: '/api/v1/certifications', label: 'Certificaciones (Platzi/SENA)', method: 'GET' },
                { path: '/api/v1/contact', label: 'Enviar Contacto (POST)', method: 'POST' },
                { path: '/api/v1/health', label: 'Healthcheck de la API', method: 'GET' },
                { path: '/api/v1/docs', label: 'Documentación OpenAPI Spec', method: 'GET' },
              ].map((ep, idx) => {
                const isSelected = selectedEndpoint === ep.path && selectedMethod === ep.method;
                return (
                  <button
                    key={`${ep.path}-${ep.method}-${idx}`}
                    onClick={() => {
                      setSelectedEndpoint(ep.path);
                      setSelectedMethod(ep.method as 'GET' | 'POST');
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 text-white font-medium shadow-md shadow-orange-500/5'
                        : 'bg-neutral-900/50 border-neutral-800/80 text-gray-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <p className="text-xs font-mono font-medium text-gray-200 truncate">{ep.path}</p>
                      <p className="text-[11px] text-gray-500 truncate">{ep.label}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="glass p-5 rounded-3xl border border-neutral-800 space-y-3 text-xs">
            <h3 className="font-heading font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-400" />
              Datos Oficiales en la API
            </h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between items-center py-1 border-b border-neutral-800">
                <span>Email Oficial:</span>
                <span className="font-mono text-white">bogofija@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800">
                <span>WhatsApp / Celular:</span>
                <span className="font-mono text-white">3118113811</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Ubicación:</span>
                <span className="text-white">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Console: Query Controls & Response Viewer */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Request Config Panel */}
          <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-6">
            
            {/* Request Bar */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-2xl">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    selectedMethod === 'GET'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {selectedMethod}
                </span>
                <span className="text-xs font-mono text-gray-300 font-medium truncate">
                  {buildRequestUrl()}
                </span>
              </div>

              <button
                onClick={executeRequest}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 active:scale-95"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                {loading ? 'Ejecutando...' : 'Enviar Request'}
              </button>
            </div>

            {/* GET Query Parameters Filters */}
            {selectedEndpoint === '/api/v1/projects' && selectedMethod === 'GET' && (
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-gray-300">
                  <Filter className="w-3.5 h-3.5 text-orange-500" />
                  Query Parameters de Filtrado Gráfico
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">Categoría</label>
                    <select
                      value={queryParams.category}
                      onChange={(e) => setQueryParams({ ...queryParams, category: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    >
                      <option value="all">Todas</option>
                      <option value="identidad">Identidad Corporativa</option>
                      <option value="uiux">UX/UI</option>
                      <option value="photo">Fotografía</option>
                      <option value="motion">Motion Graphics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Color Dominante (Hex)</label>
                    <input
                      type="text"
                      placeholder="Ej. f97316 o 10b981"
                      value={queryParams.color}
                      onChange={(e) => setQueryParams({ ...queryParams, color: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Búsqueda / Texto</label>
                    <input
                      type="text"
                      placeholder="Ej. BioEssence, Natural, BOGO"
                      value={queryParams.search}
                      onChange={(e) => setQueryParams({ ...queryParams, search: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Tag Creativo</label>
                    <input
                      type="text"
                      placeholder="Ej. Eco-packaging, Dieline"
                      value={queryParams.tag}
                      onChange={(e) => setQueryParams({ ...queryParams, tag: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Solo Destacados</label>
                    <select
                      value={queryParams.featured}
                      onChange={(e) => setQueryParams({ ...queryParams, featured: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    >
                      <option value="false">Todos</option>
                      <option value="true">Solo Featured</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Límite por Página</label>
                    <select
                      value={queryParams.limit}
                      onChange={(e) => setQueryParams({ ...queryParams, limit: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    >
                      <option value="5">5 ítems</option>
                      <option value="10">10 ítems</option>
                      <option value="20">20 ítems</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* POST Body Editor */}
            {selectedMethod === 'POST' && (
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-heading font-semibold text-gray-300">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-orange-500" />
                    Payload JSON (Request Body)
                  </span>
                  <span className="font-mono text-gray-500">application/json</span>
                </div>

                <textarea
                  value={selectedEndpoint === '/api/v1/contact' ? postContactBody : postProjectBody}
                  onChange={(e) => {
                    if (selectedEndpoint === '/api/v1/contact') {
                      setPostContactBody(e.target.value);
                    } else {
                      setPostProjectBody(e.target.value);
                    }
                  }}
                  rows={8}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* Response Panel */}
          <div className="glass p-6 rounded-3xl border border-neutral-800 space-y-4">
            
            {/* Response Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-white uppercase tracking-wider">
                  Respuesta JSON
                </span>

                {responseStatus !== null && (
                  <span
                    className={`px-2.5 py-1 rounded font-mono font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                )}

                {responseTime !== null && (
                  <span className="font-mono text-gray-400">{responseTime} ms</span>
                )}
              </div>

              {/* Code Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(getCurlSnippet(), 'curl')}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-gray-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCurl ? 'Copiado!' : 'cURL'}
                </button>

                <button
                  onClick={() => copyToClipboard(getFetchSnippet(), 'fetch')}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-gray-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
                >
                  {copiedFetch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
                  {copiedFetch ? 'Copiado!' : 'JS Fetch'}
                </button>
              </div>
            </div>

            {/* JSON Response Body Container */}
            <div className="relative rounded-2xl bg-black/90 border border-neutral-800 p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500 gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
                  <span>Consultando servidor Node/Express...</span>
                </div>
              ) : (
                <pre className="text-gray-200 leading-relaxed">
                  {responseData ? JSON.stringify(responseData, null, 2) : '// No hay respuesta aún'}
                </pre>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
