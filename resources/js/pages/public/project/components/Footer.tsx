interface FooterProps {
    isRTL?: boolean;
    projectName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
}

export function Footer({ projectName, t }: FooterProps) {
    return (
        <footer className="bg-gray-900 py-16 border-t border-gray-800">
            <div className="container mx-auto px-6 md:px-12 text-center text-gray-400">
                <p className="text-xl font-light tracking-widest text-white mb-6">
                    {projectName.toUpperCase()}
                </p>
                <p className="text-sm font-light mb-2">
                    &copy; {new Date().getFullYear()} {projectName} Development. {t.allRightsReserved}.
                </p>
                <p className="text-xs font-light opacity-70">{t.developedWithPrecision}</p>
            </div>
        </footer>
    );
}
