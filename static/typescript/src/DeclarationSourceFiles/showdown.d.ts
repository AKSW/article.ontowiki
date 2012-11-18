/**
 * Header for Showdown: https://github.com/coreyti/showdown
 */
interface Showdown {
    converter(): any;
    makeHtml(html:string): string;
}

declare var Showdown: Showdown;
