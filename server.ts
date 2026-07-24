import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PROFILE,
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_ASSETS,
  INITIAL_EXPERIENCE,
  INITIAL_SKILLS,
  INITIAL_CERTIFICATIONS,
} from './src/data/portfolioData';
import {
  GraphicProject,
  GraphicAsset,
  ContactSubmission,
  EndpointDoc,
} from './src/types';

// In-Memory Database collections
let profileData = { ...INITIAL_PROFILE };
let categoriesData = [...INITIAL_CATEGORIES];
let projectsData: GraphicProject[] = [...INITIAL_PROJECTS];
let assetsData: GraphicAsset[] = [...INITIAL_ASSETS];
let experienceData = [...INITIAL_EXPERIENCE];
let skillsData = [...INITIAL_SKILLS];
let certificationsData = [...INITIAL_CERTIFICATIONS];
let contactSubmissions: ContactSubmission[] = [];

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom API Logging & CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // Cache headers for static API queries
  if (req.method === 'GET' && req.path.startsWith('/api/v1')) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  }

  next();
});

// API ROUTE PREFIX
const apiRouter = express.Router();

// 1. HEALTHCHECK
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: 'v1.0.0',
    service: 'Art Sneyder Portfolio REST API',
    architect: 'Art Sneyder (Sneyder Riaño Hernández)',
    contact: {
      email: profileData.email,
      phone: profileData.phone_formatted,
      whatsapp: profileData.whatsapp_number,
    },
  });
});

// 2. PROFILE & CONTACT INFO
apiRouter.get('/profile', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: profileData,
    meta: {
      timestamp: new Date().toISOString(),
      official_email: 'bogofija@gmail.com',
      official_celular: '3118113811',
    },
  });
});

// 3. PROJECTS ENDPOINTS
apiRouter.get('/projects', (req: Request, res: Response) => {
  const { category, color, tag, search, featured, page = '1', limit = '20', sort = 'newest' } = req.query;

  let filtered = [...projectsData];

  // Category filter
  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase() || p.slug.includes(category)
    );
  }

  // Dominant Color filter
  if (color && typeof color === 'string') {
    const cleanColor = color.toLowerCase().replace('#', '');
    filtered = filtered.filter(
      (p) =>
        p.dominant_color.toLowerCase().includes(cleanColor) ||
        p.color_palette.hex_list.some((h) => h.toLowerCase().includes(cleanColor))
    );
  }

  // Tag filter
  if (tag && typeof tag === 'string') {
    filtered = filtered.filter((p) =>
      p.tags_creativos.some((t) => t.toLowerCase().includes((tag as string).toLowerCase()))
    );
  }

  // Search query filter
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.client_brand.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.long_description && p.long_description.toLowerCase().includes(q)) ||
        p.tools.some((t) => t.toLowerCase().includes(q)) ||
        p.tags_creativos.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Featured filter
  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured === true);
  }

  // Sorting
  if (sort === 'popular') {
    filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default newest
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Pagination
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedProjects = filtered.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    data: paginatedProjects,
    meta: {
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      total_pages: Math.ceil(filtered.length / limitNum),
      filtered_by: {
        category: category || 'all',
        color: color || null,
        tag: tag || null,
        search: search || null,
        featured: featured || null,
      },
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.get('/projects/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  const project = projectsData.find(
    (p) => p.id.toString() === param || p.slug === param
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Proyecto no encontrado',
      requested_param: param,
    });
  }

  // Increment view counter
  project.views_count = (project.views_count || 0) + 1;

  // Fetch associated assets
  const projectAssets = assetsData.filter((a) => a.project_id === project.id);

  res.json({
    success: true,
    data: {
      ...project,
      assets: projectAssets,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.post('/projects', (req: Request, res: Response) => {
  const { title, category, categoryLabel, client_brand, year, desc, long_description, dominant_color, tools, tags_creativos } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      success: false,
      error: 'Campos requeridos faltantes: title y category son obligatorios.',
    });
  }

  const newId = projectsData.length > 0 ? Math.max(...projectsData.map((p) => p.id)) + 1 : 1;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProject: GraphicProject = {
    id: newId,
    title,
    slug,
    category: category || 'identidad',
    categoryLabel: categoryLabel || 'Identidad Corporativa',
    client_brand: client_brand || 'Marca Cliente',
    year: year || new Date().getFullYear().toString(),
    desc: desc || '',
    long_description: long_description || desc || '',
    dominant_color: dominant_color || '#f97316',
    color_palette: {
      primary: dominant_color || '#f97316',
      accent: '#ea580c',
      dominant: '#000000',
      secondary: '#171717',
      neutral_dark: '#0a0a0a',
      hex_list: [dominant_color || '#f97316', '#000000', '#171717', '#ffffff'],
    },
    aspect_ratio: '4:3',
    dimensions: { width: 1200, height: 900 },
    blur_placeholder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDMiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNmOTczMTYiLz48L3N2Zz4=',
    high_res_url: 'https://i.ibb.co/5x9VR7fJ/1.jpg',
    thumbnail_url: 'https://i.ibb.co/5x9VR7fJ/1.jpg',
    img: 'https://i.ibb.co/5x9VR7fJ/1.jpg',
    tags_creativos: tags_creativos || ['Nuevo Proyecto', 'Diseño'],
    tools: tools || ['Illustrator', 'Photoshop'],
    featured: false,
    views_count: 1,
    created_at: new Date().toISOString(),
  };

  projectsData.unshift(newProject);

  res.status(201).json({
    success: true,
    message: 'Proyecto creado exitosamente en la base de datos de la API.',
    data: newProject,
  });
});

