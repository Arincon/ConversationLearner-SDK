import * as builder from 'botbuilder';
import { Serializable } from './Serializable';
import { JsonProperty } from 'json-typescript-mapper';
import { BlisMemory, MemoryType } from '../BlisMemory';

export class BotState extends Serializable 
{
    private static MEMKEY = "BOTSTATE";

    @JsonProperty('appId') 
    public appId : string = null;

    @JsonProperty('sesionId') 
    public sessionId : string = null;

    @JsonProperty('modelId') 
    public modelId : string = null;

    @JsonProperty('inTeach') 
    public inTeach : boolean = false;
 
    @JsonProperty('inDebug') 
    public inDebug : boolean = false;

    @JsonProperty('address') 
    public address : string = null;

    public static memory : BlisMemory;

    public constructor(init?:Partial<BotState>)
    {
        super();
        this.appId = undefined;
        this.sessionId = undefined;
        this.modelId = undefined;
        this.inTeach = false;
        this.inDebug = false;
        this.address = undefined;
        (<any>Object).assign(this, init);
    }

    private static async Get() : Promise<BotState>
    {
        if (!this.memory)
        {
            throw new Error("BotState called without initializing memory");
        }
         // Load bot state
        let data = await this.memory.GetAsync(this.MEMKEY);
        if (data) 
        {
            return BotState.Deserialize(BotState, data); 
        }
        return new BotState();  
    }

    private static GetSync(cb : (err, botState: BotState) => void) : void
    {
        if (!this.memory)
        {
            throw new Error("BotState called without initialzing memory");
        }
         // Load bot state
        let data = this.memory.Get(this.MEMKEY, (err, data) =>
        {
            if (!err && data)
            {
                let botState = BotState.Deserialize(BotState, data);  
                cb(null, botState)
            }
            else
            {
                cb(null, new BotState());
            }
            
        }); 
    }

    private static async Set(botState : BotState) : Promise<void>
    {
        if (!this.memory)
        {
            throw new Error("BotState called without initialzing memory");
        }
        await this.memory.SetAsync(this.MEMKEY, botState.Serialize());
    }


    private static async Clear(appId : string) : Promise<void>
    {
        let botState = new BotState();  
        botState.appId = appId;
        botState.sessionId = null;
        botState.modelId = null;
        botState.inTeach = false;
        botState.inDebug = false;
        await this.Set(botState);
    }

    private static async ToString() : Promise<string>
    {
        let botState = await this.Get();
        return JSON.stringify(botState);
    }

    public static async AppId() : Promise<string>  
    {
        let botState = await this.Get();    
        return botState.appId;
    }

    public static async SetAppId(appId : string) : Promise<void>
    {
        let botState = await this.Get();    
        botState.appId = appId;
        await this.Set(botState);
    }

    public static async ModelId() : Promise<string>
    {
        let botState = await this.Get();    
        return botState.modelId;
    }

    public static async SetModelId(modelId : string) : Promise<void>
    {
        let botState = await this.Get();    
        botState.modelId = modelId;
        await this.Set(botState);
    }

    public static async SessionId() : Promise<string>
    {
        let botState = await this.Get();    
        return botState.sessionId;
    }

    public static async SetSessionId(sessionId : string) : Promise<void>
    {
        let botState = await this.Get();    
        botState.sessionId = sessionId;
        await this.Set(botState);
    }

    public static async InTeach() : Promise<boolean> {
        let botState = await this.Get();    
        return botState.inTeach;
    }

    public static async SetInTeach(isTrue : boolean) : Promise<void> {
        let botState = await this.Get();    
        botState.inTeach = isTrue;
        await this.Set(botState);
    }

    public static InTeachSync(cb : (err, inTeach) => void) : void {
        this.GetSync((err, botState) => {
            if (!err)
            {
                cb(null, botState.inTeach);
            }
        });    
    }

    public static async InDebug() : Promise<boolean> {
        let botState = await this.Get();    
        return botState.inDebug;
    }

    public static async SetInDebug(isTrue : boolean) : Promise<void> {
        let botState = await this.Get();    
        botState.inDebug = isTrue;
        await this.Set(botState);
    }


    public static async SetAddress(address : builder.IAddress) : Promise<void> {
        let botState = await this.Get();    
        botState.address = JSON.stringify(address);
        await this.Set(botState);
    }

    public static async Address() : Promise<builder.IAddress> {
        let botState = await this.Get();    
        let addressString = botState.address;
        return JSON.parse(addressString);
    }

    public static async Session(bot : builder.UniversalBot) {
        let address = await this.Address();
        return new Promise(function(resolve,reject) {
            bot.loadSession(address, (err, session) => {
                if(err !== null)
                {
                 return reject(err);
                }
                resolve(session);
            });
        });
    }
}