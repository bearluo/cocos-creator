

export interface IFWManagerBase {
    update(deltaTime: number): void;
    __preload():void;
    start(): void;
    dectroy(): void;
}
    
export const manager:IFWManagerBase[] = []