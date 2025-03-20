export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
}

export const testimonials: Testimonial[] = [
    {
        quote: "Grâce à cette plateforme, j'ai pu obtenir une bourse qui a changé ma vie. Le processus était simple et transparent.",
        name: "Fatou Diop",
        role: "Étudiante en Médecine",
        avatar: "/avatars/avatar-1.jpg"
    },
    {
        quote: "La plateforme m'a permis de trouver rapidement une bourse adaptée à mon profil. Je recommande vivement !",
        name: "Amadou Sow",
        role: "Étudiant en Informatique",
        avatar: "/avatars/avatar-2.jpg"
    },
    {
        quote: "J'ai obtenu une bourse internationale grâce à cette plateforme. L'interface est intuitive et les informations sont claires.",
        name: "Mariama Bâ",
        role: "Étudiante en Droit",
        avatar: "/avatars/avatar-3.jpg"
    }
]; 