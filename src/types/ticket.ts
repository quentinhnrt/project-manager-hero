export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'bug' | 'feature' | 'improvement' | 'documentation';
export type TicketStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: TicketPriority;
    type: TicketType;
    status: TicketStatus;
    storyPoints: number;
    createdAt: Date;
    assignedTo?: string;
    deadline?: Date;
    labels: string[];
}

// Types pour le score et les séries
export interface ScoreState {
    currentScore: number;
    streak: number;
    multiplier: number;
    correctAnswers: number;
    wrongAnswers: number;
    ratio: number;
}

// Type pour les événements de jeu
export interface GameEvent {
    type: 'success' | 'error' | 'streak' | 'multiplier';
    message: string;
    points: number;
}