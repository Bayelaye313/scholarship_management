import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="relative max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{testimonials[currentTestimonial].name}</h3>
                        <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                    </div>
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonials[currentTestimonial].quote}"</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={prevTestimonial}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Témoignage précédent"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Témoignage suivant"
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
} 