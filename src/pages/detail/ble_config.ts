// BLE module-specific config
export class uart {
    public static get service(): string { return "ffe0"; }
    public static get char(): string { return "ffe1"; }
    public static get delim(): string { return "//END//"; }
}