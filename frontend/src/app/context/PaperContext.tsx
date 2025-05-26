"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PaperContextType {
	paperId: string | null;
	setPaperId: (id: string | null) => void;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export function PaperProvider({ children }: { children: ReactNode }) {
	const [paperId, setPaperId] = useState<string | null>(null);

	return (
		<PaperContext.Provider value={{ paperId, setPaperId }}>
			{children}
		</PaperContext.Provider>
	);
}

export function usePaper() {
	const context = useContext(PaperContext);
	if (context === undefined) {
		throw new Error("usePaper must be used within a PaperProvider");
	}
	return context;
}
