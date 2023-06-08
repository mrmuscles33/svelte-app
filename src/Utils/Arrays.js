const Arrays = {
    sort: (array, attribute, direction) => {
        array.sort((a, b) => {
            if (attribute && direction == 'asc') {
                if ((a[attribute] || '') < (b[attribute] || '')) return -1;
                if ((a[attribute] || '') > (b[attribute] || '')) return 1;
                return 0;
            } else if (attribute && direction == 'desc') {
                if ((a[attribute] || '') > (b[attribute] || '')) return -1;
                if ((a[attribute] || '') < (b[attribute] || '')) return 1;
                return 0;
            } else {
                return a == b ? 0 : a < b;
            }
        });
    }
}
export default Arrays;