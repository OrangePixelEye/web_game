export abstract class SaveSystem{
    // local storage
    public static saveArray(info : Map<string, string>) : void{
        info.forEach((v, k) => {
            localStorage.setItem(k,v)
        });
    }

	public static save(key : string, value : any) : void{
		localStorage.setItem(key, value)
	}

    public static load(key : string) : string{
        return localStorage.getItem(key) ?? '';
    }
}