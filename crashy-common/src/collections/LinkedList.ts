export class LinkedList<T> {
    private head?: Node<T>

    find(func: (element: T) => boolean): T | undefined {
        let current = this.head;
        while (current !== undefined) {
            if (func(current.value)) return current.value;
            current = current.next;
        }
        return undefined;
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

    copyReversed() : LinkedList<T>{
        const newList = new LinkedList<T>();
        this.forEach(element => newList.prepend(element))
        return newList
    }
}

interface Node<T> {
    next?: Node<T>
    value: T
}