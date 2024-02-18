import { useMemo } from 'react';

const useTextFormatter = (text: string, type: 'title' | 'paragraph' = 'paragraph') => {
    return useMemo(() => {
        // Supprime le code HTML potentiellement dangereux pour empêcher l'injection de code
        const div = document.createElement('div');
        div.textContent = text;
        let formattedText = div.innerHTML;

        // Supprime les espaces excédentaires
        formattedText = formattedText.replace(/\s+/g, ' ').trim();

        // Applique le formatage spécifique au type
        switch (type) {
            case 'title':
                // Met en majuscule la première lettre de chaque mot pour un titre
                formattedText = formattedText.replace(
                    /\w\S*/g,
                    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
                break;
            case 'paragraph':
                // Assure qu'un paragraphe commence par une majuscule et se termine par un point
                formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
                if (formattedText.charAt(formattedText.length - 1) !== '.') {
                    formattedText += '.';
                }
                break;
            default:
                // Aucun formatage supplémentaire pour les types non reconnus
                break;
        }

        return formattedText;
    }, [text, type]);
};

export default useTextFormatter;