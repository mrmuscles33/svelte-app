import Dates from './Dates';

const Arrays = {
    ASC: 'asc', DESC: 'desc',
    EQUALS: 'equals', BEFORE: 'before', AFTER: 'after', BETWEEN: 'between', CONTAINS: 'contains', STARTS: 'starts', ENDS: 'ends', IN: 'in',
    sort: (array, attribute, direction, formatDate) => {
        array.sort((a, b) => {
            const attrA = attribute ? (a[attribute] || '') : a;
            const attrB = attribute ? (b[attribute] || '') : b;
            // ASC
            if (direction == Arrays.ASC) {
                if(formatDate) {
                    if(Dates.equals(attrA, attrB, formatDate)) return 0;
                    else return Dates.before(attrA, attrB, formatDate) ? -1 : 1;
                } else {
                    if (attrA != attrB) return attrA < attrB ? -1 : 1;
                    else return 0;
                }
            }
            // DESC
            if(formatDate) {
                if(Dates.equals(attrA, attrB, formatDate)) return 0;
                else return Dates.before(attrA, attrB, formatDate) ? 1 : -1;
            } else {
                if (attrA != attrB) return attrA < attrB ? 1 : -1;
                else return 0;
            }
        });
        return array;
    },
    filter: (array, filters = []) => {
        return array.filter((item) => {
            return filters.every((filter) => {
                const itemValue = item[filter.property];
                switch (filter.type) {
                    case Arrays.EQUALS:
                        return filter.dateType == 'date' ? Dates.equals(itemValue, filter.value, filter.format) : itemValue == filter.value;
                    case Arrays.BEFORE:
                        return filter.dateType == 'date' ? Dates.before(itemValue, filter.value, filter.format) : itemValue < filter.value;
                    case Arrays.AFTER:
                        return filter.dateType == 'date' ? Dates.after(itemValue, filter.value, filter.format) : itemValue > filter.value;
                    case Arrays.BETWEEN:
                        return filter.dateType == 'date' ? 
                                    (Dates.after(itemValue, filter.min, filter.format) || Dates.equals(itemValue, filter.min, filter.format)) &&
                                    (Dates.before(itemValue, filter.max, filter.format) || Dates.equals(itemValue, filter.max, filter.format))
                                    : itemValue >= filter.min && itemValue <= filter.max;
                    case Arrays.CONTAINS:
                        return itemValue.includes(filter.value);
                    case Arrays.STARTS:
                        return itemValue.startsWith(filter.value);
                    case Arrays.ENDS:
                        return itemValue.endsWith(filter.value);
                    case Arrays.IN:
                        return true; // TODO
                    default:
                        return true;
                }
            });
        });
    }
}
export default Arrays;