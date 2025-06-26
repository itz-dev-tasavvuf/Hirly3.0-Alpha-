import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const apiSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    links: [
      { id: 'overview', label: 'API Overview' },
      { id: 'auth', label: 'Authentication' },
    ],
  },
  {
    id: 'endpoints',
    title: 'Endpoints',
    links: [
      { id: 'get-jobs', label: 'GET /jobs' },
      { id: 'post-job', label: 'POST /jobs' },
      { id: 'get-profile', label: 'GET /profile' },
      { id: 'update-profile', label: 'PUT /profile' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    links: [
      { id: 'curl', label: 'cURL Example' },
      { id: 'js', label: 'JavaScript Example' },
    ],
  },
];

const toc = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'examples', label: 'Examples' },
];

export default function API() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-20 px-2 md:px-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 md:sticky md:top-24 flex-shrink-0 mb-8 md:mb-0 h-fit" style={{alignSelf: 'flex-start'}}>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-lg mb-6">
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search API docs..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow"
                style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}
              />
            </div>
            <nav>
              {apiSections.map(section => (
                <div key={section.id} className="mb-4">
                  <div className="text-xs font-bold text-purple-200 uppercase mb-2 tracking-wider">{section.title}</div>
                  <ul className="space-y-1">
                    {section.links.map(link => (
                      <li key={link.id}>
                        <a
                          href={`#${link.id}`}
                          className="block text-gray-200 hover:text-purple-400 text-sm px-2 py-1 rounded transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 md:ml-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-8 mb-8"
            style={{
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6 text-center drop-shadow-[0_0_16px_rgba(168,85,247,0.7)] animate-glow">
              API Reference
            </h1>
            {/* Table of Contents */}
            <div className="mb-8 flex flex-wrap gap-4 justify-center md:justify-start">
              {toc.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-purple-200 hover:text-white bg-purple-700/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            {/* Main API Sections */}
            <section id="introduction" className="mb-10">
              <h2 className="text-2xl font-bold text-purple-200 mb-2">Introduction</h2>
              <div id="overview" className="mb-2">
                <h3 className="text-lg font-semibold text-white">API Overview</h3>
                <p className="text-gray-200 text-sm">The Hirly API allows you to access job listings, user profiles, and more. All endpoints are RESTful and return JSON.</p>
              </div>
              <div id="auth">
                <h3 className="text-lg font-semibold text-white">Authentication</h3>
                <p className="text-gray-200 text-sm">Authenticate using your API key in the <code className="bg-purple-900/40 px-1 rounded">Authorization</code> header. Example: <code className="bg-purple-900/40 px-1 rounded">Bearer YOUR_API_KEY</code></p>
              </div>
            </section>
            <section id="endpoints" className="mb-10">
              <h2 className="text-2xl font-bold text-purple-200 mb-2">Endpoints</h2>
              <div id="get-jobs" className="mb-2">
                <h3 className="text-lg font-semibold text-white">GET /jobs</h3>
                <p className="text-gray-200 text-sm">Retrieve a list of job postings.</p>
                <pre className="bg-black/40 text-green-200 rounded p-3 text-xs overflow-x-auto mb-2">GET https://api.hirly.com/jobs</pre>
              </div>
              <div id="post-job" className="mb-2">
                <h3 className="text-lg font-semibold text-white">POST /jobs</h3>
                <p className="text-gray-200 text-sm">Create a new job posting. Requires authentication.</p>
                <pre className="bg-black/40 text-green-200 rounded p-3 text-xs overflow-x-auto mb-2">POST https://api.hirly.com/jobs</pre>
              </div>
              <div id="get-profile" className="mb-2">
                <h3 className="text-lg font-semibold text-white">GET /profile</h3>
                <p className="text-gray-200 text-sm">Get the authenticated user's profile.</p>
                <pre className="bg-black/40 text-green-200 rounded p-3 text-xs overflow-x-auto mb-2">GET https://api.hirly.com/profile</pre>
              </div>
              <div id="update-profile">
                <h3 className="text-lg font-semibold text-white">PUT /profile</h3>
                <p className="text-gray-200 text-sm">Update the authenticated user's profile.</p>
                <pre className="bg-black/40 text-green-200 rounded p-3 text-xs overflow-x-auto mb-2">PUT https://api.hirly.com/profile</pre>
              </div>
            </section>
            <section id="examples" className="mb-10">
              <h2 className="text-2xl font-bold text-purple-200 mb-2">Examples</h2>
              <div id="curl" className="mb-2">
                <h3 className="text-lg font-semibold text-white">cURL Example</h3>
                <pre className="bg-black/40 text-blue-200 rounded p-3 text-xs overflow-x-auto mb-2">curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hirly.com/jobs</pre>
              </div>
              <div id="js">
                <h3 className="text-lg font-semibold text-white">JavaScript Example</h3>
                <pre className="bg-black/40 text-yellow-200 rounded p-3 text-xs overflow-x-auto mb-2">{`
fetch('https://api.hirly.com/jobs', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
  .then(res => res.json())
  .then(data => console.log(data));
`}</pre>
              </div>
            </section>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
