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
        "Les {userType} ne peuvent pas {action}",
        "Accompagnement demandé pour {action} dans {component}",
        "Guide utilisateur nécessaire pour {feature}"
    ]
};

const variableComponents: string[] = [
    "le header",
    "le footer",
    "le bouton",
    "le formulaire",
    "la liste",
    "le tableau",
    "le graphique",
    "le menu",
    "le panneau",
    "la modal",
    "la page contact"
];

const variableActions: Record<Category, string[]> = {
    bug: [
        "l'ouverture",
        "la fermeture",
        "la validation",
        "l'envoi",
        "la suppression"
    ],
    feature: [
        "l'ajout",
        "la suppression",
        "l'édition",
        "la personnalisation",
        "l'adaptation"
    ],
    technical: [
        "le tri",
        "le filtrage",
        "la recherche",
        "l'optimisation",
        "l'intégration"
    ],
    support: [
        "configurer",
        "dépanner",
        "former",
        "assister",
        "débogguer"
    ]
};

const variableUserTypes: string[] = [
    "utilisateurs",
    "clients",
    "administrateurs",
    "modérateurs",
    "visiteurs",
    "abonnés"
];

const variableFeatures: string[] = [
    "l'interface",
    "l'expérience utilisateur",
    "la performance",
    "la sécurité",
    "la stabilité",
    "l'accessibilité",
    "la documentation"
];

const ticketTimeToProcess: Record<Priority, number> = {
    minor: 50,
    medium: 35,
    major: 15,
    critical: 10
};

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
        const actions = variableActions[category];
        variables.action = actions[Math.floor(Math.random() * actions.length)];
    }

    if (template.includes("{userType}")) {
        variables.userType = variableUserTypes[Math.floor(Math.random() * variableUserTypes.length)];
    }

    if (template.includes("{feature}")) {
        variables.feature = variableFeatures[Math.floor(Math.random() * variableFeatures.length)];
    }

    const description = template.replace(/{(\w+)}/g, (match, key) => variables[key as keyof TemplateVariables] || `[${key}]`);

    // make the first letter uppercase
    return description.charAt(0).toUpperCase() + description.slice(1);
}
