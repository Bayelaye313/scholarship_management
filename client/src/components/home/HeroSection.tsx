import Link from 'next/link';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

export default function HeroSection({
    title,
    subtitle,
    ctaText,
    ctaLink
}: HeroSectionProps) {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {title}
                </h1>
                <p className="text-xl mb-8">
                    {subtitle}
                </p>
                <Link
                    href={ctaLink}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                >
                    {ctaText}
                </Link>
            </div>
        </section>
    );
} 