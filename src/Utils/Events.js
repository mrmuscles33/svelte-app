const Events = {
    isEnter : (event) => {
        return event.keyCode === 13 || event.wich === 13 || event.code === 'Enter' || event.key === 'Enter';
    },
    isTab : (event) => {
        return event.keyCode === 9 || event.wich === 9 || event.code === 'Tab' || event.key === 'Tab';
    },
    isArrowUp : (event) => {
        return event.keyCode === 38 || event.wich === 38 || event.code === 'ArrowUp' || event.key === 'ArrowUp';
    },
    isArrowDown : (event) => {
        return event.keyCode === 40 || event.wich === 40 || event.code === 'ArrowDown' || event.key === 'ArrowDown';
    },
    isArrowLeft : (event) => {
        return event.keyCode === 37 || event.wich === 37 || event.code === 'ArrowLeft' || event.key === 'ArrowLeft';
    },
    isArrowRight : (event) => {
        return event.keyCode === 39 || event.wich === 39 || event.code === 'ArrowRight' || event.key === 'ArrowRight';
    },
    isArrow : (event) => {
        return Events.isArrowUp(event) || Events.isArrowDown(event) || Events.isArrowLeft(event) || Events.isArrowRight(event);
    }, 
    isEsc : (event) => {
        return event.keyCode === 27 || event.wich === 27 || event.code === 'Escape' || event.key === 'Escape';
    },
    isSpace : (event) => {
        return event.keyCode === 32 || event.wich === 32 || event.code === 'Space' || event.key === 'Space';
    },
    isCtrl : (event) => {
        return event.ctrlKey === true || event.keyCode === 17 || event.wich === 17 || event.code === 'ControlRight' || event.code === 'ControlLeft' || event.key === 'Control';
    },
    isAlt : (event) => {
        return event.altKey === true || event.keyCode === 18 || event.wich === 18 || event.code === 'ControlLeft' || event.key === 'Alt';
    },
    isShift : (event) => {
        return event.shiftKey === true || event.keyCode === 16 || event.wich === 16 || event.code === 'ShiftLeft' || event.code === 'ShiftRight' || event.key === 'Shift';
    },
    isDelete : (event) => {
        return event.keyCode === 8 || event.wich === 8 || event.code === 'Backspace' || event.key === 'Backspace' ||
               event.keyCode === 46 || event.wich === 46 || event.code === 'Delete' || event.key === 'Delete';
    },
    copy : (event) => {
        let newEvent = {};
        for (const property in event) {
                if(typeof event[property] != "function"){ 
                    newEvent[property] = event[property];
                }
        }
        return newEvent;
    }
};
export default Events;