'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const pin_1 = require("../pin");
class IntPinAction extends pin_1.PinAction {
    exec(params) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin;
            pin.details.value = this.detail.target;
            pin.onUpdate();
        }
    }
    revertAction() {
        return new IntPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}
/**
 * Float
 * 浮点类型的引脚
 */
class IntPin extends pin_1.Pin {
    constructor() {
        super(...arguments);
        this.color = '#cf71a0';
        this.line = 'normal';
        this.details = {
            value: 0,
        };
        this.contentSlot = `<ui-num-input step="1" ref="num"></ui-num-input>`;
        this.childrenSlot = [];
    }
    onInit() {
        const $num = this.refs.num;
        $num.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: 0,
                };
            }
            const action = new IntPinAction(this, {
                source: this.details.value,
                target: parseFloat($num.value),
            });
            this.exec(action);
        });
    }
    onUpdate() {
        const $num = this.refs.num;
        $num.value = this.details.value + '';
    }
}
IntPin.type = 'int';
(0, pin_1.declarePin)(IntPin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluLWludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ibG9jay1mb3JnZS9pbnRlcm5hbC9waW4taW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFJYixnQ0FBb0Q7QUFNcEQsTUFBTSxZQUFhLFNBQVEsZUFHekI7SUFFRSxJQUFJLENBQUMsTUFFSjtRQUNHLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNGLElBQUksSUFBSSxFQUFFO1lBQ04sYUFBYTtZQUNiLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFpQixDQUFDO1lBQ25DLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNsQjtJQUNMLENBQUM7SUFFRCxZQUFZO1FBQ1IsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzlCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDMUIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtTQUM3QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE1BQU8sU0FBUSxTQUFjO0lBQW5DOztRQUdJLFVBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsU0FBSSxHQUFHLFFBQVEsQ0FBQztRQUNoQixZQUFPLEdBQUc7WUFDTixLQUFLLEVBQUUsQ0FBQztTQUNYLENBQUM7UUFFRixnQkFBVyxHQUFXLGtEQUFrRCxDQUFDO1FBQ3pFLGlCQUFZLEdBQUcsRUFBRSxDQUFDO0lBdUJ0QixDQUFDO0lBckJHLE1BQU07UUFDRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQXVCLENBQUM7UUFDL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRztvQkFDWCxLQUFLLEVBQUUsQ0FBQztpQkFDWCxDQUFDO2FBQ0w7WUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0JBQzFCLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNqQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQXVCLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDekMsQ0FBQzs7QUEvQk0sV0FBSSxHQUFHLEtBQUssQ0FBQztBQWlDeEIsSUFBQSxnQkFBVSxFQUFDLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEhUTUxHcmFwaEZvcmdlRWxlbWVudCB9IGZyb20gJy4uL2ZvcmdlJztcbmltcG9ydCB0eXBlIHsgQmFzZUVsZW1lbnQgfSBmcm9tICdAaXRoYXJib3JzL3VpLWNvcmUnO1xuaW1wb3J0IHsgUGluLCBkZWNsYXJlUGluLCBQaW5BY3Rpb24gfSBmcm9tICcuLi9waW4nO1xuXG50eXBlIEludERldGFpbCA9IHtcbiAgICB2YWx1ZTogbnVtYmVyO1xufTtcblxuY2xhc3MgSW50UGluQWN0aW9uIGV4dGVuZHMgUGluQWN0aW9uPHtcbiAgICBzb3VyY2U6IEludERldGFpbFsndmFsdWUnXSxcbiAgICB0YXJnZXQ6IEludERldGFpbFsndmFsdWUnXSxcbn0+IHtcblxuICAgIGV4ZWMocGFyYW1zOiB7XG4gICAgICAgIGZvcmdlOiBIVE1MR3JhcGhGb3JnZUVsZW1lbnRcbiAgICB9KSB7XG4gICAgICAgIGNvbnN0ICRwaW4gPSBwYXJhbXMuZm9yZ2UuZ2V0UGluRWxlbWVudCh0aGlzLmRldGFpbC5ibG9ja05hbWUsICdpbnB1dCcsIHRoaXMuZGV0YWlsLmluZGV4KTtcbiAgICAgICAgaWYgKCRwaW4pIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbnN0IHBpbiA9ICRwaW4uX19waW4gYXMgRmxvYXRQaW47XG4gICAgICAgICAgICBwaW4uZGV0YWlscy52YWx1ZSA9IHRoaXMuZGV0YWlsLnRhcmdldDtcbiAgICAgICAgICAgIHBpbi5vblVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV2ZXJ0QWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IEludFBpbkFjdGlvbih0aGlzLnBpbiwge1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLmRldGFpbC50YXJnZXQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuZGV0YWlsLnNvdXJjZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEZsb2F0XG4gKiDmta7ngrnnsbvlnovnmoTlvJXohJpcbiAqL1xuY2xhc3MgSW50UGluIGV4dGVuZHMgUGluPEludERldGFpbD4ge1xuICAgIHN0YXRpYyB0eXBlID0gJ2ludCc7XG5cbiAgICBjb2xvciA9ICcjY2Y3MWEwJztcbiAgICBsaW5lID0gJ25vcm1hbCc7XG4gICAgZGV0YWlscyA9IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgfTtcblxuICAgIGNvbnRlbnRTbG90ID0gLypodG1sKi9gPHVpLW51bS1pbnB1dCBzdGVwPVwiMVwiIHJlZj1cIm51bVwiPjwvdWktbnVtLWlucHV0PmA7XG4gICAgY2hpbGRyZW5TbG90ID0gW107XG5cbiAgICBvbkluaXQoKSB7XG4gICAgICAgIGNvbnN0ICRudW0gPSB0aGlzLnJlZnMubnVtIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICRudW0uYWRkRXZlbnRMaXN0ZW5lcignY29uZmlybScsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5kZXRhaWxzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgSW50UGluQWN0aW9uKHRoaXMsIHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuZGV0YWlscy52YWx1ZSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHBhcnNlRmxvYXQoJG51bS52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZXhlYyhhY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgJG51bSA9IHRoaXMucmVmcy5udW0gYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgJG51bS52YWx1ZSA9IHRoaXMuZGV0YWlscy52YWx1ZSArICcnO1xuICAgIH1cbn1cbmRlY2xhcmVQaW4oSW50UGluKTtcbiJdfQ==