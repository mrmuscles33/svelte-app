const Arrays = {
    sort: (array, attribute, direction) => {
        array.sort((a, b) => {
            if (direction == 'asc') {
                if ((a[attribute] || '') < (b[attribute] || '')) return -1;
                if ((a[attribute] || '') > (b[attribute] || '')) return 1;
            } else if (direction == 'desc') {
                if ((a[attribute] || '') > (b[attribute] || '')) return -1;
                if ((a[attribute] || '') < (b[attribute] || '')) return 1;
            } else {
                return a == b ? 0 : a < b;
            }
            return 0;
        });
        return array;
    }
}
export default Arrays;