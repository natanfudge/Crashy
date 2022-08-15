export class Queue<T> {
    head: Node<T> | null = null;
    tail: Node<T> | null = null;

    constructor(initialValue: T) {
        this.head = {next: null, prev: null, data: initialValue};
        this.tail = this.head;
    }

    push(value: T){
        if (this.tail === null) {
            this.head = {next: null, prev: null, data: value};
            this.tail = this.head;
        } else {
            const newNode = {next: null, prev: this.tail, data: value};
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    dequeue(): T | null {
        if (this.head === null) {
            return null;
        } else {
            const value = this.head.data;
            this.head = this.head.next;
            if (this.head === null) {
                this.tail = null;
            }
            return value;
        }
    }

    isNotEmpty(): boolean {
        return this.head !== null;
    }

    toString(): string {
        let current = this.head;
        let result = '[';
        while (current !== null) {
            result += `${current.data}`;
            current = current.next;
            if (current !== null) {
                result += ', ';
            }
        }
        return result + "]";
    }
}

interface Node<T> {
    next: Node<T> | null;
    prev: Node<T> | null;
    data: T;
}