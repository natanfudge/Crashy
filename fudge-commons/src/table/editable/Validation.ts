import {ColumnMetadata, RowObj} from "./EditableTable";
import {isComplexColumn} from "./Utility";

export interface TableValidation<C, R> {
    // Changing a value back to its old value is always valid. (As in not making any change)
    isValid: (value: C, row: R, isNewRow: boolean) => boolean;
    errorText: String;
}

export interface Validation<C> extends TableValidation<C, unknown> {
    isValid: (value: C) => boolean;
    errorText: String;
}

export class DateValidation implements Validation<Date> {
    errorText: String;
    minDate: Date | undefined
    maxDate: Date | undefined

    constructor(errorText: String, minDate: Date | undefined, maxDate: Date | undefined) {
        this.errorText = errorText;
        this.minDate = minDate
        this.maxDate = maxDate;
    }

    static min(date: Date, errorText: String): DateValidation {
        return new DateValidation(errorText, date, undefined)
    }

    static max(date: Date, errorText: String): DateValidation {
        return new DateValidation(errorText, undefined, date)
    }

    isValid(value: Date): boolean {
        return (this.minDate === undefined || this.minDate <= value) && (this.maxDate === undefined || this.maxDate >= value);
    }
}

export function getValidation<T extends RowObj, C>(metadata: ColumnMetadata<T, C>, isNewRow: boolean, row: T, origValue: C | undefined): Validation<C> | undefined {
    if (isComplexColumn(metadata) && metadata.validator !== undefined) {
        const validator = metadata.validator;
        if (validator instanceof DateValidation) return validator as unknown as Validation<C>;
        return {
            errorText: validator.errorText,
            isValid: (value) => {
                if (value === origValue) return true;
                return validator.isValid(value, row, isNewRow)
            }
        }
    } else {
        // No validation provided - everything is valid
        return undefined;
    }
}