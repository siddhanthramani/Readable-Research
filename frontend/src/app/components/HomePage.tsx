"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePaper } from "../context/PaperContext";

const HomePage = () => {
	const router = useRouter();
	const { setPaperId } = usePaper();

	const handleViewPaper = () => {
		setPaperId("1706.03762");
		router.push("/viewer");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<main className="container mx-auto px-4 py-16">
				<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
					Welcome to Readable Research
				</h1>
				<div className="max-w-3xl mx-auto">
					<p className="text-xl text-gray-700 mb-8 text-center">
						Making research papers more accessible and understandable.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Upload Papers
							</h2>
							<p className="text-gray-600 mb-4">
								Upload research papers and get them transformed into an
								easy-to-read format.
							</p>
							<button
								onClick={handleViewPaper}
								className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
							>
								View Sample Paper
							</button>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Explore Research
							</h2>
							<p className="text-gray-600">
								Browse through our collection of simplified research papers and
								expand your knowledge.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default HomePage;
