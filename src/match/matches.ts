export enum Reliability {
    HIGH,
    NORMAL,
    LOW,
}

export abstract class Match {
    name: string
    id: string
    reliability: Reliability
    domains: string[]
    replace?: boolean
    regex: RegExp
    abstract match(match: RegExpMatchArray): Promise<string>

    notice?: string
}

class Doodstream implements Match {
    name = 'Doodstream'
    id = 'doodstream'
    reliability = Reliability.NORMAL
    domains = [
        'doodstream.com',
        'dood.pm',
        'dood.ws',
        'dood.wf'
    ]
    replace = true
    regex = new RegExp(/(\/pass_md5\/.*?)'.*(\?token=.*?expiry=)/s)

    async match(match: RegExpMatchArray): Promise<string> {
        const response = await fetch(`https://${window.location.host}${match[1]}`, {
            headers: {
                'Range': 'bytes=0-'
            },
            referrer: `https://${window.location.host}/e/${window.location.pathname.split('/').slice(-1)[0]}`,
        });

        return `${await response.text()}1234567890${match[2]}${Date.now()}`
    }
}

class Filemoon implements Match {
    name = 'Filemoon'
    id = 'filemoon'
    reliability = Reliability.HIGH
    domains = [
        'filemoon.sx'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        const start_idx = match.indexOf('moon')

        const prefix = `${match[start_idx]}-${match[start_idx-1]}-${match[start_idx-2]}-${match[start_idx-3]}`
        const time = match.find(m => m.length === 10 && !isNaN(parseInt(m)))
        const offset = !isNaN(parseInt(match[start_idx-12])) && parseInt(match[start_idx-12]).toString().length == match[start_idx-12].length ? 0 : -1

        return `https://${prefix}.filemoon.${match[start_idx-4]}/${match[start_idx-5]}/${match[start_idx-6]}/${match[start_idx-7]}/${match[start_idx-8]}/master.m3u8?t=${match[start_idx-11]}${offset != 0 ? `-${match[start_idx-12]}` : ''}&s=${time}&e=${match[start_idx + offset - 12]}&sp=${match[start_idx + offset - 18]}`
    }
}

class Mixdrop implements Match {
    name = 'Mixdrop'
    id = 'mixdrop'
    reliability = Reliability.NORMAL
    domains = [
        'mixdrop.co'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        const prefix = /(?<=\/\/)[a|s](?=-)/.exec(document.body.innerHTML)[0]
        const subdomain = match[1].length < match[2].length ? match[1] : match[2]
        const domain = match.slice().sort((a, b) => b.length - a.length).find(m => /^[a-z]+$/.test(m))
        const id = match[1].length > match[2].length ? match[1] : match[2]
        const tld = match.find(m => ['net', 'io', 'to', 'sx', 'com'].indexOf(m) !== -1)
        const s = match.slice().sort((a, b) => b.length - a.length).slice(1)[0]
        const e_t = match.find(m => m.length === 10 && !isNaN(parseInt(m)))

        return `https://${prefix}-${subdomain}.${domain}.${tld}/v/${id}.mp4?s=${s}&e=${e_t}&_t=${e_t}`
    }
}

class Mp4Upload implements Match {
    name = 'Mp4Upload'
    id = 'mp4upload'
    reliability = Reliability.NORMAL
    domains = [
        'mp4upload.com'
    ]
    replace = true
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        let id = match.slice().reduce((a, b) => a.length >= b.length ? a : b)
        return `https://www4.mp4upload.com:282/d/${id}/video.mp4`
    }
}

class Newgrounds implements Match {
    name = 'Newgrounds'
    id = 'newgrounds'
    reliability = Reliability.HIGH
    domains = [
        'newgrounds.com'
    ]
    regex = new RegExp(/.*/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        let id = window.location.pathname.split('/').slice(-1)[0]
        let response = await fetch(`https://www.newgrounds.com/portal/video/${id}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        let json = await response.json()
        return decodeURI(json['sources'][Object.keys(json['sources'])[0]][0]['src'])
    }
}

class Streamtape implements Match {
    name = 'Streamtape'
    id = 'streamtape'
    reliability = Reliability.NORMAL
    domains = [
        'streamtape.com'
    ]
    regex = new RegExp(/id=.*(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://streamtape.com/get_video?${match.reverse()[0]}`
    }
}

class Streamzz implements Match {
    name = 'Streamzz'
    id = 'streamzz'
    reliability = Reliability.LOW
    domains = [
        'streamzz.to',
        'streamz.ws'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://get.${document.domain.split('.')[0]}.tw/getlink-${match.sort((a, b) => b.length - a.length)[0]}.dll`
    }
}

class Upstream implements Match {
    name = 'Upstream'
    id = 'upstream'
    reliability = Reliability.NORMAL
    domains = [
        'upstream.to'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://${match[49]}.upstreamcdn.co/hls/${match[148]}/master.m3u8`
    }
}

class Vidoza implements Match {
    name = 'Vidoza'
    id = 'vidoza'
    reliability = Reliability.HIGH
    domains = [
        'vidoza.net'
    ]
    regex = new RegExp(/(?<=src:\s?").+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Voe implements Match {
    name = 'Voe'
    id = 'voe'
    reliability = Reliability.HIGH
    domains = [
        'voe.sx'
    ]
    regex = new RegExp(/https?:\/\/\S*m3u8.+(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vupload implements Match {
    name = 'Vupload'
    id = 'vupload'
    reliability = Reliability.HIGH
    domains = [
        'vupload.com'
    ]
    regex = new RegExp(/(?<=src:\s?").+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

export const matches = [
    new Doodstream(),
    new Filemoon(),
    new Mixdrop(),
    new Mp4Upload(),
    new Newgrounds(),
    new Streamtape(),
    new Streamzz(),
    new Upstream(),
    new Vidoza(),
    new Voe(),
    new Vupload()
]
