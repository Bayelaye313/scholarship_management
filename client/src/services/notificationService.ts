import { useNotifications } from '../context/NotificationContext';

// Fonction pour créer des notifications liées aux candidatures
export const useApplicationNotifications = () => {
    const { addNotification } = useNotifications();

    // Notification pour une candidature soumise
    const notifyApplicationSubmitted = (applicationId: number, scholarshipName: string) => {
        addNotification({
            title: 'Candidature soumise',
            message: `Votre candidature pour la bourse "${scholarshipName}" a été soumise avec succès.`,
            type: 'success',
            link: `/candidatures/${applicationId}`
        });
    };

    // Notification pour une candidature approuvée
    const notifyApplicationApproved = (applicationId: number, scholarshipName: string) => {
        addNotification({
            title: 'Candidature approuvée !',
            message: `Félicitations ! Votre candidature pour la bourse "${scholarshipName}" a été approuvée.`,
            type: 'success',
            link: `/candidatures/${applicationId}`
        });
    };

    // Notification pour une candidature rejetée
    const notifyApplicationRejected = (applicationId: number, scholarshipName: string) => {
        addNotification({
            title: 'Candidature non retenue',
            message: `Nous sommes désolés, votre candidature pour la bourse "${scholarshipName}" n'a pas été retenue.`,
            type: 'error',
            link: `/candidatures/${applicationId}`
        });
    };

    // Notification pour un commentaire ajouté à une candidature
    const notifyCommentAdded = (applicationId: number, scholarshipName: string) => {
        addNotification({
            title: 'Nouveau commentaire',
            message: `Un nouveau commentaire a été ajouté à votre candidature pour la bourse "${scholarshipName}".`,
            type: 'info',
            link: `/candidatures/${applicationId}`
        });
    };

    // Notification pour un document manquant
    const notifyDocumentMissing = (applicationId: number, scholarshipName: string, documentName: string) => {
        addNotification({
            title: 'Document manquant',
            message: `Le document "${documentName}" est manquant pour votre candidature à la bourse "${scholarshipName}".`,
            type: 'warning',
            link: `/candidatures/${applicationId}`
        });
    };

    // Notification pour une date limite approchante
    const notifyDeadlineApproaching = (scholarshipId: number, scholarshipName: string, daysLeft: number) => {
        addNotification({
            title: 'Date limite approchante',
            message: `Il ne reste que ${daysLeft} jour(s) pour postuler à la bourse "${scholarshipName}".`,
            type: 'warning',
            link: `/bourses/${scholarshipId}`
        });
    };

    // Notification pour une nouvelle bourse correspondant au profil
    const notifyMatchingScholarship = (scholarshipId: number, scholarshipName: string) => {
        addNotification({
            title: 'Nouvelle bourse recommandée',
            message: `Une nouvelle bourse "${scholarshipName}" correspond à votre profil.`,
            type: 'info',
            link: `/bourses/${scholarshipId}`
        });
    };

    return {
        notifyApplicationSubmitted,
        notifyApplicationApproved,
        notifyApplicationRejected,
        notifyCommentAdded,
        notifyDocumentMissing,
        notifyDeadlineApproaching,
        notifyMatchingScholarship
    };
}; 