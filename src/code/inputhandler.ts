import { direction } from './direction';

type callback = (...args: any[]) => void;
interface IEvents {
    [event: string]: callback[];
}

export interface IInputHandler {
    on(event: string, cb: callback): void;
    reset(): void;
}

export class InputHandler implements IInputHandler {
    private _container: HTMLElement;
    private _events: IEvents = {};
    private _restartBtn: HTMLElement;

    constructor(container: HTMLElement, restartBtn: HTMLElement) {
        this._container = container;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this._restartBtn = restartBtn;
        this._restartBtn.addEventListener('click', this.restartClick.bind(this));
        this.reset();
    }
    public reset() {
        this._events = {};
    }

    public on(event: string, cb: callback) {
        this._events[event] = (this._events[event] || []);
        this._events[event].push(cb);
    }

    private trigger(event: string, ...args: any[]) {
        const callbacks = this._events[event];
        for (const cb of callbacks) {
            cb(...args);
        }
    }
    private restartClick(ev: MouseEvent) {
        this.trigger('restart');
        ev.preventDefault();
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
