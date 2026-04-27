import { it, describe, expect, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import {
    createUser,
    createBook,
    calculateArea,
    getStatusColor,
    capitalizeFirst,
    trimAndFormat,
    getFirstElement,
    findById,
    type User,
    type Book,
    type Status
} from './main';

// ============================================
// 1. Тесты для createUser
// ============================================
describe('createUser', () => {
    it('должен создать пользователя с обязательными полями', () => {
        const user = createUser(1, 'Алексей');
        
        expect(user.id).toBe(1);
        expect(user.name).toBe('Алексей');
        expect(user.isActive).toBe(true); // значение по умолчанию
        expect(user.email).toBeUndefined();
    });

    it('должен создать пользователя с email', () => {
        const user = createUser(2, 'Мария', 'maria@example.com');
        
        expect(user.email).toBe('maria@example.com');
        expect(user.isActive).toBe(true);
    });

    it('должен создать пользователя с isActive = false', () => {
        const user = createUser(3, 'Иван', undefined, false);
        
        expect(user.isActive).toBe(false);
    });
});

// ============================================
// 2. Тесты для createBook
// ============================================
describe('createBook', () => {
    it('должен создать книгу со всеми полями', () => {
        const book = createBook({
            title: 'Война и мир',
            author: 'Лев Толстой',
            year: 1869,
            genre: 'fiction'
        });
        
        expect(book.title).toBe('Война и мир');
        expect(book.author).toBe('Лев Толстой');
        expect(book.year).toBe(1869);
        expect(book.genre).toBe('fiction');
    });

    it('должен создать книгу без опционального поля year', () => {
        const book = createBook({
            title: 'Краткая история времени',
            author: 'Стивен Хокинг',
            genre: 'non-fiction'
        });
        
        expect(book.title).toBe('Краткая история времени');
        expect(book.author).toBe('Стивен Хокинг');
        expect(book.genre).toBe('non-fiction');
        expect(book.year).toBeUndefined();
    });
});

// ============================================
// 3. Тесты для calculateArea
// ============================================
describe('calculateArea', () => {
    it('должен вычислить площадь круга', () => {
        const area = calculateArea('circle', 5);
        expect(area).toBeCloseTo(78.53981633974483, 5);
    });

    it('должен вычислить площадь квадрата', () => {
        const area = calculateArea('square', 4);
        expect(area).toBe(16);
    });

    it('должен вернуть 0 для круга с радиусом 0', () => {
        const area = calculateArea('circle', 0);
        expect(area).toBe(0);
    });

    it('должен вернуть 0 для квадрата со стороной 0', () => {
        const area = calculateArea('square', 0);
        expect(area).toBe(0);
    });
});

// ============================================
// 4. Тесты для getStatusColor
// ============================================
describe('getStatusColor', () => {
    it('должен вернуть green для статуса active', () => {
        expect(getStatusColor('active')).toBe('green');
    });

    it('должен вернуть red для статуса inactive', () => {
        expect(getStatusColor('inactive')).toBe('red');
    });

    it('должен вернуть orange для статуса new', () => {
        expect(getStatusColor('new')).toBe('orange');
    });
});

// ============================================
// 5. Тесты для capitalizeFirst
// ============================================
describe('capitalizeFirst', () => {
    it('должен сделать первую букву заглавной', () => {
        expect(capitalizeFirst('hello')).toBe('Hello');
        expect(capitalizeFirst('world')).toBe('World');
    });

    it('должен вернуть строку в верхнем регистре, если uppercase = true', () => {
        expect(capitalizeFirst('hello', true)).toBe('HELLO');
    });

    it('должен вернуть пустую строку для пустой строки', () => {
        expect(capitalizeFirst('')).toBe('');
    });
});

// ============================================
// 5. Тесты для trimAndFormat
// ============================================
describe('trimAndFormat', () => {
    it('должен обрезать пробелы по краям', () => {
        expect(trimAndFormat('  hello  ')).toBe('hello');
    });

    it('должен обрезать пробелы и привести к верхнему регистру', () => {
        expect(trimAndFormat('  hello  ', true)).toBe('HELLO');
    });

    it('должен сохранить пробелы внутри строки', () => {
        expect(trimAndFormat('  hello world  ')).toBe('hello world');
    });
});

// ============================================
// 6. Тесты для getFirstElement
// ============================================
describe('getFirstElement', () => {
    it('должен вернуть первый элемент массива чисел', () => {
        const numbers = [10, 20, 30];
        expect(getFirstElement(numbers)).toBe(10);
    });

    it('должен вернуть первый элемент массива строк', () => {
        const strings = ['apple', 'banana', 'cherry'];
        expect(getFirstElement(strings)).toBe('apple');
    });

    it('должен вернуть undefined для пустого массива', () => {
        expect(getFirstElement([])).toBeUndefined();
    });
});

// ============================================
// 7. Тесты для findById
// ============================================
describe('findById', () => {
    interface TestItem {
        id: number;
        name: string;
    }

    const items: TestItem[] = [
        { id: 1, name: 'Первый' },
        { id: 2, name: 'Второй' },
        { id: 3, name: 'Третий' }
    ];

    it('должен найти объект по существующему id', () => {
        const result = findById(items, 2);
        expect(result).toEqual({ id: 2, name: 'Второй' });
    });

    it('должен вернуть undefined для несуществующего id', () => {
        const result = findById(items, 99);
        expect(result).toBeUndefined();
    });

    it('должен вернуть undefined для пустого массива', () => {
        const result = findById([], 1);
        expect(result).toBeUndefined();
    });
});