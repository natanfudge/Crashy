export class LinkedList<T> {
    private head?: Node<T>

    find(func: (element: T) => boolean): T | undefined {
        let current = this.head;
        while (current !== undefined) {
            if (func(current.value)) return current.value;
            current = current.next;
        }
    }
    forEach(func: (element: T) => void) {
        let current = this.head;
        while (current !== undefined) {
            func(current.value);
            current = current.next;
        }
    }

    prepend(value: T) {
        this.head = {
            next: this.head,
            value
        };
    }
}

interface Node<T> {
    next?: Node<T>
    value: T
}