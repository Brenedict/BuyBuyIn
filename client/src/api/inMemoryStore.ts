class InMemoryStore {
    private accessToken: string | null = null;

    private listeners = new Set<() => void>();

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
}

export default new InMemoryStore();
