import {
  Ticket,
  TicketPriority,
  TicketType,
  TicketStatus,
} from '@/types/ticket'
import { v4 as uuidv4 } from 'uuid'

// Données pour la génération aléatoire
const ACTIONS = [
  'Ajouter',
  'Modifier',
  'Optimiser',
  'Corriger',
  'Mettre à jour',
  'Implémenter',
  'Refactorer',
]
const SUBJECTS = [
  'la page',
  'le composant',
  'la fonction',
  "l'API",
  'le formulaire',
  'le modal',
  'le tableau',
]
const FEATURES = [
  'authentification',
  'tableau de bord',
  'profil utilisateur',
  'notifications',
  'recherche',
  'filtres',
  'export',
]

// Templates de descriptions
const BUG_TEMPLATES = [
  "L'utilisateur signale que {subject} ne fonctionne pas correctement lors de {action}.",
  'Un problème a été identifié dans {subject} qui empêche {action}.',
  'Bug critique : {subject} plante lors de {action}.',
]

const FEATURE_TEMPLATES = [
  "En tant qu'utilisateur, je souhaite pouvoir {action} {subject} pour {feature}.",
  'Ajouter la possibilité de {action} {subject} dans la section {feature}.',
  'Nouvelle fonctionnalité : {action} {subject} pour améliorer {feature}.',
]

const LABELS = [
  'frontend',
  'backend',
  'UX',
  'UI',
  'performance',
  'sécurité',
  'accessibilité',
  'SEO',
  'mobile',
  'desktop',
  'testing',
  'documentation',
]

// Fonction utilitaire pour le choix aléatoire
const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Fonction pour générer un nombre de story points réaliste
const generateStoryPoints = (): number => {
  const fibonacci = [1, 2, 3, 5, 8, 13]
  return randomChoice(fibonacci)
}

// Fonction pour générer une deadline réaliste
const generateDeadline = (): Date => {
  const now = new Date()
  const daysToAdd = Math.floor(Math.random() * 14) + 1 // 1-14 jours
  const deadline = new Date(now)
  deadline.setDate(deadline.getDate() + daysToAdd)
  return deadline
}

// Fonction pour générer une description basée sur un template
const generateDescription = (type: TicketType): string => {
  const templates = type === 'bug' ? BUG_TEMPLATES : FEATURE_TEMPLATES
  let description = randomChoice(templates)

  // Remplacer les placeholders
  description = description.replace(
    '{action}',
    randomChoice(ACTIONS).toLowerCase(),
  )
  description = description.replace(
    '{subject}',
    randomChoice(SUBJECTS).toLowerCase(),
  )
  description = description.replace(
    '{feature}',
    randomChoice(FEATURES).toLowerCase(),
  )

  return description
}

// Fonction pour générer des labels pertinents
const generateLabels = (type: TicketType): string[] => {
  const numLabels = Math.floor(Math.random() * 3) + 1 // 1-3 labels
  const typeLabel = type === 'bug' ? ['bug-fix'] : ['feature']
  const randomLabels = LABELS.sort(() => Math.random() - 0.5).slice(
    0,
    numLabels,
  )
  return [...typeLabel, ...randomLabels]
}

// Fonction principale pour générer un ticket
export const generateTicket = (): Ticket => {
  // Déterminer le type de ticket
  const type = randomChoice<TicketType>([
    'bug',
    'feature',
    'improvement',
    'documentation',
  ])

  // Générer la priorité en fonction du type
  let priority: TicketPriority
  if (type === 'bug') {
    priority = randomChoice(['high', 'critical'])
  } else if (type === 'feature') {
    priority = randomChoice(['medium', 'high'])
  } else {
    priority = randomChoice(['low', 'medium'])
  }

  // Générer le titre
  const action = randomChoice(ACTIONS)
  const subject = randomChoice(SUBJECTS)
  const feature = randomChoice(FEATURES)
  const title = `${action} ${subject} pour ${feature}`

  return {
    id: uuidv4(),
    title,
    description: generateDescription(type),
    priority,
    type,
    status: randomChoice<TicketStatus>([
      'todo',
      'in-progress',
      'review',
      'done',
    ]),
    storyPoints: generateStoryPoints(),
    createdAt: new Date(),
    deadline: generateDeadline(),
    labels: generateLabels(type),
  }
}

// Fonction pour générer plusieurs tickets
export const generateTickets = (count: number): Ticket[] => {
  return Array.from({ length: count }, () => generateTicket())
}

// Fonction pour générer un ticket toutes les x secondes
export const createTicketGenerator = (
  onTicketGenerated: (ticket: Ticket) => void,
  interval: number = 5000,
) => {
  const intervalId = setInterval(() => {
    const newTicket = generateTicket()
    onTicketGenerated(newTicket)
  }, interval)

  // Retourner une fonction pour arrêter la génération
  return () => clearInterval(intervalId)
}
