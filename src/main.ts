// ============================================
// 1. Интерфейс User и функция createUser
// ============================================

export interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return {
        id,
        name,
        email,
        isActive
    };
}

// ============================================
// 2. Интерфейс Book и функция createBook
// ============================================

export type Genre = 'fiction' | 'non-fiction';

export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

// ============================================
// 3. Функция calculateArea с перегрузкой
// ============================================

export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}

// ============================================
// 4. Тип Status и функция getStatusColor
// ============================================

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    switch (status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'red';
        case 'new':
            return 'orange';
    }
}

// ============================================
// 5. Тип StringFormatter и две функции
// ============================================

export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (str, uppercase = false) => {
    if (uppercase) {
        return str.toUpperCase();
    }
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.slice(1);
};

export const trimAndFormat: StringFormatter = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

// ============================================
// 6. Универсальная функция getFirstElement
// ============================================

export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

// ============================================
// 7. Интерфейс HasId и функция findById
// ============================================

export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}