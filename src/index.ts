import { TextPro } from "./textprome";
import { Ephoto360 } from "./ephoto360";
import { PhotoOxy } from "./photooxy";
import { IGenerateNewCookies, IMaker } from "./typings";
export * from './typings';
export class Maker {
    private generateNewCookies(): IGenerateNewCookies {
        let getDate = String(Date.now()).slice(0, 10)
        return {
            textpro: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36',
                'cookie': `_ga=GA1.2.1174806771.${getDate}; _gid=GA1.2.1118436800.${getDate}; PHPSESSID=b55cbog2pn77j0cbguaqq33ou2`
            },
            ephoto: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36',
                'cookie': `_gid=GA1.2.694836508.${getDate}; __gads=ID=e77077076c5a18dc-223769e4b3cf00de:T=${getDate}:RT=${getDate}:S=ALNI_MZ54A8a-CdUL0GH7R1OPfiwplOIyQ; PHPSESSID=1b2hk17njmimvuim3celdji3q3; _ga=GA1.1.170505887.${getDate}; _ga_SK0KDDQM5P=GS1.1.${getDate}.2.1.${getDate}.0`,
            }
        }
    }
    public async TextPro(url: string, text: string[]): Promise<IMaker> {
        return await TextPro(url, text, this.generateNewCookies())
    }
    public async Ephoto360(url: string, text: string[]): Promise<IMaker> {
        return await Ephoto360(url, text, this.generateNewCookies())
    }
    public async PhotoOxy(url: string, text: string[]): Promise<IMaker> {
        return await PhotoOxy(url, text, this.generateNewCookies())
    }
};