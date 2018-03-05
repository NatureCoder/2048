import { direction } from "./direction";

type callback = (...args: any[]) => void;
interface IEvents {
    [event: string]: callback[];
}

export class InputHandler {
    private container: HTMLElement;
    private events: IEvents;

    constructor(container: HTMLElement) {
        this.container = container;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.events = {};
    }

    public on(event: string, cb: callback) {
        this.events[event] = (this.events[event] || []);
        this.events[event].push(cb);
    }

    private trigger(event: string, ...args: any[]) {
        const callbacks = this.events[event];
        for (const cb of callbacks) {
            cb(...args);
        }
    }

    private handleKeyDown(ev: KeyboardEvent) {
        if (ev.defaultPrevented) {
            return; // do nothing if the event was already processed
        }
        const modifiers = ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey;
        if (modifiers) {
            return;
        }
        switch (ev.key) {
            case "ArrowUp":
                this.trigger('move', direction.Up);
                break;
            case "ArrowRight":
                this.trigger('move', direction.Right);
                break;
            case "ArrowDown":
                this.trigger('move', direction.Down);
                break;
            case "ArrowLeft":
                this.trigger('move', direction.Left);
                break;
            default:
                return; // quit when we don't handle this key event.
        }
        ev.preventDefault(); // cancel default action to avoid handling key twice
    }
}
