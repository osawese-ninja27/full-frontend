export type UserRole = "student" | "mentor" | "admin";
export interface User { id: string; email: string; full_name: string; role: UserRole; is_active: boolean; created_at: string; }
export interface Course { id: string; mentor_id: string; title: string; description: string; is_published: boolean; created_at: string; }
export interface Module { id: string; course_id: string; title: string; sequence_order: number; min_pass_score: number; created_at: string; }
export interface Lesson { id: string; module_id: string; title: string; content: string; sequence_order: number; created_at: string; }
export interface ModuleProgress { module_id: string; title: string; sequence_order: number; min_pass_score: number; unlocked: boolean; completed: boolean; best_score: number | null; }
export interface Gamification { total_points: number; current_streak: number; longest_streak: number; badges: {code:string;name:string;description:string;earned_at:string}[]; }
export interface AssessmentQuestion { id: string; prompt: string; points: number; options: {id:string;text:string}[]; }
export interface Assessment { id: string; module_id: string; title: string; questions: AssessmentQuestion[]; }