apiRouter.put('/projects/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const index = projectsData.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
  }

  projectsData[index] = {
    ...projectsData[index],
    ...req.body,
    id, // Keep immutable ID
  };

  res.json({
    success: true,
    message: `Proyecto #${id} actualizado correctamente.`,
    data: projectsData[index],
  });
});

apiRouter.delete('/projects/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const initialLen = projectsData.length;
  projectsData = projectsData.filter((p) => p.id !== id);

  if (projectsData.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
  }

  res.json({
    success: true,
    message: `Proyecto #${id} eliminado satisfactoriamente.`,
  });
});

// 4. CATEGORIES
apiRouter.get('/categories', (req: Request, res: Response) => {
  // Dynamically compute category counts
  const computedCategories = categoriesData.map((cat) => {
    const count = projectsData.filter((p) => p.category === cat.slug).length;
    return { ...cat, project_count: count };
  });

  res.json({
    success: true,
    data: computedCategories,
    meta: {
      total: computedCategories.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// 5. ASSETS (MEDIA FILES METADATA)
apiRouter.get('/assets', (req: Request, res: Response) => {
  const { project_id, format, role, aspect_ratio } = req.query;

  let filtered = [...assetsData];

  if (project_id) {
    filtered = filtered.filter((a) => a.project_id === parseInt(project_id as string, 10));
  }

  if (format && typeof format === 'string') {
    filtered = filtered.filter((a) => a.format.toLowerCase() === format.toLowerCase());
  }

  if (role && typeof role === 'string') {
    filtered = filtered.filter((a) => a.role.toLowerCase() === role.toLowerCase());
  }

  if (aspect_ratio && typeof aspect_ratio === 'string') {
    filtered = filtered.filter((a) => a.aspect_ratio === aspect_ratio);
  }

  res.json({
    success: true,
    data: filtered,
    meta: {
      total: filtered.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// 6. EXPERIENCE
apiRouter.get('/experience', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: experienceData,
    meta: {
      total: experienceData.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// 7. SKILLS
apiRouter.get('/skills', (req: Request, res: Response) => {
  const { category, is_primary } = req.query;

  let filtered = [...skillsData];

  if (category && typeof category === 'string') {
    filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (is_primary === 'true') {
    filtered = filtered.filter((s) => s.is_primary === true);
  }

  res.json({
    success: true,
    data: filtered,
    meta: {
      total: filtered.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// 8. CERTIFICATIONS & EDUCATION
apiRouter.get('/certifications', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: certificationsData,
    meta: {
      base_degree: profileData.base_education,
      current_focus: profileData.current_focus,
      total_certs: certificationsData.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// 9. CONTACT FORM SUBMISSION
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, company, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Validación fallida: Nombre, Correo Electrónico y Mensaje son obligatorios.',
    });
  }

  const newSubmission: ContactSubmission = {
    id: `cont_${Date.now()}`,
    name,
    company: company || 'No especificada',
    email,
    phone: phone || 'No proporcionado',
    message,
    created_at: new Date().toISOString(),
    status: 'received',
    mailto_link: `mailto:${profileData.email}?subject=${encodeURIComponent(
      `Contacto Portafolio API - ${name}`
    )}&body=${encodeURIComponent(
      `Nombre: ${name}\nEmpresa: ${company || 'N/A'}\nCorreo: ${email}\nTeléfono: ${
        phone || 'N/A'
      }\n\nMensaje:\n${message}`
    )}`,
    whatsapp_link: `https://api.whatsapp.com/send?phone=${
      profileData.whatsapp_number
    }&text=${encodeURIComponent(
      `Hola Sneyder! Mi nombre es *${name}*` +
        (company ? ` de la empresa *${company}*` : '') +
        `.\n\nTe escribo desde la API del Portafolio sobre:\n"${message}"\n\nMis datos:\n- Correo: ${email}\n- Teléfono: ${
          phone || 'N/A'
        }`
    )}`,
  };

  contactSubmissions.unshift(newSubmission);

  res.status(201).json({
    success: true,
    message: 'Mensaje recibido exitosamente por el servidor de Art Sneyder.',
    data: newSubmission,
    official_contacts: {
      email: profileData.email,
      phone: profileData.phone_formatted,
      whatsapp_direct: newSubmission.whatsapp_link,
      mailto_direct: newSubmission.mailto_link,
    },
  });
});

// 10. OPENAPI / SWAGGER-LIKE DOCS
apiRouter.get('/docs', (req: Request, res: Response) => {
  const endpoints: EndpointDoc[] = [
    {
      method: 'GET',
      path: '/api/v1/health',
      description: 'Estado de salud de la API, uptime y versión.',
      example_response: { status: 'healthy', uptime: 120.5, version: 'v1.0.0' },
    },
    {
      method: 'GET',
      path: '/api/v1/profile',
      description: 'Obtiene el perfil oficial de Art Sneyder, credenciales de contacto y marcas de Familia BOGO.',
      example_response: {
        success: true,
        data: {
          name: profileData.name,
          email: 'bogofija@gmail.com',
          phone: '3118113811',
          whatsapp_number: '573118113811',
        },
      },
    },
    {
      method: 'GET',
      path: '/api/v1/projects',
      description: 'Listado de proyectos de diseño gráfico con metadatos visuales (colores dominantes, aspect ratio, tags).',
      query_params: [
        { name: 'category', type: 'string', description: 'Filtrar por categoría (identidad, uiux, photo, motion)' },
        { name: 'color', type: 'string', description: 'Filtrar por código Hex o color dominante' },
        { name: 'tag', type: 'string', description: 'Filtrar por etiqueta creativa' },
        { name: 'search', type: 'string', description: 'Búsqueda de texto completo en títulos, clientes o herramientas' },
        { name: 'featured', type: 'boolean', description: 'Mostrar solo proyectos destacados' },
        { name: 'page', type: 'number', description: 'Número de página' },
        { name: 'limit', type: 'number', description: 'Límite de resultados por página' },
      ],
      example_response: { success: true, data: [projectsData[0]] },
    },
    {
      method: 'GET',
      path: '/api/v1/projects/:idOrSlug',
      description: 'Obtiene el detalle completo de un proyecto y sus assets multimedia vinculados.',
      example_response: { success: true, data: projectsData[0] },
    },
    {
      method: 'POST',
      path: '/api/v1/projects',
      description: 'Crea un nuevo proyecto en la base de datos de la API.',
      body_schema: { title: 'string (required)', category: 'string (required)', client_brand: 'string', desc: 'string' },
      example_response: { success: true, message: 'Proyecto creado exitosamente' },
    },
    {
      method: 'GET',
      path: '/api/v1/categories',
      description: 'Obtiene la lista de especialidades de diseño y contadores de proyectos.',
      example_response: { success: true, data: categoriesData },
    },
    {
      method: 'GET',
      path: '/api/v1/assets',
      description: 'Listado de metadatos de archivos multimedia (WebP, PNG, SVG, JPG, MP4).',
      query_params: [
        { name: 'project_id', type: 'number', description: 'Filtrar por ID del proyecto' },
        { name: 'format', type: 'string', description: 'Formato de archivo (webp, png, svg)' },
        { name: 'role', type: 'string', description: 'Rol visual (cover, dieline, render_3d, prepress)' },
      ],
      example_response: { success: true, data: assetsData },
    },
    {
      method: 'GET',
      path: '/api/v1/experience',
      description: 'Obtiene la trayectoria profesional detallada de Art Sneyder.',
      example_response: { success: true, data: experienceData },
    },
    {
      method: 'GET',
      path: '/api/v1/skills',
      description: 'Obtiene la matriz de habilidades técnicas y software dominado con porcentajes.',
      example_response: { success: true, data: skillsData },
    },
    {
      method: 'GET',
      path: '/api/v1/certifications',
      description: 'Obtiene las certificaciones recientes (Platzi, SENA, Gemini, n8n, Claude).',
      example_response: { success: true, data: certificationsData },
    },
    {
      method: 'POST',
      path: '/api/v1/contact',
      description: 'Envía un mensaje de contacto e interactúa directamente con WhatsApp (3118113811) y correo (bogofija@gmail.com).',
      body_schema: { name: 'string', email: 'string', message: 'string', phone: 'string (optional)' },
      example_response: { success: true, message: 'Mensaje recibido exitosamente' },
    },
  ];

  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Art Sneyder Portfolio & Creative Design REST API',
      version: '1.0.0',
      description:
        'API RESTful profesional para consultar portafolio, metadatos gráficos, colores dominantes, empaques, marcas y credenciales de contacto de Art Sneyder (Sneyder Riaño Hernández).',
      contact: {
        name: 'Art Sneyder',
        email: 'bogofija@gmail.com',
        phone: '3118113811',
      },
    },
    endpoints,
  });
});

// MOUNT ROUTER AT /api/v1
app.use('/api/v1', apiRouter);

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Art Sneyder API Server running on http://localhost:${PORT}`);
    console.log(`API Docs live at http://localhost:${PORT}/api/v1/docs`);
    console.log(`Healthcheck at http://localhost:${PORT}/api/v1/health`);
  });
}

startServer();
