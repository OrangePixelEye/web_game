export class Controls{
    codes : any;
    public states : any;

    constructor(){
        this.codes  = { 37: 'left', 32: 'forward' };
        this.states = { 'left': false, 'forward': false };
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
    }

    onKey(val : Function, e : any){
        var state = this.codes[e.keyCode];
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }
}