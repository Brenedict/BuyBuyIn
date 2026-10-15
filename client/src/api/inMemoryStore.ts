import { type UserGlobalContextSchemaType } from "@buybuyin/shared/schema/user";

class InMemoryStore {
    private accessToken: string | null = null;

    private listeners = new Set<() => void>();
    private userContext: UserGlobalContextSchemaType | null = null;

    public subscribe = (listener: () => void) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    private notify = () => {
        this.listeners.forEach((listener) => listener());
    };

    public setAccessToken = (token: string | null) => {
        this.accessToken = token;
        this.notify();
    };

    public getAccessToken = () => this.accessToken;

    public setUserContext = (user: UserGlobalContextSchemaType | null) => {
        this.userContext = user;
        this.notify();
    };

    public getUserContext = () => {
        return this.userContext;
    };
}

export default new InMemoryStore();
