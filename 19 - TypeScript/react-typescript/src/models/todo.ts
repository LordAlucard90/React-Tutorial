export class Todo {
    id: string;
    text: string;

    constructor(text: string) {
        this.text = text;
        this.id = Math.random().toString();
    }
}
