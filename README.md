# NodeScape

A powerful interactive graph editor built with Next.js, React Flow, and Express. Create, edit, and manage visual workflows with drag-and-drop nodes, smart auto-linking, and persistent storage.

## ✨ Features

- **Interactive Graph Editor**: Drag-and-drop nodes, connect with edges, zoom, pan
- **Full CRUD Operations**: Create, read, update, delete nodes and edges
- **Persistent Storage**: Save and load maps with in-memory + file storage
- **Smart Auto-Linking**: Auto-connect nodes with intelligent workflow patterns
- **Export/Import**: Export as PNG images or JSON, import from JSON files
- **Modern UI**: Clean, borderless node design with distinct visual types
- **Real-time Updates**: Live editing with immediate visual feedback
- **Map Management**: Save multiple maps, load from dropdown selector

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd NodeScape
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
NodeScape/
├── components/
│   └── MapEditor.js          # React Flow component for graph editing
├── lib/
│   ├── api.js                # API utility functions
│   └── database.js           # In-memory + file storage database
├── pages/
│   ├── api/
│   │   └── maps/
│   │       ├── index.js      # GET /api/maps, POST /api/maps
│   │       └── [id].js       # GET/PUT/DELETE /api/maps/:id
│   ├── _app.js               # Next.js app wrapper with React Flow provider
│   ├── _document.js          # Next.js document structure
│   └── index.js              # Main page
├── styles/
│   └── globals.css           # Global styles including React Flow styling
├── data/
│   └── maps.json             # Persistent map storage
├── package.json              # Dependencies and scripts
└── next.config.js            # Next.js configuration
```

## 🛠️ Usage

### Creating and Editing Maps

1. **Add Nodes**: Click "Add Node" to create different node types (Input, Default, Output)
2. **Connect Nodes**: Drag from node handles to create connections
3. **Edit Labels**: Double-click node labels to edit them
4. **Auto-Link**: Use smart auto-linking to connect nodes automatically
5. **Save Maps**: Click "Save Map" to persist your work
6. **Load Maps**: Use the dropdown to select and load saved maps

### Keyboard Shortcuts

- **Delete**: Select nodes/edges and press Delete key
- **Zoom**: Mouse wheel or trackpad gestures
- **Pan**: Click and drag on empty space

## 📡 API Reference

### Maps API

#### Get All Maps

```javascript
GET /api/maps

// Response
{
  "maps": [
    {
      "id": "map-1",
      "name": "My Workflow",
      "nodes": [...],
      "edges": [...],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "userId": "user-123"
    }
  ]
}
```

#### Create New Map

```javascript
POST /api/maps
Content-Type: application/json

{
  "name": "New Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "input",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Start" }
    }
  ],
  "edges": []
}

// Response
{
  "id": "map-2",
  "name": "New Workflow",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "userId": "user-123"
}
```

#### Get Specific Map

```javascript
GET /api/maps/map-1

// Response
{
  "id": "map-1",
  "name": "My Workflow",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "userId": "user-123"
}
```

#### Update Map

```javascript
PUT /api/maps/map-1
Content-Type: application/json

{
  "name": "Updated Workflow",
  "nodes": [...],
  "edges": [...]
}
```

#### Delete Map

```javascript
DELETE /api/maps/map-1

// Response
{
  "message": "Map deleted successfully"
}
```

### Example Usage with fetch

```javascript
// Create a new map
const createMap = async (mapData) => {
  const response = await fetch('/api/maps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapData),
  })
  return response.json()
}

// Load a map
const loadMap = async (mapId) => {
  const response = await fetch(`/api/maps/${mapId}`)
  return response.json()
}

