"use client";

import { useRouter } from "next/navigation";
import { usePaper } from "../context/PaperContext";
import { useEffect, useState } from "react";
import { Menu, ActionIcon } from "@mantine/core";
import { IconSun, IconMoonStars, IconStars } from "@tabler/icons-react";
import "../styles/stars.css";

type CustomColorScheme = "light" | "dark" | "stars";

interface PaperData {
	paper_id: string;
	title: string;
	authors: string[];
	abstract: string;
	publication_year: number;
	keywords: string[];
	citations_count: number;
	pdf_url: string;
	sections?: {
		title: string;
		paragraphs: {
			paragraphNum: number;
			content: string;
		}[];
	}[];
}

const ViewerPage = () => {
	const router = useRouter();
	const { paperId } = usePaper();
	const [paperData, setPaperData] = useState<PaperData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeSection, setActiveSection] = useState<string>("");
	const [theme, setTheme] = useState<CustomColorScheme>("light");

	// Handle navigation when paperId is not available
	useEffect(() => {
		if (!paperId) {
			router.push("/");
		}
	}, [paperId, router]);

	// Handle paper data fetching
	useEffect(() => {
		const fetchPaperData = async () => {
			if (!paperId) return;

			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`http://localhost:8001/api/papers/${paperId}`
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch paper data: ${response.statusText}`);
				}

				const data = await response.json();
				console.log(data);
				setPaperData(data.paper);
				// Set the first section as active by default
				if (data.paper.sections?.[0]) {
					setActiveSection(data.paper.sections[0].title);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch paper data"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPaperData();
	}, [paperId]);

	// Return early if no paperId
	if (!paperId) {
		return null;
	}

	const scrollToSection = (sectionTitle: string) => {
		const element = document.getElementById(`section-${sectionTitle}`);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			setActiveSection(sectionTitle);
		}
	};

	const ThemeSwitcher = () => (
		<Menu shadow="md" width={200}>
			<Menu.Target>
				<ActionIcon size="lg" variant="light" radius="md">
					{theme === "light" && <IconSun size={20} />}
					{theme === "dark" && <IconMoonStars size={20} />}
					{theme === "stars" && <IconStars size={20} />}
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Theme</Menu.Label>
				<Menu.Item
					leftSection={<IconSun size={14} />}
					onClick={() => setTheme("light")}
				>
					Light
				</Menu.Item>
				<Menu.Item
					leftSection={<IconMoonStars size={14} />}
					onClick={() => setTheme("dark")}
				>
					Dark
				</Menu.Item>
				<Menu.Item
					leftSection={<IconStars size={14} />}
					onClick={() => setTheme("stars")}
				>
					Stars
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);

	// Add theme class to body
	// useEffect(() => {
	// 	document.body.className = theme;
	// 	if (theme === "stars") {
	// 		// document.body.classList.add("bg-gray-950");
	// 	} else {
	// 		document.body.classList.remove("bg-gray-950");
	// 	}
	// }, [theme]);

	if (loading) {
		return (
			<div className="min-h-screen bg-white p-8">
				<div className="max-w-6xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
						<div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-4/6"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white p-8">
				<div className="max-w-6xl mx-auto">
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
						<p className="text-red-600">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!paperData) {
		return (
			<div className="min-h-screen bg-white p-8">
				<div className="max-w-6xl mx-auto">
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<p className="text-yellow-700">No paper data available.</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen">
			{/* Stars Background - Move to back */}
			{theme === "stars" && (
				<div className="fixed inset-0 z-0">
					<div className="absolute inset-0 bg-gray-950">
						<div className="stars"></div>
					</div>
				</div>
			)}

			{/* Main content wrapper - Ensure it's above stars */}
			<div
				className={`relative z-10 min-h-screen flex ${
					theme === "dark"
						? "bg-gray-900/95"
						: theme === "stars"
						? "bg-transparent"
						: "bg-white"
				}`}
			>
				{/* Theme Switcher - Highest z-index */}
				<div className="fixed top-4 right-4 z-50">
					<ThemeSwitcher />
				</div>

				{/* Left Sidebar - High z-index */}
				<aside
					className={`w-64 h-screen fixed left-0 z-40 ${
						theme === "dark"
							? "bg-gray-900 border-gray-700 text-gray-100"
							: theme === "stars"
							? "bg-gray-900/10 border-gray-700 text-gray-100 backdrop-blur-sm"
							: "bg-white border-gray-200 text-gray-900"
					}`}
				>
					<div className="h-full overflow-y-auto p-6">
						<div className="mb-6">
							<h3
								className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
									theme === "light" ? "text-gray-600" : "text-gray-400"
								}`}
							>
								Sections
							</h3>
							<nav className="space-y-1">
								<button
									onClick={() => scrollToSection("Abstract")}
									className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										activeSection === "Abstract"
											? theme === "light"
												? "bg-blue-50 text-blue-700"
												: "bg-blue-900/50 text-blue-300"
											: theme === "light"
											? "text-gray-700 hover:bg-gray-50"
											: "text-gray-300 hover:bg-gray-800/50"
									}`}
								>
									Abstract
								</button>
								{paperData.sections?.map((section) => (
									<button
										key={section.title}
										onClick={() => scrollToSection(section.title)}
										className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
											activeSection === section.title
												? theme === "light"
													? "bg-blue-50 text-blue-700"
													: theme === "stars"
													? "bg-gray-900/50 text-blue-300"
													: "bg-blue-900/50 text-blue-300"
												: theme === "light"
												? "text-gray-700 hover:bg-gray-50"
												: theme === "stars"
												? "text-gray-300 hover:bg-gray-800/50"
												: "text-gray-300 hover:bg-gray-800/50"
										}`}
									>
										{section.title}
									</button>
								))}
							</nav>
						</div>
						<div
							className={`pt-4 border-t ${
								theme === "light" ? "border-gray-200" : "border-gray-700"
							}`}
						>
							<a
								href={paperData.pdf_url}
								target="_blank"
								rel="noopener noreferrer"
								className={`block w-full text-center px-4 py-2 rounded-lg transition-colors ${
									theme === "light"
										? "bg-blue-600 hover:bg-blue-700 text-white"
										: "bg-blue-500/80 hover:bg-blue-600/80 text-white backdrop-blur-sm"
								}`}
							>
								View PDF
							</a>
							<div
								className={`mt-4 text-center text-sm ${
									theme === "light" ? "text-gray-600" : "text-gray-400"
								}`}
							>
								Citations: {paperData.citations_count.toLocaleString()}
							</div>
						</div>
					</div>
				</aside>

				{/* Main Content Container - Add left margin to account for fixed sidebar */}
				<main className="flex-1 ml-64">
					<div className="flex justify-center">
						{/* Main Content */}
						<div
							className={`max-w-4xl w-full p-8 relative ${
								theme === "stars" ? "z-20" : ""
							}`}
						>
							<h1
								className={`text-3xl font-bold mb-4 ${
									theme === "light" ? "text-gray-900" : "text-white"
								}`}
							>
								{paperData.title}
							</h1>

							<div className="mb-6">
								<p
									className={`mb-2 ${
										theme === "light" ? "text-gray-600" : "text-gray-400"
									}`}
								>
									{paperData.authors.join(", ")} • {paperData.publication_year}
								</p>
								<div className="flex flex-wrap gap-2">
									{paperData.keywords.map((keyword, index) => (
										<span
											key={index}
											className={`px-2 py-1 rounded-full text-sm ${
												theme === "light"
													? "bg-blue-50 text-blue-700"
													: "bg-blue-900/50 text-blue-300 backdrop-blur-sm"
											}`}
										>
											{keyword}
										</span>
									))}
								</div>
							</div>

							<div
								className={`p-6 rounded-lg mb-8 ${
									theme === "light"
										? "bg-gray-50"
										: theme === "dark"
										? "bg-gray-800"
										: "bg-gray-900/50 backdrop-blur-sm"
								}`}
							>
								<h2
									className={`text-xl font-semibold mb-3 ${
										theme === "light" ? "text-gray-900" : "text-white"
									}`}
								>
									Abstract
								</h2>
								<p
									className={
										theme === "light" ? "text-gray-700" : "text-gray-300"
									}
								>
									{paperData.abstract}
								</p>
							</div>

							{paperData.sections?.map((section, index) => (
								<div
									key={index}
									id={`section-${section.title}`}
									className="mb-8"
								>
									<h2
										className={`text-2xl font-semibold mb-4 ${
											theme === "light" ? "text-gray-900" : "text-white"
										}`}
									>
										{section.title}
									</h2>
									{section.paragraphs.map((para, paraIndex) => (
										<p
											key={paraIndex}
											className={`mb-4 ${
												theme === "light" ? "text-gray-700" : "text-gray-300"
											}`}
										>
											{para.content}
										</p>
									))}
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default ViewerPage;
