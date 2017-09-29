import * as builder from 'botbuilder';
import { BotMemory } from './Memory/BotMemory';
import { BotState } from './Memory/BotState';
export declare const MemoryType: {
    LASTSTEP: string;
    CURSTEP: string;
    TRAINSTEPS: string;
    CUECOMMAND: string;
    PAGE: string;
    POSTS: string;
};
export declare class BlisMemory {
    private userkey;
    private static redisClient;
    private memCache;
    static Init(redisServer: string, redisKey: string): void;
    private constructor();
    static GetMemory(key: string): BlisMemory;
    static InitMemory(session: builder.Session): BlisMemory;
    private Key(datakey);
    GetAsync(datakey: string): Promise<any>;
    SetAsync(datakey: string, value: any): Promise<{}>;
    DeleteAsync(datakey: string): Promise<{}>;
    Get(datakey: string, cb: (err: any, data: {}) => void): void;
    Init(appId: string): Promise<void>;
    /** Clear memory associated with a session */
    EndSession(): Promise<void>;
    /** Init memory for a session */
    StartSession(sessionId: string, inTeach: boolean): Promise<void>;
    readonly BotMemory: BotMemory;
    readonly BotState: BotState;
}