// Update a map
const updateMap = async (mapId, mapData) => {
  const response = await fetch(`/api/maps/${mapId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapData),
  })
  return response.json()
}
```

## 🚀 Deployment

### Recommended Deployment Stack

#### Frontend (Next.js)

**Vercel** (Recommended)

- Seamless Next.js integration
- Automatic deployments from Git
- Built-in CDN and serverless functions

```bash
# Deploy to Vercel
npm install -g vercel
vercel
```

#### Alternative Frontend Platforms

- **Netlify**: Great for static sites with serverless functions
- **Railway**: Full-stack deployment platform
- **Render**: Simple cloud platform

#### Backend/Database Options

Since NodeScape currently uses file-based storage, for production you should consider:

**Option 1: Serverless with Vercel**

- Use Vercel's serverless functions (current setup)
- Add a database like PlanetScale (MySQL) or Supabase (PostgreSQL)

**Option 2: Traditional Server**

- **Railway**: Deploy with database included
- **Render**: Web service + PostgreSQL
- **Heroku**: Dyno + Heroku Postgres

### Production Environment Variables

Create a `.env.local` file:

```env
# Database connection (when you add a real database)
DATABASE_URL=your_database_url

# Optional: Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Optional: File storage
STORAGE_TYPE=file # or 'database' for production
```

### Build and Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod
```

## 🔧 Available Scripts

- `GET /api/maps/:id` - Get a specific map
- `PUT /api/maps/:id` - Update a specific map
- `DELETE /api/maps/:id` - Delete a specific map

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🧪 Technologies Used

- **Next.js 13+** - React framework with App Router
- **React Flow** - Interactive graph/node editor
- **React** - UI library
- **CSS3** - Modern styling with CSS variables
- **Node.js** - Runtime environment
- **File System** - JSON-based persistent storage

## 👤 User Management (Mock Implementation)

Currently, NodeScape uses a mock user system for development:

- **Mock User ID**: `user-123`
- **Map Ownership**: All maps are associated with the mock user
- **No Authentication**: Ready for auth integration

### Adding Real Authentication

To implement real user authentication:

1. **Install NextAuth.js**:

   ```bash
   npm install next-auth
   ```

2. **Add providers** (Google, GitHub, etc.):

   ```javascript
   // pages/api/auth/[...nextauth].js
   import NextAuth from 'next-auth'
   import GoogleProvider from 'next-auth/providers/google'

   export default NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       }),
     ],
   })
   ```

3. **Update API routes** to use real user sessions

## 🔮 Future Features & Roadmap

### 🔐 Authentication & User Management

- [ ] **User Authentication**: OAuth with Google, GitHub, email/password
- [ ] **User Profiles**: Custom avatars, preferences, settings
- [ ] **Team Workspaces**: Organize maps by teams/organizations
- [ ] **Role-based Access**: Admin, Editor, Viewer permissions

### 🤝 Collaboration Features

- [ ] **Real-time Collaboration**: Multiple users editing simultaneously
- [ ] **Live Cursors**: See other users' cursors and selections
- [ ] **Comments & Annotations**: Add comments to nodes and edges
- [ ] **Share Links**: Public/private sharing with access controls

### 📚 Version Control & History

- [ ] **Version History**: Track changes with timestamps
- [ ] **Branching**: Create alternative versions of workflows
- [ ] **Diff Viewer**: Compare different versions visually
- [ ] **Restore Points**: Revert to previous states

### 🎨 Advanced Editing

- [ ] **Custom Node Types**: Create reusable node templates
- [ ] **Node Groups**: Group related nodes together
- [ ] **Minimap**: Overview of large workflows
- [ ] **Grid Snapping**: Align nodes to grid
- [ ] **Keyboard Shortcuts**: Power user shortcuts

### 🔧 Workflow Execution

- [ ] **Workflow Runner**: Execute workflows step-by-step
- [ ] **API Integrations**: Connect to external services
- [ ] **Conditional Logic**: If/else branching in workflows
- [ ] **Data Transformation**: Process data between nodes

### 📊 Analytics & Insights

- [ ] **Usage Analytics**: Track workflow usage patterns
- [ ] **Performance Metrics**: Monitor workflow execution times
- [ ] **Error Tracking**: Log and analyze workflow failures
- [ ] **Optimization Suggestions**: AI-powered workflow improvements

### 🌍 Enterprise Features

- [ ] **Single Sign-On (SSO)**: SAML, LDAP integration
- [ ] **Audit Logs**: Track all user actions
- [ ] **Data Governance**: Compliance and security controls
- [ ] **White-label**: Custom branding options

### 🎯 Developer Experience

- [ ] **API Documentation**: Interactive API explorer
- [ ] **Webhook Support**: Real-time event notifications
- [ ] **Plugin System**: Extend functionality with custom plugins
- [ ] **GraphQL API**: Alternative to REST API

### 📱 Mobile & Accessibility

- [ ] **Mobile App**: React Native mobile version
- [ ] **Responsive Design**: Better mobile web experience
- [ ] **Accessibility**: WCAG compliance, screen reader support
- [ ] **Offline Mode**: Work without internet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Demo**: [Your deployed app URL]
- **Documentation**: [Your docs URL]
- **Issues**: [GitHub Issues URL]
- **Discussions**: [GitHub Discussions URL]
