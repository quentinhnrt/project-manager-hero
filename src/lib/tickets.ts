export type Category = "bug" | "feature" | "technical" | "support";

export type Priority = "minor" | "medium" | "major" | "critical";

export type Ticket = {
    id: number;
    description: string;
    category: Category;
    timeToProcess: number;
    priority: Priority;
}

export interface LostTicket extends Ticket {
    selectedCategory: Category;
}

type TemplateVariables = {
    component?: string;
    action?: string;
    userType?: string;
    feature?: string;
};

const ticketTemplates: Record<Category, string[]> = {
    bug: [
        "Le composant {component} ne répond pas lors de {action}",
        "{component} provoque un crash quand {action}",
        "{component} ralentit considérablement pendant {action}"
    ],
    feature: [
        "Ajouter la possibilité de {action} dans {component}",
        "Permettre aux {userType} de {action}",
        "Amélioration de {feature} pour optimiser {action}"
    ],
    technical: [
        "Mise à jour nécessaire de {component} pour supporter {action}",
        "Optimisation technique: Améliorer {action} dans {component}",
        "Restructurer {component} pour {action}"
    ],
    support: [
        "{userType} ne peut pas {action}",
        "Accompagnement demandé pour {action} dans {component}",
        "Guide utilisateur nécessaire pour {feature}"
    ]
};

const variableComponents: string[] = [
    "Le header",
    "Le footer",
    "Le bouton",
    "Le formulaire",
    "La liste",
    "Le tableau",
    "Le graphique",
    "Le menu",
    "Le panneau",
    "La modal",
    "La page",
];

const variableActions: string[] = [
    "l'ouverture",
    "la fermeture",
    "la validation",
    "l'envoi",
    "la suppression",
    "la modification",
    "la sélection",
    "le tri",
    "le filtrage",
    "la recherche",
    "l'ajout",
    "la suppression",
    "l'édition",
    "l'annulation"
];

const variableUserTypes: string[] = [
    "utilisateurs",
    "clients",
    "administrateurs",
    "modérateurs",
    "développeurs",
    "testeurs",
    "visiteurs",
    "abonnés",
    "membres",
    "invités",
    "personnes"
];

const variableFeatures: string[] = [
    "l'interface",
    "l'expérience utilisateur",
    "la performance",
    "les fonctionnalités",
    "les interactions",
    "les animations",
    "les transitions",
    "les effets",
    "les retours visuels",
    "les retours utilisateurs",
    "la compatibilité",
    "la sécurité",
    "la stabilité",
    "la fiabilité",
    "l'accessibilité",
    "la lisibilité",
    "la cohérence",
    "la simplicité",
    "la clarté",
    "la fluidité",
    "la réactivité",
    "l'ergonomie",
    "la personnalisation",
    "la configuration",
    "l'adaptabilité",
    "la flexibilité",
    "la modularité",
    "la scalabilité",
    "la maintenabilité",
    "la compatibilité",
    "l'interopérabilité",
    "la documentation",
    "le support",
    "la formation",
    "l'assistance",
    "le dépannage",
    "le débogage",
    "le monitoring",
    "le reporting",
    "l'analyse",
    "la gestion",
    "l'administration",
    "la configuration",
    "la personnalisation",
    "le paramétrage",
    "la gestion des droits",
    "la gestion des rôles",
];

const ticketTimeToProcess: Record<Priority, number> = {
    minor: 50,
    medium: 35,
    major: 15,
    critical: 10
}

const categories: Category[] = ["bug", "feature", "technical", "support"];
const priorities: Priority[] = ["minor", "medium", "major", "critical"];

export function generateTicket(id: number): Ticket {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const description = generateDescription(category);
    const timeToProcess = ticketTimeToProcess[priority];

    return {
        id,
        description,
        category,
        timeToProcess,
        priority
    };
}

function generateDescription(category: Category): string {
    const template = ticketTemplates[category][Math.floor(Math.random() * ticketTemplates[category].length)];
    const variables: TemplateVariables = {};

    if (template.includes("{component}")) {
        variables.component = variableComponents[Math.floor(Math.random() * variableComponents.length)];
    }

    if (template.includes("{action}")) {
        variables.action = variableActions[Math.floor(Math.random() * variableActions.length)];
    }

    if (template.includes("{userType}")) {
        variables.userType = variableUserTypes[Math.floor(Math.random() * variableUserTypes.length)];
    }

    if (template.includes("{feature}")) {
        variables.feature = variableFeatures[Math.floor(Math.random() * variableFeatures.length)];
    }

    return template.replace(/{(\w+)}/g, (match, key) => variables[key as keyof TemplateVariables] || `[${key}]`);
}