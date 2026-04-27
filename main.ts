// ============================================
// 1. Интерфейс User и функция createUser
// ============================================

interface User {
    id: number;
    name: string;
    email?: string; // опциональное поле
    isActive: boolean;
}

function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return {
        id,
        name,
        email,
        isActive
    };
}

// Демонстрация
const user1 = createUser(1, "Алексей");
const user2 = createUser(2, "Мария", "maria@example.com", false);
console.log("1. Пользователи:", user1, user2);


// ============================================
// 2. Интерфейс Book и функция createBook
// ============================================

type Genre = 'fiction' | 'non-fiction';

interface Book {
    title: string;
    author: string;
    year?: number; // опциональное поле
    genre: Genre;
}

function createBook(book: Book): Book {
    return book;
}

// Демонстрация
const book1 = createBook({
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    genre: "fiction"
});

const book2 = createBook({
    title: "Краткая история времени",
    author: "Стивен Хокинг",
    genre: "non-fiction"
    // year опущен
});

console.log("2. Книги:", book1, book2);


// ============================================
// 3. Функция calculateArea с перегрузкой
// ============================================

// Перегрузки функции
function calculateArea(shape: 'circle', radius: number): number;
function calculateArea(shape: 'square', side: number): number;

// Реализация
function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}

// Демонстрация
const circleArea = calculateArea('circle', 5);
const squareArea = calculateArea('square', 4);
console.log("3. Площадь круга (r=5):", circleArea.toFixed(2));
console.log("   Площадь квадрата (a=4):", squareArea);


// ============================================
// 4. Тип Status и функция getStatusColor
// ============================================

type Status = 'active' | 'inactive' | 'new';

function getStatusColor(status: Status): string {
    switch (status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'red';
        case 'new':
            return 'orange';
    }
}

// Демонстрация
console.log("4. Цвета статусов:");
console.log(`   active -> ${getStatusColor('active')}`);
console.log(`   inactive -> ${getStatusColor('inactive')}`);
console.log(`   new -> ${getStatusColor('new')}`);


// ============================================
// 5. Тип StringFormatter и две функции
// ============================================

type StringFormatter = (str: string, uppercase?: boolean) => string;

// Функция 1: делает первую букву заглавной
const capitalizeFirst: StringFormatter = (str, uppercase = false) => {
    if (uppercase) {
        return str.toUpperCase();
    }
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.slice(1);
};

// Функция 2: обрезает пробелы и опционально приводит к верхнему регистру
const trimAndFormat: StringFormatter = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

// Демонстрация
console.log("5. Форматирование строк:");
console.log(`   capitalizeFirst('hello') -> ${capitalizeFirst('hello')}`);
console.log(`   capitalizeFirst('hello', true) -> ${capitalizeFirst('hello', true)}`);
console.log(`   trimAndFormat('  hello world  ') -> '${trimAndFormat('  hello world  ')}'`);
console.log(`   trimAndFormat('  hello  ', true) -> '${trimAndFormat('  hello  ', true)}'`);


// ============================================
// 6. Универсальная функция getFirstElement
// ============================================

function getFirstElement<T>(arr: T[]): T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

// Демонстрация
const numbers = [10, 20, 30, 40];
const strings = ['apple', 'banana', 'cherry'];
const emptyArray: number[] = [];

console.log("6. Первые элементы:");
console.log(`   getFirstElement([10,20,30,40]) -> ${getFirstElement(numbers)}`);
console.log(`   getFirstElement(['apple','banana']) -> ${getFirstElement(strings)}`);
console.log(`   getFirstElement([]) -> ${getFirstElement(emptyArray)}`);


// ============================================
// 7. Интерфейс HasId и универсальная функция findById
// ============================================

interface HasId {
    id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

// Демонстрация
interface Product extends HasId {
    name: string;
    price: number;
}

const products: Product[] = [
    { id: 1, name: "Ноутбук", price: 50000 },
    { id: 2, name: "Мышь", price: 1000 },
    { id: 3, name: "Клавиатура", price: 3000 }
];

const foundProduct = findById(products, 2);
const notFound = findById(products, 99);

console.log("7. Поиск по id:");
console.log(`   findById(products, 2) ->`, foundProduct);
console.log(`   findById(products, 99) -> ${notFound}`);
