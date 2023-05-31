const Times = {
    // FORMATS
    H : 'HH', H_M : 'HH:MM', H_M_S : 'HH:MM:SS', HM : 'HHMM', HMS : 'HHMMSS',
    now : () => {
        let now = new Date();
        return (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds();
    },
    isValid : (pStrTime) => {
        try {
            let regexp = '^([0-1]\\d|2[0-3])((:)?[0-5]\\d)?((:)?[0-5]\\d)?$';
            return new RegExp(regexp).test(pStrTime);
        } catch (error) {
            return false;
        }
    },
    toText : (pTime, pFormat) => {
        let hours = Math.floor(pTime / 60 / 60);
        let minutes = Math.floor((pTime - (hours * 60 * 60)) / 60);
        let seconds = pTime - (hours * 60 * 60) - (minutes * 60);

        return  pFormat.toUpperCase().replace('HH', hours.toString().padStart(2,'0'))
                .replace('MM', minutes.toString().padStart(2,'0'))
                .replace('SS', seconds.toString().padStart(2,'0'));
    },
    toTime : (pStrTime) => {
        return (60 * 60 * Times.getHours(pStrTime)) + (60 * Times.getMinutes(pStrTime)) + (Times.getSeconds(pStrTime));
    },
    getHours : (pStrTime) => {
        let format = Times.getFormat(pStrTime);
        return Times.isValid(pStrTime) ? parseInt(pStrTime.substring(format.indexOf('HH'), 'HH'.length + format.indexOf('HH'))) : 0;
    },
    getMinutes : (pStrTime) => {
        let format = Times.getFormat(pStrTime);
        return Times.isValid(pStrTime) && format.includes('MM') ? parseInt(pStrTime.substring(format.indexOf('MM'), 'MM'.length + format.indexOf('MM'))) : 0;
    },
    getSeconds : (pStrTime) => {
        let format = Times.getFormat(pStrTime);
        return Times.isValid(pStrTime) && format.includes('SS') ? parseInt(pStrTime.substring(format.indexOf('SS'), 'SS'.length + format.indexOf('SS'))) : 0;
    },
    format : (pStrTime, pFormat) => {
        return Times.toText(Times.toTime(pStrTime), pFormat.toUpperCase());
    },
    getPatterns : () => {
        // Defined formats
        let formats = {};
        formats[Times.H_M_S] = '^([0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$';
        formats[Times.HMS] = '^([0-1]\\d|2[0-3])[0-5]\\d[0-5]\\d$';
        formats[Times.H_M] = '^([0-1]\\d|2[0-3]):[0-5]\\d$';
        formats[Times.HM] = '^([0-1]\\d|2[0-3])[0-5]\\d$';
        formats[Times.H] = '^([0-1]\\d|2[0-3])$';
        return formats;
    },
    getPattern : (pFormat) => {
        return Times.getPatterns()[pFormat];
    },
    getFormat : (pStrDate) => {
        // Defined formats
        let formats = Times.getPatterns();
        for (let f in formats) {
            // Reconized format
            if(new RegExp(formats[f]).test(pStrDate)){
                return f;
            }
        }
        return '';
    }
};
export default Times;