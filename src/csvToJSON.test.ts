import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './csvToJSON';
import { readFile, writeFile } from 'node:fs/promises';

// ============================================
// 3. Тесты для csvToJSON
// ============================================

describe('csvToJSON', () => {
    // Корректные входные данные
    describe('with valid input', () => {
        it('should convert CSV to JSON correctly', () => {
            const input = [
                'p1;p2;p3;p4',
                '1;A;b;c',
                '2;B;v;d'
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
                { p1: 2, p2: 'B', p3: 'v', p4: 'd' }
            ]);
        });

        it('should handle different delimiter', () => {
            const input = [
                'name,age,city',
                'John,25,NYC',
                'Jane,30,LA'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'NYC' },
                { name: 'Jane', age: 30, city: 'LA' }
            ]);
        });

        it('should handle empty string values', () => {
            const input = [
                'col1;col2;col3',
                'a;;c',
                '1;2;'
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { col1: 'a', col2: '', col3: 'c' },
                { col1: 1, col2: 2, col3: '' }
            ]);
        });

        it('should handle tabs as delimiter', () => {
            const input = [
                'name\tage',
                'John\t25',
                'Jane\t30'
            ];
            const delimiter = '\t';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25 },
                { name: 'Jane', age: 30 }
            ]);
        });

        it('should handle single row (only headers)', () => {
            const input = ['a;b;c'];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([]);
        });
    });

    // Некорректные входные данные
    describe('with invalid input', () => {
        it('should throw error when input is empty', () => {
            expect(() => csvToJSON([], ';')).toThrow('Input array cannot be empty');
        });

        it('should throw error when delimiter is empty', () => {
            const input = ['a;b', '1;2'];
            expect(() => csvToJSON(input, '')).toThrow('Delimiter cannot be empty');
        });

        it('should throw error when input is null', () => {
            expect(() => csvToJSON(null as any, ';')).toThrow();
        });

        it('should throw error when headers are missing', () => {
            const input = ['', '1;2;3'];
            expect(() => csvToJSON(input, ';')).toThrow('No headers found in first row');
        });

        it('should throw error when row has mismatched column count', () => {
            const input = [
                'p1;p2;p3',
                '1;A',
                '2;B;c;d'
            ];
            
            expect(() => csvToJSON(input, ';')).toThrow(
                'Row 2 has 2 fields, but expected 3 fields'
            );
        });

        it('should throw error when different row has mismatched column count', () => {
            const input = [
                'p1;p2;p3',
                '1;A;b',
                '2;B'  // здесь только 2 поля, а должно быть 3
            ];
    
            expect(() => csvToJSON(input, ';')).toThrow(
                'Row 3 has 2 fields, but expected 3 fields'  // исправлено с 1 на 2
            );
        });
    });

    // Пограничные случаи
    describe('edge cases', () => {
        it('should handle spaces around values', () => {
            const input = [
                'name ; age ; city',
                ' John ; 25 ; NYC ',
                ' Jane ; 30 ; LA '
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'NYC' },
                { name: 'Jane', age: 30, city: 'LA' }
            ]);
        });

        it('should treat numeric strings as numbers', () => {
            const input = [
                'id;value',
                '123;456',
                '789;0'
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { id: 123, value: 456 },
                { id: 789, value: 0 }
            ]);
        });

        it('should keep leading zeros as strings', () => {
            const input = [
                'code;name',
                '001;Product A',
                '002;Product B'
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { code: '001', name: 'Product A' },
                { code: '002', name: 'Product B' }
            ]);
        });
    });
});

// ============================================
// 4. Тесты для formatCSVFileToJSONFile (с заглушками)
// ============================================

describe('formatCSVFileToJSONFile', () => {
    // Мокаем функции readFile и writeFile
    beforeEach(() => {
        vi.mock('node:fs/promises', () => ({
            readFile: vi.fn(),
            writeFile: vi.fn()
        }));
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should read CSV file, convert to JSON and write to output file', async () => {
        // Подготавливаем заглушку для readFile
        const mockCSVContent = 'name;age;city\nJohn;25;NYC\nJane;30;LA';
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        
        // Заглушка для writeFile
        vi.mocked(writeFile).mockResolvedValue(undefined);
        
        // Вызываем функцию
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
        
        // Проверяем, что readFile вызван с правильными параметрами
        expect(readFile).toHaveBeenCalledTimes(1);
        expect(readFile).toHaveBeenCalledWith('input.csv', 'utf-8');
        
        // Проверяем, что writeFile вызван с правильными параметрами
        expect(writeFile).toHaveBeenCalledTimes(1);
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { name: 'John', age: 25, city: 'NYC' },
                { name: 'Jane', age: 30, city: 'LA' }
            ], null, 2),
            'utf-8'
        );
    });

    it('should handle different delimiter correctly', async () => {
        const mockCSVContent = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        vi.mocked(writeFile).mockResolvedValue(undefined);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ',');
        
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { name: 'John', age: 25, city: 'NYC' },
                { name: 'Jane', age: 30, city: 'LA' }
            ], null, 2),
            'utf-8'
        );
    });

    it('should handle empty lines in CSV file', async () => {
        const mockCSVContent = 'name;age\n\nJohn;25\n\nJane;30\n';
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        vi.mocked(writeFile).mockResolvedValue(undefined);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
        
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { name: 'John', age: 25 },
                { name: 'Jane', age: 30 }
            ], null, 2),
            'utf-8'
        );
    });

    it('should throw error when CSV file is empty', async () => {
        vi.mocked(readFile).mockResolvedValue('');
        
        await expect(
            formatCSVFileToJSONFile('input.csv', 'output.json', ';')
        ).rejects.toThrow('CSV file is empty');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('should throw error when CSV file has invalid format', async () => {
        const mockCSVContent = 'name;age\nJohn;25;NYC';  // несовпадение колонок
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        
        await expect(
            formatCSVFileToJSONFile('input.csv', 'output.json', ';')
        ).rejects.toThrow('Failed to process CSV file');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('should throw error when readFile fails', async () => {
        vi.mocked(readFile).mockRejectedValue(new Error('File not found'));
        
        await expect(
            formatCSVFileToJSONFile('nonexistent.csv', 'output.json', ';')
        ).rejects.toThrow('Failed to process CSV file: File not found');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('should throw error when writeFile fails', async () => {
        const mockCSVContent = 'name;age\nJohn;25';
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        vi.mocked(writeFile).mockRejectedValue(new Error('Permission denied'));
        
        await expect(
            formatCSVFileToJSONFile('input.csv', 'output.json', ';')
        ).rejects.toThrow('Failed to process CSV file: Permission denied');
    });

    it('should handle CRLF line endings (Windows)', async () => {
        const mockCSVContent = 'name;age\r\nJohn;25\r\nJane;30';
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);
        vi.mocked(writeFile).mockResolvedValue(undefined);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
        
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { name: 'John', age: 25 },
                { name: 'Jane', age: 30 }
            ], null, 2),
            'utf-8'
        );
    });
});