"use client";

import { MapContextProvider } from "@/contexts/mapdata/MapContextProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MapContextProvider>
            <>
                {children}
            </>
        </MapContextProvider>
    )
}