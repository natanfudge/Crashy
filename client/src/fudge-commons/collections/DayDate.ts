import dayjs, {Dayjs} from "dayjs";

function twoDigit(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}

export class DayDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static fromNativeDatepickerValue(value: string): DayDate {
        const [year, month, day] = value.split("-")
        return new DayDate(parseInt(year), parseInt(month), parseInt(day));
    }

    static fromDate(date: Date): DayDate {
        return new DayDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }

    static fromDayjs(date: Dayjs): DayDate {
        return new DayDate(date.year(), date.month() + 1, date.date())
    }

    static today(): DayDate {
        return this.fromDayjs(dayjs())
    }

    toNativeDatepickerValue() {
        return `${this.year}-${twoDigit(this.month)}-${twoDigit(this.day)}`
    }

    toDate(): Date {
        return new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0)
    }

    toDayjs(): Dayjs {
        return dayjs().day(this.day).month(this.month).year(this.year)
    }

    toString() {
        return `${twoDigit(this.day)}/${twoDigit(this.month)}/${this.year}`
    }
    toDayMonth(): string {
        return `${twoDigit(this.day)}/${twoDigit(this.month)}`
    }

}
