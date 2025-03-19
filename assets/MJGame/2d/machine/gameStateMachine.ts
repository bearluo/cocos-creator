import { Actor, AnyActorLogic, createMachine, emit, EmittedFrom } from "ccc-xstate";

export enum GAME_EVENTS {
    GAME_WAIT = "GAME_WAIT",
    GAME_START = "GAME_START",
    GAME_END = "GAME_END",
    PLAYER_ALL_READY = "PLAYER_ALL_READY",
    DRAW_TILE = "DRAW_TILE",
    DISCARD_TILE = "DISCARD_TILE",
    SEND_TILE = "SEND_TILE",
    WAIT_OPERATE = "WAIT_OPERATE",
    CHI_TILE = "CHI_TILE",
    PENG_TILE = "PENG_TILE",
    GANG_TILE = "GANG_TILE",
    HU_TILE = "HU_TILE",
    NEW_GAME = "NEW_GAME",
}

export enum eGameStateMachineListeners {
    onEntryGameIdle = "onEntryGameIdle",
    onExitGameIdle = "onExitGameIdle",
    onEntryGameEnd = "onEntryGameEnd",
    onExitGameEnd = "onExitGameEnd",
    onEntryGameWait = "onEntryGameWait",
    onExitGameWait = "onExitGameWait",
    onEntryGameStart = "onEntryGameStart",
    onExitGameStart = "onExitGameStart",
}

export const GameStateMachine = createMachine({
    initial: "game_idle",
    states:{
        game_idle: {
            entry : emit({ type: eGameStateMachineListeners.onEntryGameIdle }),
            exit : emit({ type: eGameStateMachineListeners.onExitGameIdle }),
            on: {
                GAME_WAIT:"game_wait",
                GAME_START:"game_start",
                GAME_END:"game_end",
            }
        },
        game_wait: {
            entry : emit({ type: eGameStateMachineListeners.onEntryGameWait }),
            exit : emit({ type: eGameStateMachineListeners.onExitGameWait }),
            on: {
                PLAYER_ALL_READY:"game_start",
            }
        },
        game_start: {
            initial: "wait_send",
            entry : emit({ type: eGameStateMachineListeners.onEntryGameStart }),
            exit : emit({ type: eGameStateMachineListeners.onExitGameStart }),
            states:{
                wait_send: {
                    on:{
                        SEND_TILE: "wait_draw",
                    }
                },
                wait_draw: {
                    on:{
                        DRAW_TILE: "wait_discard",
                        WAIT_OPERATE : "wait_operate",
                    }
                },
                wait_discard:{
                    on:{
                        DISCARD_TILE: "wait_draw",
                        GANG_TILE: "wait_draw",
                        HU_TILE: "wait_draw",
                    }
                },
                wait_operate :{
                    on:{
                        GANG_TILE: "wait_draw",
                        CHI_TILE: "wait_discard",
                        PENG_TILE: "wait_discard",
                        HU_TILE: "wait_draw",
                    }
                },
            },
            on: {
                GAME_END: "game_end",
            }
        },
        game_end: {
            entry : emit({ type: eGameStateMachineListeners.onEntryGameEnd }),
            exit : emit({ type: eGameStateMachineListeners.onExitGameEnd }),
            on: {
                NEW_GAME: "game_wait",
            }
        }
    }
});