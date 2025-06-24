import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const sections = [
	{
		id: 'getting-started',
		title: 'Getting Started',
		links: [
			{ id: 'account-creation', label: 'Account Creation' },
			{ id: 'profile-setup', label: 'Profile Setup' },
			{ id: 'first-job-swipe', label: 'First Job Swipe' },
		],
	},
	{
		id: 'using-the-app',
		title: 'Using the App',
		links: [
			{ id: 'swiping-jobs', label: 'Swiping for Jobs' },
			{ id: 'filters', label: 'Using Filters' },
			{ id: 'hub', label: 'The Hub' },
		],
	},
	{
		id: 'blockchain',
		title: 'Blockchain & Security',
		links: [
			{ id: 'verification', label: 'Blockchain Verification' },
			{ id: 'privacy', label: 'Privacy & Data' },
		],
	},
	{
		id: 'faq',
		title: 'FAQ',
		links: [
			{ id: 'data-safety', label: 'Is my data safe?' },
			{ id: 'support', label: 'How do I contact support?' },
			{ id: 'mobile', label: 'Can I use Hirly on mobile?' },
		],
	},
];

const toc = [
	{ id: 'getting-started', label: 'Getting Started' },
	{ id: 'using-the-app', label: 'Using the App' },
	{ id: 'blockchain', label: 'Blockchain & Security' },
	{ id: 'faq', label: 'FAQ' },
];

export default function Documentation() {
	const [search, setSearch] = useState('');

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
			<Navigation />
			<div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-20 px-2 md:px-8">
				{/* Sidebar */}
				<aside className="w-full md:w-64 md:sticky md:top-24 flex-shrink-0 mb-8 md:mb-0 h-fit" style={{ alignSelf: 'flex-start' }}>
					<div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-lg mb-6">
						<div className="relative mb-4">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
								<Search className="w-5 h-5" />
							</span>
							<input
								type="text"
								value={search}
								onChange={e => setSearch(e.target.value)}
								placeholder="Search docs..."
								className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow"
								style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
							/>
						</div>
						<nav>
							{sections.map(section => (
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
							WebkitBackdropFilter: 'blur(18px)',
						}}
					>
						<h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6 text-center drop-shadow-[0_0_16px_rgba(168,85,247,0.7)] animate-glow">
							Documentation
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
						{/* Main Documentation Sections */}
						<section id="getting-started" className="mb-10">
							<h2 className="text-2xl font-bold text-purple-200 mb-2">Getting Started</h2>
							<div id="account-creation" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Account Creation</h3>
								<p className="text-gray-200 text-sm">Sign up with your email, Google, or GitHub account. Verify your email address to activate your account. Complete your profile for better job matches.</p>
							</div>
							<div id="profile-setup" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Profile Setup</h3>
								<p className="text-gray-200 text-sm">Add your work experience, education, and skills to improve your job recommendations.</p>
							</div>
							<div id="first-job-swipe">
								<h3 className="text-lg font-semibold text-white">First Job Swipe</h3>
								<p className="text-gray-200 text-sm">Start swiping on jobs that interest you. Swipe right to apply, left to skip.</p>
							</div>
						</section>
						<section id="using-the-app" className="mb-10">
							<h2 className="text-2xl font-bold text-purple-200 mb-2">Using the App</h2>
							<div id="swiping-jobs" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Swiping for Jobs</h3>
								<p className="text-gray-200 text-sm">Browse job listings and swipe to apply or skip. Use filters to narrow down your search.</p>
							</div>
							<div id="filters" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Using Filters</h3>
								<p className="text-gray-200 text-sm">Filter jobs by type, location, and more to find the best matches.</p>
							</div>
							<div id="hub">
								<h3 className="text-lg font-semibold text-white">The Hub</h3>
								<p className="text-gray-200 text-sm">Track your applications, interviews, and offers in one place.</p>
							</div>
						</section>
						<section id="blockchain" className="mb-10">
							<h2 className="text-2xl font-bold text-purple-200 mb-2">Blockchain & Security</h2>
							<div id="verification" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Blockchain Verification</h3>
								<p className="text-gray-200 text-sm">All job postings are verified on the Algorand blockchain for authenticity.</p>
							</div>
							<div id="privacy">
								<h3 className="text-lg font-semibold text-white">Privacy & Data</h3>
								<p className="text-gray-200 text-sm">Your profile and application data are encrypted and securely stored.</p>
							</div>
						</section>
						<section id="faq" className="mb-10">
							<h2 className="text-2xl font-bold text-purple-200 mb-2">FAQ</h2>
							<div id="data-safety" className="mb-2">
								<h3 className="text-lg font-semibold text-white">Is my data safe?</h3>
								<p className="text-gray-200 text-sm">Yes! Hirly uses blockchain technology and encryption to keep your data secure and private.</p>
							</div>
							<div id="support" className="mb-2">
								<h3 className="text-lg font-semibold text-white">How do I contact support?</h3>
								<p className="text-gray-200 text-sm">Visit the Help Center or use the "Contact Support" button for assistance.</p>
							</div>
							<div id="mobile">
								<h3 className="text-lg font-semibold text-white">Can I use Hirly on mobile?</h3>
								<p className="text-gray-200 text-sm">Mobile apps are coming soon! Stay tuned for updates on the App Store and Google Play.</p>
							</div>
						</section>
					</motion.div>
				</main>
			</div>
			<Footer />
		</div>
	);
}
