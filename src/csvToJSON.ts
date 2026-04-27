import { readFile, writeFile } from 'node:fs/promises';
/**
 * Преобразует CSV массив строк в массив объектов
 * @param input - массив строк (первая - заголовки, остальные - данные)
 * @param delimiter - разделитель полей
 * @returns массив объектов
 * @throws Error при несовпадении количества полей
 */
export function csvToJSON(input: string[], delimiter: string): object[] {
    if (!input || input.length === 0) {
        throw new Error('Input array cannot be empty');
    }

    if (!delimiter || delimiter.length === 0) {
        throw new Error('Delimiter cannot be empty');
    }

    // Получаем заголовки из первой строки
    const firstRow = input[0].trim();
    if (!firstRow) {
        throw new Error('No headers found in first row');
    }
    
    const headers = firstRow.split(delimiter).map(h => h.trim());
    
    if (headers.length === 0 || (headers.length === 1 && headers[0] === '')) {
        throw new Error('No headers found in first row');
    }

    const result: object[] = [];

    // Обрабатываем строки данных (начиная с индекса 1)
    for (let i = 1; i < input.length; i++) {
        // Пропускаем пустые строки
        if (!input[i].trim()) {
            continue;
        }
        
        const values = input[i].split(delimiter).map(v => v.trim());
        
        // Проверяем соответствие количества полей
        if (values.length !== headers.length) {
            throw new Error(
                `Row ${i + 1} has ${values.length} fields, but expected ${headers.length} fields`
            );
        }

        const obj: Record<string, string | number> = {};

        for (let j = 0; j < headers.length; j++) {
            const value = values[j];
            const header = headers[j];
            
            // Пытаемся преобразовать в число, если это число
            // Но сохраняем ведущие нули как строки
            if (value === '') {
                obj[header] = '';
            } else {
                const numberValue = Number(value);
                // Если это число и не NaN, и не теряем ведущие нули
                // (проверяем, что строка не начинается с 0 и содержит только цифры)
                const isNumericValue = !isNaN(numberValue) && value !== '';
                const hasLeadingZero = value.length > 1 && value[0] === '0';
                
                if (isNumericValue && !hasLeadingZero) {
                    obj[header] = numberValue;
                } else {
                    obj[header] = value;
                }
            }
        }

        result.push(obj);
    }

    return result;
}

/**
 * Читает CSV файл и записывает JSON файл
 * @param input - путь к входному CSV файлу
 * @param output - путь к выходному JSON файлу
 * @param delimiter - разделитель полей
 * @returns Promise, который разрешается после записи файла
 */
export async function formatCSVFileToJSONFile(
    input: string,
    output: string,
    delimiter: string
): Promise<void> {
    try {
        // Читаем файл
        const fileContent = await readFile(input, 'utf-8');
        
        // Разбиваем содержимое на строки
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }
        
        // Преобразуем в JSON
        const jsonData = csvToJSON(lines, delimiter);
        
        // Записываем в файл (с отступами для читаемости)
        await writeFile(output, JSON.stringify(jsonData, null, 2), 'utf-8');
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to process CSV file: ${error.message}`);
        }
        throw error;
    }
}