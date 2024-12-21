declare module 'encriptorjs' {
    export function encrypt(text: Text, myKey: string): string;
    export function decrypt(text: string, myKey: string): string;
}