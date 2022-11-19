const Dates = {
    // DAYS
    SUNDAY : 0, MONDAY : 1, TUESDAY : 2, WEDNESDAY : 3, THURSDAY : 4, FRIDAY : 5, SATURDAY : 6,
    // MONTHS
    JANUARY : 0, FEBRUARY : 1, MARCH : 2, APRIL : 3, MAY : 4, JUNE : 5, JULY : 6, AUGUST : 7, SEPTEMBER : 8, OCTOBER : 9, NOVMEBER : 10, DECEMBER : 11,
    // FORMATS
    D_M_Y : 'DD/MM/YYYY', M_D_Y : 'MM/DD/YYYY', Y_M_D : 'YYYY/MM/DD', Y_D_M : 'YYYY/DD/MM',
    DMY : 'DDMMYYYY', MDY : 'MMDDYYYY', YMD : 'YYYYMMDD', YDM : 'YYYYDDMM',
    M_Y : 'MM/YYYY', Y_M : 'YYYY/MM', MY : 'MMYYYY', YM : 'YYYYMM',
    today : () => {
        return new Date();
    },
    copy : (pDate) => {
        return new Date(pDate);
    },
    yesterday : () => {
        return Dates.addDays(Dates.today(), -1);
    },
    tomorrow : () => {
        return Dates.addDays(Dates.today(), 1);
    },
    toDate : (pStrDate,pFormat) => {
        let format = (pFormat || Dates.getFormat(pStrDate)).toUpperCase();
        // Transform DD/MM/YYYY to [0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9] or other format
        let regexp = format.trim().replaceAll('D', '[0-9]').replaceAll('M', '[0-9]').replaceAll('Y', '[0-9]').replaceAll('/','\\/').replaceAll('.','\\.');
        if(pStrDate.length == format.length && new RegExp(regexp).test(pStrDate)) {
            return new Date(
                parseInt(pStrDate.substring(format.indexOf('YYYY'), 'YYYY'.length + format.indexOf('YYYY'))), 
                parseInt(pStrDate.substring(format.indexOf('MM'), 'MM'.length + format.indexOf('MM'))) - 1, 
                parseInt(format.includes('DD') ? pStrDate.substring(format.indexOf('DD'), 'DD'.length + format.indexOf('DD')) : '01')
            );
        }
    },
    toText : (pDate,pFormat) => {
        return pFormat.toUpperCase().replace('DD',pDate.getDate().toString().padStart(2,'0'))
                      .replace('MM',(pDate.getMonth() + 1).toString().padStart(2,'0'))
                      .replace('YYYY',pDate.getFullYear())
    },
    isValid(pStrDate,pFormat){
        try {
            let format = (pFormat || Dates.getFormat(pStrDate)).toUpperCase();
            // Undefined format
            if(Dates.getFormat(pStrDate) == null) {
                return false;
            }
            return Dates.toText(Dates.toDate(pStrDate,format), format) == pStrDate;
        } catch (error) {
            return false;
        }
    },
    lastDay : (pDate) => {
        return new Date(pDate.getFullYear(),pDate.getMonth() + 1, 0);
    },
    firstDay : (pDate) => {
        return new Date(pDate.getFullYear(),pDate.getMonth(), 1);
    },
    next : (pDate, pDay) => {
        let retour = new Date(pDate);
        if(pDate.getDay() < pDay) {
            // The day is comming
            retour.setDate(pDate.getDate() + (pDay - pDate.getDay()));
        } else {
            // The day has passed
            retour.setDate(pDate.getDate() + (7 - (pDate.getDay() - pDay)));
        }
        return retour;
    },
    addDays : (pDate, pDays) => {
        let retour = new Date(pDate);
        retour.setDate(pDate.getDate() + pDays);
        return retour;
    },
    addMonth : (pDate, pMonths) => {
        let retour = new Date(pDate);
        retour.setMonth(pDate.getMonth() + pMonths);
        // If the day change, go back to the last day of month
        if(retour.getDate() != pDate.getDate()){
            retour.setDate(0);
        }
        return retour;
    },
    addYear : (pDate, pYears) => {
        let retour = new Date(pDate);
        retour.setFullYear(pDate.getFullYear() + pYears);
        // If the day change, go back to the last day of month
        if(retour.getDate() != pDate.getDate()){
            retour.setDate(0);
        }
        return retour;
    },
    format : (pStrDate, pInFormat, pOutFormat) => {
        let inFormat = (pInFormat || Dates.getFormat(pStrDate)).toUpperCase();
        return Dates.toText(Dates.toDate(pStrDate, inFormat), pOutFormat.toUpperCase());
    },
    getPatterns : () => {
        // Defined formats
        let formats = [];
        formats[Dates.D_M_Y] = '^(([0][1-9])|([1-2]\\d)|([3][0-1]))(\/|-|\.)(([0]\\d)|([1][0-2]))(\/|-|\.)\\d{4}$';
        formats[Dates.M_D_Y] = '^(([0]\\d)|([1][0-2]))(\/|-|\.)(([0][1-9])|([1-2]\\d)|([3][0-1]))(\/|-|\.)\\d{4}$';
        formats[Dates.Y_M_D] = '^\\d{4}(\/|-|\.)(([0]\\d)|([1][0-2]))(\/|-|\.)(([0][1-9])|([1-2]\\d)|([3][0-1]))$';
        formats[Dates.Y_D_M] = '^\\d{4}(\/|-|\.)(([0][1-9])|([1-2]\\d)|([3][0-1]))(\/|-|\.)(([0]\\d)|([1][0-2]))$';
        formats[Dates.DMY] = '^(([0][1-9])|([1-2]\\d)|([3][0-1]))(([0]\\d)|([1][0-2]))\\d{4}$';
        formats[Dates.MDY] = '^(([0]\\d)|([1][0-2]))(([0][1-9])|([1-2]\\d)|([3][0-1]))\\d{4}$';
        formats[Dates.YMD] = '^\\d{4}(([0]\\d)|([1][0-2]))(([0][1-9])|([1-2]\\d)|([3][0-1]))$';
        formats[Dates.YDM] = '^\\d{4}(([0][1-9])|([1-2]\\d)|([3][0-1]))(([0]\\d)|([1][0-2]))$';
        formats[Dates.M_Y] = '^(([0]\\d)|([1][0-2]))(\/|-|\.)\\d{4}$';
        formats[Dates.Y_M] = '^\\d{4}(\/|-|\.)(([0]\\d)|([1][0-2]))$';
        formats[Dates.MY] = '^(([0]\\d)|([1][0-2]))\\d{4}$';
        formats[Dates.YM] = '^\\d{4}(([0]\\d)|([1][0-2]))$';
        return formats;
    },
    getPattern : (pFormat) => {
        return Dates.getPatterns()[pFormat];
    },
    getFormat : (pStrDate) => {
        // Defined formats
        let formats = Dates.getPatterns();
        for (let f in formats) {
            // Reconized format
            if(new RegExp(formats[f]).test(pStrDate)){
                let separators = ['/', '-', '.'];
                // Find separator, if it exists...
                let sep = separators.find(s => pStrDate.includes(s));
                let retour = f;
                if(sep) {
                    // Replace all '/' by real separator 
                    separators.forEach(s => retour.replaceAll(s, sep));
                }
                return retour;
            }
        }
        return '';
    }
};
export default Dates;